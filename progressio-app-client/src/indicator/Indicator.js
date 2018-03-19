import React, {Component} from 'react';
import './Indicator.css';
import {Avatar, Card, Icon} from 'antd';
import {withRouter} from "react-router-dom";

const {Meta} = Card;


class Indicator extends Component {

    handleEdit() {
        this.props.history.push("/indicator/" + this.props.indicator.id);
    }

    render() {
        return (
            <Card
                style={{marginBottom: 25}}
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"/>}
                actions={[<Icon type="setting"/>, <Icon type="edit" onClick={() => this.handleEdit()}/>]}
            >
                <Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>}
                    title={this.props.indicator.name}
                    description="This is the description"
                />
            </Card>
        )
    }
}

export default withRouter(Indicator);