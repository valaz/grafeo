import React, {Component} from 'react';
import './Indicator.css';
import {Button, Col, Divider, Row} from 'antd';
import {addRecord, getIndicator, removeRecord} from "../util/APIUtils";
import {notification} from "antd/lib/index";
import {withRouter} from "react-router-dom";
import AddRecordForm from "./AddRecordForm";
import LoadingIndicator from "../common/LoadingIndicator";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";
import {injectIntl} from "react-intl";
import moment from "moment/moment";
import CustomPaginationActionsTable from "./CustomPaginationActionsTable";
import {Paper, Typography, withStyles} from "material-ui";
import IndicatorChart from "./IndicatorChart";

const dateFormat = 'YYYY-MM-DD';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        paddingRight: 16,
        paddingLeft: 16,
    },
    header: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
    }),
});

class IndicatorPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indicator: {
                name: ''
            },
            records: [],
            tableRecords: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            editDate: null,
            editValue: ''
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
                    tableRecords: this.getTableRecords(response.records),
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
                    tableRecords: this.getTableRecords(response.records),
                    editDate: null,
                    editValue: ''
                });
            }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Progressio',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
            this.setState({
                editDate: null,
                editValue: ''
            });
        });

    }

    getTableRecords(records) {
        let tableRecords = records.map(r => ({...r}));
        tableRecords.reverse();
        tableRecords.map(d => d['tableDate'] = moment(d['date'], dateFormat).format('DD MMMM'));
        return tableRecords;
    }

    handleDelete(record) {
        const recordRequest = {
            indicatorId: this.state.indicator.id,
            value: record.value,
            date: record.date
        };
        removeRecord(recordRequest)
            .then(response => {
                this.setState({
                    indicator: response,
                    records: response.records,
                    tableRecords: this.getTableRecords(response.records),
                });
            }).catch(error => {
            console.log(error);
            notification.error({
                message: 'Progressio',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    handleEdit(record) {
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

        let indicator = this.state.indicator;
        const {classes} = this.props;

        let header = null;
        if (indicator) {
            header =
                <Paper className={classes.header} elevation={4}>
                    <Typography variant="headline" component="h3">
                        {indicator.name}
                    </Typography>
                </Paper>
        } else {
            header =
                <Paper className={classes.header} elevation={4}>
                    <Typography variant="headline" component="h3">
                        NOTHING
                    </Typography>
                </Paper>
        }

        return (
            <Row className={classes.header}>
                <Col>
                    {header}
                </Col>
                <Col>
                    <AddRecordForm handleSubmit={this.handleSubmit} editDate={this.state.editDate}
                                   editValue={this.state.editValue} data={this.state.records}/>
                </Col>
                <Col>
                    <Paper>
                        <IndicatorChart showAllData={true} data={this.state.records}
                                        name={this.state.indicator.name}
                                        onClickHandler={this.handleEdit}/>
                    </Paper>
                </Col>
                <div>
                    <CustomPaginationActionsTable dataSource={this.state.tableRecords} editHadler={this.handleEdit}
                                                  deleteHandler={this.handleDelete}/>
                </div>
            </Row>
        )
    }

    hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

}

export default injectIntl(withRouter(withStyles(styles)(IndicatorPage)));