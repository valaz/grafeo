import React, {Component} from 'react';
import './Indicator.css';
import {Card, Icon} from 'antd';
import {withRouter} from "react-router-dom";
import IndicatorChart from "./IndicatorChart";

const {Meta} = Card;


class Indicator extends Component {


    componentWillMount() {
        this.setState({
            records: this.props.indicator.records
        });
    }

    handleView() {
        this.props.history.push("/indicator/" + this.props.indicator.id);
    }

    render() {
        return (
            <div>
                <Card
                    cover={<IndicatorChart showAllData={false} data={this.state.records}/>}
                    actions={[<Icon type="eye-o" onClick={() => this.handleView()}/>, <Icon type="setting"/>]}
                >
                    <Meta
                        title={this.props.indicator.name}
                        description="This is the description"
                    />
                </Card>
                <br/>
            </div>
        )
    }
}

export default withRouter(Indicator);