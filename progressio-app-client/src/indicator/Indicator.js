import React, {Component} from 'react';
import './Indicator.css';
import {Card, Col, Icon} from 'antd';
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
            <Col xs={24} md={12} xl={8}>
                <Card className="indicator-card"
                      cover={<IndicatorChart showAllData={false} data={this.state.records}
                                             name={this.props.indicator.name}/>}
                      actions={[<Icon type="eye-o" onClick={() => this.handleView()}/>, <Icon type="setting"/>]}
                >
                    <Meta
                        title={this.props.indicator.name}
                    />
                </Card>
            </Col>
        )
    }
}

export default withRouter(Indicator);