import React, {Component} from 'react';
import {Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {getRandomColorName} from "../util/Colors";
import moment from "moment";
import {withStyles} from "material-ui/styles/index";
import {injectIntl} from "react-intl";

const dateFormat = 'YYYY-MM-DD';
const brushSize = 30;

const styles = theme => ({
    root: {
        width: '100%',
        height: '250px',
        marginTop: theme.spacing.unit * 3,
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
        this.formatYAxis = this.formatYAxis.bind(this);
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
        return this.props.intl.formatNumber(tickItem);
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

        let chartColor = getRandomColorName(this.props.name);

        if (chartData.length === 0) {
            return null;
        }
        let {classes} = this.props;
        let xTicks = [];
        let yTicks = [];
        let minY = Number.MAX_VALUE;
        let maxY = Number.MIN_VALUE;
        for (let rec of chartData) {
            let value = rec.value;
            if (value) {
                xTicks.push(rec.date);
                yTicks.push(value);
                if (value < minY) {
                    minY = value;
                }
                if (value > maxY) {
                    maxY = value;
                }
            }
        }
        return (
            <div className={classes.root}>
                <ResponsiveContainer>
                    <AreaChart
                        width={700}
                        height={350}
                        data={chartData}
                        margin={{top: 10, right: 0, bottom: 5, left: 0}}>
                        <CartesianGrid strokeDasharray="3" vertical={false}/>
                        <XAxis dataKey="date" padding={{left: 30, right: 5}} tick={{stroke: '#BDBDBD'}}
                               tickFormatter={this.formatXAxis} ticks={xTicks}/>
                        <YAxis orientation="left" mirror={true} axisLine={false} domain={['auto', 'auto']}
                               tick={{stroke: '#BDBDBD'}} tickFormatter={this.formatYAxis}
                        />
                        <Tooltip/>
                        <ReferenceLine y={minY} stroke="red" strokeDasharray="3 3"/>
                        <ReferenceLine y={maxY} stroke="red" strokeDasharray="3 3"/>
                        <Area type="monotone" dataKey="value" stroke={chartColor} fill={chartColor} strokeWidth={2}
                              dot={{stroke: chartColor, strokeWidth: 3}}
                              connectNulls={true}
                              activeDot={{r: 7, onClick: this.handleClick}}/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

export default injectIntl(withStyles(styles)(IndicatorChart));