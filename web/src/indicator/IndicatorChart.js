import React, {Component} from 'react';
import {Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {getRandomColorName} from "../util/Colors";
import moment from "moment";
import {withStyles} from "material-ui/styles/index";
import {injectIntl} from "react-intl";
import {FormControl, FormControlLabel, Grid, MenuItem, Select, Switch} from "material-ui";

const dateFormat = 'YYYY-MM-DD';
const chartDateFormat = 'DD MMM';

const selectGridSize = {
    xs: 12,
    sm: 12,
    md: 4
};
const controlGridSize = {
    xs: 12,
    sm: 6,
    md: 4
};
const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit,
    },
    chart: {
        width: '100%',
        height: '300px',
        marginTop: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        // marginTop: theme.spacing.unit * 2,
    },
});

class IndicatorChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startFromFirst: true,
            endInLast: true,
            period: 'all',
            emptyLeft: false,
            emptyRight: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.getChartData = this.getChartData.bind(this);
        this.formatYAxis = this.formatYAxis.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
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
        let {emptyLeft, emptyRight, period} = this.state;
        let periodLength;
        if (period === 'all') {
            periodLength = 365;
            emptyLeft = false;
        } else if (period === 'week') {
            periodLength = 7;
        } else if (period === 'month') {
            periodLength = 30;
        } else if (period === 'year') {
            periodLength = 365;
        }
        if (this.props.data.length === 0) {
            return [];
        }
        let data = this.props.data.map(r => ({...r}));
        let dates = data.map(d => d['date']);
        const first = moment(data[0]['date']);
        let finish = moment(data[data.length - 1]['date']);
        const now = moment().startOf('day');
        now.add(1, 'days');
        if (emptyRight) {
            finish = now;
        }
        let periodAgo = moment(finish).subtract(periodLength, 'days');
        let start = first;
        if (emptyLeft && first.isAfter(periodAgo)) {
            start = periodAgo
        }
        for (let m = moment(start); m.isBefore(finish); m.add(1, 'days')) {
            if (!dates.includes(m.format(dateFormat))) {
                data.push({
                    date: m.format(dateFormat),
                    value: null
                })
            }
        }

        data.sort(IndicatorChart.compare);

        if (period === 'all') {
            return data
        } else {
            let periodData = data.slice(Math.max(0, data.length - periodLength));
            if (!emptyLeft) {
                let i = 0;
                for (let item of periodData) {
                    if (item.value) {
                        break;
                    } else {
                        i++;
                    }
                }
                periodData = periodData.slice(i);
            }
            return periodData;
        }
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSwitchChange = name => event => {
        this.setState({[name]: event.target.checked});
    };

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
        return moment(tickItem, dateFormat).format(chartDateFormat);
    }

    render() {
        let chartData = this.getChartData();
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
                <Grid container justify='center'>
                    <Grid item {...selectGridSize}>
                        <FormControl className={classes.formControl}>
                            <Select
                                value={this.state.period}
                                onChange={this.handleChange}
                                name="period"
                                className={classes.selectEmpty}
                                autoWidth
                            >
                                <MenuItem
                                    value={'all'}>{this.props.intl.formatMessage({id: 'indicator.view.chart.form.select.all'})}</MenuItem>
                                <MenuItem
                                    value={'week'}>{this.props.intl.formatMessage({id: 'indicator.view.chart.form.select.week'})}</MenuItem>
                                <MenuItem
                                    value={'month'}>{this.props.intl.formatMessage({id: 'indicator.view.chart.form.select.month'})}</MenuItem>
                                <MenuItem
                                    value={'year'}>{this.props.intl.formatMessage({id: 'indicator.view.chart.form.select.year'})}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item {...controlGridSize}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.emptyLeft}
                                    onChange={this.handleSwitchChange('emptyLeft')}
                                    value="emptyLeft"
                                    color="primary"
                                />
                            }
                            label={this.props.intl.formatMessage({id: 'indicator.view.chart.form.control.left'})}
                        />
                    </Grid>
                    <Grid item {...controlGridSize}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.emptyRight}
                                    onChange={this.handleSwitchChange('emptyRight')}
                                    value="emptyRight"
                                    color="primary"
                                />
                            }
                            label={this.props.intl.formatMessage({id: 'indicator.view.chart.form.control.right'})}
                        />
                    </Grid>
                </Grid>
                <div className={classes.chart}>
                    <ResponsiveContainer>
                        <AreaChart
                            width={700}
                            height={350}
                            data={chartData}
                            margin={{top: 10, right: 0, bottom: 5, left: 0}}>
                            <CartesianGrid strokeDasharray="1" vertical={false}/>
                            <XAxis dataKey="date" padding={{left: 30, right: 5}} tick={{stroke: '#BDBDBD'}}
                                   tickFormatter={this.formatXAxis} ticks={xTicks}/>
                            <YAxis orientation="left" mirror={true} axisLine={false} domain={['auto', 'auto']}
                                   tick={{stroke: '#BDBDBD'}} tickFormatter={this.formatYAxis}
                            />
                            <Tooltip/>
                            <ReferenceLine y={minY} stroke="red" strokeDasharray="3 3"/>
                            <ReferenceLine y={maxY} stroke="red" strokeDasharray="3 3"/>
                            <Area type="monotone" dataKey="value" stroke={chartColor} fill={chartColor} strokeWidth={2}
                                  dot={{stroke: chartColor, strokeWidth: 1}}
                                  connectNulls={true}
                                  activeDot={{r: 5, onClick: this.handleClick}}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }
}

export default injectIntl(withStyles(styles)(IndicatorChart));