import React, {Component} from 'react';
import './Indicator.css';
import {Avatar, Card} from 'antd';
import {withRouter} from "react-router-dom";
import {getIndicator} from "../util/APIUtils";
import {notification} from "antd/lib/index";

const {Meta} = Card;


class IndicatorPage extends Component {
    constructor(props) {
        super(props);
        this.loadIndicator = this.loadIndicator.bind(this);
    }

    componentWillMount() {
        const id = this.props.match.params.id;
        this.loadIndicator(id);
    }

    loadIndicator(id) {
        let promise;
        if (this.props.isAuthenticated) {
            promise = getIndicator(id);
        }

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        promise
            .then(response => {
                this.setState({
                    indicator: response,
                    isLoading: false
                })
            }).catch(error => {
            notification.success({
                message: 'Polling App',
                description: error.message,
            });
            this.setState({
                isLoading: false
            })
        });
    }

    render() {
        var view = null;
        let indicator = this.state.indicator;
        if (indicator) {
            view = <Card
                cover={<img alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"/>}
            >
                <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                    title={indicator.name}
                    description="This is the description"
                />
            </Card>
        } else {
            view = <div>NOTHING</div>
        }
        return (
            <div>
                {view}
            </div>
        )
    }
}

export default withRouter(IndicatorPage);