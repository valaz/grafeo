import React, {Component} from 'react';
import './Indicator.css';
import {Button, Card, Col, Divider, Row, Table} from 'antd';
import {addRecord, getIndicator, removeRecord} from "../util/APIUtils";
import {notification} from "antd/lib/index";
import IndicatorChart from "./IndicatorChart";
import {withRouter} from "react-router-dom";
import WrappedAddRecordForm from "./WrappedAddRecordForm";
import LoadingIndicator from "../common/LoadingIndicator";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";
import {injectIntl} from "react-intl";

const {Meta} = Card;


class IndicatorPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indicator: {
                name: ''
            },
            records: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            editDate: null,
            editValue: null
        };
        this.loadIndicator = this.loadIndicator.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentWillMount() {
        this.setState({
            isLoading: true,
            editDate: this.props.editDate,
            editValue: this.props.editValue
        });
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.loadIndicator(id);
        console.log(this.state.indicator.name);
        document.title = "View Indicator";
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
                    records: response.records,
                    isLoading: false
                });
                document.title = this.state.indicator.name;
            }).catch(error => {
            if (error.status === 404 || error.status === 403) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
            console.log(error);
        });
    }

    handleSubmit(date, value) {
        const recordRequest = {
            indicatorId: this.state.indicator.id,
            value: value,
            date: date
        };
        addRecord(recordRequest)
            .then(response => {
                this.setState({
                    indicator: response,
                    records: response.records,
                    editDate: null,
                    editValue: null
                });
            }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Progressio',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
            this.setState({
                editDate: null,
                editValue: null
            });
        });

    }

    handleDelete(text, record) {
        const recordRequest = {
            indicatorId: this.state.indicator.id,
            value: record.value,
            date: record.date
        };
        removeRecord(recordRequest)
            .then(response => {
                this.setState({
                    indicator: response,
                    records: response.records
                });
            }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Progressio',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    handleEdit(text, record) {
        this.setState({
            editDate: record.date,
            editValue: record.value,
        })

    }

    render() {

        if (this.state.isLoading) {
            return <LoadingIndicator/>;
        }

        if (this.state.notFound) {
            return <NotFound/>;
        }

        if (this.state.serverError) {
            return <ServerError/>;
        }

        var card = null;
        var recordTable = null;
        const columns = [{
            title: this.props.intl.formatMessage({id: 'indicator.view.table.header.date'}),
            dataIndex: 'date',
            key: 'date',
        }, {
            title: this.props.intl.formatMessage({id: 'indicator.view.table.header.value'}),
            dataIndex: 'value',
            key: 'value',
        }, {
            title: this.props.intl.formatMessage({id: 'indicator.view.table.header.action'}),
            key: 'action',
            render: (text, record) => (
                <span>
                  <Button onClick={() => this.handleEdit(text, record)} icon="edit"
                          style={{fontSize: 16, color: '#08c'}}/>
                    <Divider type="vertical"/>
                  <Button onClick={() => this.handleDelete(text, record)} icon="delete"
                          style={{fontSize: 16, color: '#ff0000'}}/>
                </span>
            ),
        }];
        let indicator = this.state.indicator;
        var tableRecords = this.state.records.slice(0);
        tableRecords.reverse();
        if (indicator) {
            card =
                <Card>
                    <Meta
                        title={indicator.name}
                    />
                </Card>;
            recordTable = <Table rowKey="date" dataSource={tableRecords} columns={columns}/>
        } else {
            card = <div>NOTHING</div>
        }
        return (
            <Row>
                <Col>
                    {card}
                </Col>
                <Col>
                    <IndicatorChart showAllData={true} data={this.state.records} name={this.state.indicator.name}/>
                </Col>
                <Col>
                    <WrappedAddRecordForm handleSubmit={this.handleSubmit} editDate={this.state.editDate}
                                          editValue={this.state.editValue}/>
                </Col>
                {recordTable}
            </Row>
        )
    }

    hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

}

export default injectIntl(withRouter(IndicatorPage));