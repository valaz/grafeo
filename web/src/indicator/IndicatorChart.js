import React, {Component} from 'react';
import {
    Area,
    AreaChart,
    Brush,
    CartesianGrid,
    Line,
    LineChart,
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
        height: '250px',
        marginTop: theme.spacing.unit * 3,
        background: '#E8EAF6'
    }
});

class IndicatorChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startFromFirst: true
        };
        this.handleClick = this.handleClick.bind(this);
        this.getChartData = this.getChartData.bind(this);
    }

    handleClick(event) {
        if (this.props.onClickHandler) {
            this.props.onClickHandler(event.payload)
        }
    }

    componentDidMount() {
        this.setState(
            {
                data: this.props.data,
            }
        )
    }

    getChartData() {
        let {startFromFirst} = this.state;
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
        if (!startFromFirst && first.isAfter(monthAgo)) {
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

    formatYAxis(tickItem) {
        return tickItem;
    }

    formatXAxis(tickItem) {
        return moment(tickItem, dateFormat).format('DD MMM');
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
        let {classes} = this.props;
        let xTicks = [];
        for (let rec of chartData) {
            if (rec.value) {
                xTicks.push(rec.date);
            }
        }
        return (
            <div className={classes.root}>
                <ResponsiveContainer>
                    <LineChart
                        width={700}
                        height={350}
                        data={chartData}
                        margin={{top: 10, right: -30, bottom: 5, left: 0}}>
                        <CartesianGrid strokeDasharray="3" vertical={false}/>
                        <XAxis dataKey="date" padding={{left: 30}} tick={{stroke: '#BDBDBD'}}
                               tickFormatter={this.formatXAxis} ticks={xTicks}/>
                        <YAxis orientation="right" mirror={false} axisLine={false}
                               tick={{stroke: '#BDBDBD'}} tickFormatter={this.formatYAxis}
                               domain={['auto', 'auto']}/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2}
                              dot={{stroke: chartColor, strokeWidth: 3}}
                              connectNulls={true}
                              activeDot={{r: 7, onClick: this.handleClick}}/>
                        {/*{brush}*/}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

export default withStyles(styles)(IndicatorChart);