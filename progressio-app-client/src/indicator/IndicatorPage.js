import React, {Component} from 'react';
import './Indicator.css';
import {Card, Divider, Icon, Table} from 'antd';
import {addRecord, getIndicator, removeRecord} from "../util/APIUtils";
import {notification} from "antd/lib/index";
import IndicatorChart from "./IndicatorChart";
import {withRouter} from "react-router-dom";
import WrappedAddRecordForm from "./AddRecordForm";

const {Meta} = Card;


class IndicatorPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indicator: null,
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
                    records: response.records,
                    isLoading: false
                })
            }).catch(error => {
            console.log(error);
            this.setState({
                isLoading: false
            })
        });
    }

    handleSubmit(date, value) {
        this.setState({
            isLoading: true
        });
        const recordRequest = {
            indicatorId: this.state.indicator.id,
            value: value,
            date: date
        };
        addRecord(recordRequest)
            .then(response => {
                notification.success({
                    message: 'Polling App',
                    description: "Record added successfully",
                });
                this.setState({
                    isLoading: false,
                    indicator: response,
                    records: response.records
                });
            }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Polling App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
            this.setState({
                isLoading: false
            });
        });

    }

    handleDelete(text, record) {
        this.setState({
            isLoading: true
        });
        const recordRequest = {
            indicatorId: this.state.indicator.id,
            value: record.value,
            date: record.date
        };
        removeRecord(recordRequest)
            .then(response => {
                notification.success({
                    message: 'Polling App',
                    description: "Record removed successfully",
                });
                this.setState({
                    isLoading: false,
                    indicator: response,
                    records: response.records
                });
            }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Polling App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
            this.setState({
                isLoading: false
            });
        });
    }

    handleEdit(text, record) {
        this.setState({
            isLoading: true
        });
        this.setState({
            editDate: record.date,
            editValue: record.value,
        })
    }

    render() {
        var view = null;
        var recordTable = null;
        const columns = [{
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        }, {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                  <Icon onClick={() => this.handleEdit(text, record)} type="edit"/>
                    <Divider type="vertical"/>
                  <Icon onClick={() => this.handleDelete(text, record)} type="delete"/>
                </span>
            ),
        }];
        let indicator = this.state.indicator;
        var tableRecords = this.state.records.slice(0);
        tableRecords = tableRecords.reverse();
        if (indicator) {
            view =
                <Card>
                    <Meta
                        title={indicator.name}
                        description="This is the description"
                    />
                </Card>;
            recordTable = <Table rowKey="date" dataSource={tableRecords} columns={columns}/>
        } else {
            view = <div>NOTHING</div>
        }
        return (
            <div className="polls-container">
                {view}
                <IndicatorChart showAllData={true} data={this.state.records}/>
                <WrappedAddRecordForm handleSubmit={this.handleSubmit} editDate={this.state.editDate}
                                      editValue={this.state.editValue}/>
                {recordTable}
            </div>
        )
    }

    hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

}

export default withRouter(IndicatorPage);