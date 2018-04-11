import React, {Component} from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    Brush,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {getRandomColor} from "../util/Colors";
import moment from "moment";
import {withStyles} from "material-ui/styles/index";

const dateFormat = 'YYYY-MM-DD';
const brushSize = 30;

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    }
});

class IndicatorChart extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.getChartData = this.getChartData.bind(this);
    }

    handleClick(event) {
        if (this.props.onClickHandler) {
            this.props.onClickHandler(event)
        }
    }

    componentDidMount() {
        this.setState(
            {
                data: this.props.data
            }
        )
    }

    getChartData() {
        if (this.props.data.length === 0) {
            return [];
        }
        let data = this.props.data.map(r => ({...r}));
        data.map(d => d['chartDate'] = moment(d['date'], dateFormat).format('DD MMM'));
        let dates = data.map(d => d['date']);
        const first = moment(data[0]['date']);
        const now = moment().startOf('day');
        now.add(1, 'days');
        let monthAgo = moment(now).subtract(brushSize, 'days');
        let start = first;
        if (first.isAfter(monthAgo)) {
            start = monthAgo
        }
        for (let m = moment(start); m.isBefore(now); m.add(1, 'days')) {
            if (!dates.includes(m.format('YYYY-MM-DD'))) {
                data.push({
                    chartDate: m.format('DD MMM'),
                    date: m.format('YYYY-MM-DD'),
                    value: null
                })
            }
        }

        data.sort(IndicatorChart.compare);
        return data
    }

    static compare(a, b) {
        if (a.date < b.date)
            return -1;
        if (a.date > b.date)
            return 1;
        return 0;
    }

    render() {
        let data = this.getChartData();
        let chartData = [];

        if (this.props.showAllData) {
            chartData = data;
        } else {
            chartData = data.slice(Math.max(0, data.length - brushSize), data.length);
        }
        let brush;

        let chartColor = getRandomColor(this.props.name);
        if (this.props.showAllData && data.length > brushSize) {
            brush = <Brush dataKey="date" startIndex={chartData.length - brushSize}>
                <AreaChart>
                    <CartesianGrid/>
                    <YAxis hide domain={['auto', 'auto']}/>
                    <Area dataKey="value" type='monotone' stroke={chartColor}
                          connectNulls={true}
                          fill={chartColor} dot={false}/>
                </AreaChart>
            </Brush>;
        }

        if (chartData.length === 0) {
            return null;
        }

        return (
            <div className="line-chart-wrapper" style={{width: '100%', height: '250px'}}>
                <ResponsiveContainer>
                    <BarChart
                        width={700}
                        height={350}
                        data={chartData}
                        margin={{top: 10, right: 0, bottom: 5, left: 0}}>
                        <CartesianGrid strokeDasharray="1 1"/>
                        <ReferenceLine y={0} stroke='#000'/>
                        <XAxis dataKey="chartDate"/>
                        <YAxis orientation="left" mirror={true} scale='linear'/>
                        <Tooltip/>
                        <Bar dataKey="value" fill={chartColor} onClick={(d, i) => this.handleClick(d)}/>
                        {brush}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

export default withStyles(styles)(IndicatorChart);