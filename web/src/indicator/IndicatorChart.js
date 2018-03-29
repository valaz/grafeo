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


class IndicatorChart extends Component {

    render() {

        let data = this.props.data;
        let chartData = [];

        if (this.props.showAllData) {
            chartData = data;
        } else {
            chartData = data.slice(Math.max(0, data.length - 7), data.length);
        }
        let brush;

        if (this.props.showAllData && data.length > 7) {
            brush = <Brush dataKey="date" startIndex={chartData.length - 7}>
                <AreaChart>
                    <CartesianGrid/>
                    <YAxis hide domain={['auto', 'auto']}/>
                    <Area dataKey="price" stroke="#ff7300" fill="#ff7300" dot={false}/>
                </AreaChart>
            </Brush>;
        }
        return (

            <div className="line-chart-wrapper" style={{width: '100%', height: '200px'}}>
                <ResponsiveContainer>
                    <LineChart
                        width={700}
                        height={350}
                        data={chartData}
                        margin={{top: 10, right: 30, bottom: 5, left: 20}}>
                        <CartesianGrid strokeDasharray="1 1"/>
                        <XAxis dataKey="date"/>
                        <YAxis domain={['auto', 'auto']}/>
                        <Tooltip/>
                        <Line dataKey="value" stroke={getRandomColor(this.props.name)}
                              dot={{stroke: 'red', strokeWidth: 2}}/>
                        {brush}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

export default IndicatorChart;