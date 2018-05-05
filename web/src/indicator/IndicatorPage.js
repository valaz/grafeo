import React, {Component} from 'react';
import './Indicator.css';
import {addRecord, deleteIndicator, getIndicator, removeRecord} from "../util/APIUtils";
import {withRouter} from "react-router-dom";
import AddRecordForm from "./AddRecordForm";
import LoadingIndicator from "../common/LoadingIndicator";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";
import {injectIntl} from "react-intl";
import CustomPaginationActionsTable from "./CustomPaginationActionsTable";
import {Grid, withStyles} from "material-ui";
import IndicatorChart from "./IndicatorChart";
import IndicatorCard from "./IndicatorCard";
import Notification from "../common/Notification";
import ReactGA from 'react-ga';

const gridSize = {
    xs: 12,
    sm: 10,
    md: 8,
    lg: 8
};

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
            editValue: '',
            notification: {
                open: false,
                message: ''
            },
        };
        this.loadIndicator = this.loadIndicator.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRecordDelete = this.handleRecordDelete.bind(this);
        this.handleIndicatorDelete = this.handleIndicatorDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.clearNotification = this.clearNotification.bind(this);
    }

    clearNotification() {
        this.setState({
            notification: {
                open: false,
                message: ''
            }
        });
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
                ReactGA.event({
                    category: 'Indicator',
                    action: 'Added Record'
                });
                this.setState({
                    indicator: response,
                    records: response.records,
                    editDate: null,
                    editValue: ''
                });
            }).catch(error => {
            console.log(error);
            this.setState({
                notification: {
                    open: true,
                    message: error.message || this.props.intl.formatMessage({id: 'notification.error'})
                }
            });
            this.setState({
                editDate: null,
                editValue: ''
            });
        });

    }

    handleIndicatorDelete(id) {
        let promise;
        if (this.props.isAuthenticated) {
            promise = deleteIndicator(id);
        }

        if (!promise) {
            return;
        }

        promise
            .then(response => {
                ReactGA.event({
                    category: 'Indicator',
                    action: 'Deleted Indicator',
                });
                this.props.history.push("/");
            }).catch(error => {
            console.log(error);
            this.props.history.push("/");
        });
    }

    handleRecordDelete(record) {
        const recordRequest = {
            indicatorId: this.state.indicator.id,
            value: record.value,
            date: record.date
        };
        removeRecord(recordRequest)
            .then(response => {
                ReactGA.event({
                    category: 'Indicator',
                    action: 'Deleted Record'
                });
                this.setState({
                    indicator: response,
                    records: response.records,
                    notification: {
                        open: true,
                        message: this.props.intl.formatMessage({id: 'indicator.view.record.deleted'})
                    },
                    editDate: null,
                    editValue: ''
                });
            }).catch(error => {
            console.log(error);
            this.setState({
                notification: {
                    open: true,
                    message: error.message || this.props.intl.formatMessage({id: 'notification.error'})
                }
            });
        });
    }

    handleEdit(record) {
        this.setState({
            editDate: record.date,
            editValue: record.value,
        })
    }

    notification() {
        let {notification} = this.state;
        return (
            <Notification open={notification.open} message={notification.message}
                          cleanup={this.clearNotification}/>
        )
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

        const {classes} = this.props;

        let form = <AddRecordForm handleSubmit={this.handleSubmit}
                                  editDate={this.state.editDate}
                                  editValue={this.state.editValue}
                                  data={this.state.records}
                                  unit={this.state.indicator.unit}
        />;
        let chart = <IndicatorChart showAllData={true}
                                    data={this.state.records}
                                    name={this.state.indicator.name}
                                    onClickHandler={this.handleEdit}
                                    unit={this.state.indicator.unit}
                                    indicator={this.state.indicator}
        />;
        let table = <CustomPaginationActionsTable dataSource={this.state.records}
                                                  editHadler={this.handleEdit}
                                                  deleteHandler={this.handleRecordDelete}
                                                  unit={this.state.indicator.unit}
        />;
        return (
            <div>
                {this.notification()}
                <Grid container
                      justify="center"
                      direction='column'
                      className={classes.root}>
                    <Grid container item spacing={0} justify="center">
                        <Grid item {...gridSize}>
                            <IndicatorCard indicator={this.state.indicator}
                                           handleDelete={this.handleIndicatorDelete}
                                           form={form}
                                           chart={chart}
                                           table={table}/>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        )
    }

    hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

}

export default injectIntl(withRouter(withStyles(styles)(IndicatorPage)));