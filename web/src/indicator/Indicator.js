import React, {Component} from 'react';
import './Indicator.css';
import {Card, Col, Icon} from 'antd';
import {withRouter} from "react-router-dom";

const {Meta} = Card;


class Indicator extends Component {


    componentWillMount() {
        this.setState({
            records: this.props.indicator.records,
            isDeleted: false
        });
    }

    handleView() {
        this.props.history.push("/indicator/" + this.props.indicator.id);
    }

    handleEdit() {
        this.props.history.push("/indicator/edit/" + this.props.indicator.id);
    }

    handleDelete() {
        this.props.handleDelete(this.props.indicator.id);
        this.setState({
            isDeleted: true
        })
    }

    render() {
        if (this.state.isDeleted) {
            return null;
        }
        return (
            <Col xs={24} md={12} xl={8}>
                <Card className="indicator-card"
                      actions={[<Icon type="eye-o" onClick={() => this.handleView()}/>,
                          <Icon type="edit" onClick={() => this.handleEdit()}/>,
                          <Icon type="delete" onClick={() => this.handleDelete()}/>]}
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