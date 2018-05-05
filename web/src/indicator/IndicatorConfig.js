import React, {Component} from 'react';
import {createIndicator, editIndicator, getIndicator} from '../util/APIUtils';
import {INDICATOR_NAME_MAX_LENGTH, UNIT_NAME_MAX_LENGTH} from '../constants';
import {FormattedMessage, injectIntl} from 'react-intl';
import {Button, Grid, Icon, TextField, withStyles} from "material-ui";
import Notification from "../common/Notification";
import ReactGA from 'react-ga';

const gridSize = {
    xs: 12,
    sm: 8,
    md: 6,
    lg: 4
};

const styles = theme => ({
    header: {
        textAlign: 'center'
    }
});

class IndicatorConfig extends Component {
    validateName = (name) => {
        if (name.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'indicator.config.form.name.error.empty'}),
                hasError: true
            }
        } else if (name.length > INDICATOR_NAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'indicator.config.form.name.error.long'}, {maxLength: INDICATOR_NAME_MAX_LENGTH}),
                hasError: true
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
                hasError: false
            };
        }
    };

    validateUnit = (name) => {
        if (name.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'indicator.config.form.unit.error.empty'}),
                hasError: true
            }
        } else if (name.length > UNIT_NAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'indicator.config.form.unit.error.long'}, {maxLength: UNIT_NAME_MAX_LENGTH}),
                hasError: true
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
                hasError: false
            };
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            unit: {
                value: ''
            },
            isEdit: false,
            indicator: {
                name: ''
            },
            notification: {
                open: false,
                message: ''
            },
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.loadIndicator = this.loadIndicator.bind(this);
    }

    componentWillMount() {
        const id = this.props.match.params.id;
        if (id) {
            document.title = this.props.intl.formatMessage({id: 'indicator.config.header.edit'});
            this.setState({
                isEdit: true
            });
            this.loadIndicator(id);
        } else {
            document.title = this.props.intl.formatMessage({id: 'indicator.config.header.create'});
        }
    }

    clearNotification() {
        this.setState({
            notification: {
                open: false,
                message: ''
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.isEdit) {
            this.handleEditSubmit();
        } else {
            this.handleCreateSubmit();
        }
    }

    handleCreateSubmit() {
        const indicatorData = {
            name: this.state.name.value,
            unit: this.state.unit.value.toUpperCase(),
            indicatorLength: this.state.indicatorLength
        };

        createIndicator(indicatorData)
            .then(response => {
                ReactGA.event({
                    category: 'Indicator',
                    action: 'Added Indicator'
                });
                this.props.history.push("/indicator/" + response.id);
            }).catch(error => {
            if (error.status === 401) {
                this.props.handleLogout('/login', 'error', this.props.intl.formatMessage({id: 'indicator.config.notification.logout'}));
            } else {
                this.setState({
                    notification: {
                        open: true,
                        message: error.message || this.props.intl.formatMessage({id: 'notification.error'})
                    }
                });
            }
        });
    }

    handleEditSubmit() {
        const indicatorData = {
            id: this.state.indicator.id,
            name: this.state.name.value,
            unit: this.state.unit.value.toUpperCase(),
            indicatorLength: this.state.indicatorLength
        };
        editIndicator(indicatorData)
            .then(response => {
                ReactGA.event({
                    category: 'Indicator',
                    action: 'Edited Indicator'
                });
                this.props.history.push("/indicator/" + response.id);
            }).catch(error => {
            if (error.status === 401) {
                this.props.handleLogout('/login', 'error', this.props.intl.formatMessage({id: 'indicator.edit.notification.logout'}));
            } else {
                this.setState({
                    notification: {
                        open: true,
                        message: error.message || this.props.intl.formatMessage({id: 'notification.error'})
                    }
                });
            }
        });
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
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
                let indicatorName = response.name;
                let indicatorUnit = response.unit;
                this.setState({
                    indicator: response,
                    name: {
                        value: indicatorName,
                        validateStatus: 'success'
                    },
                    unit: {
                        value: indicatorUnit,
                        validateStatus: 'success'
                    },
                    isLoading: false
                });
                this.checkInput('name', this.state.name.value, this.validateName);
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

    isFormInvalid() {
        return !(this.state.name.validateStatus === 'success' && this.state.unit.validateStatus === 'success');
    }

    checkInput(inputName, inputValue, validationFun) {
        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    render() {
        let nameLabel = this.props.intl.formatMessage({id: 'indicator.config.form.name.label'});
        let unitLabel = this.props.intl.formatMessage({id: 'indicator.config.form.unit.label'});
        const {classes} = this.props;
        return (
            <div style={{padding: 24, background: '#f1f1f1'}}>
                <h1 className={classes.header}>
                    {this.getHeader()}
                </h1>
                <Notification open={this.state.notification.open} message={this.state.notification.message}
                              cleanup={this.clearNotification}/>
                <form onSubmit={this.handleSubmit}>
                    <Grid item xs={12}>
                        <Grid container
                              justify="center"
                              direction='column'
                              spacing={16}>
                            <Grid container item spacing={0} justify="center">
                                <Grid item {...gridSize}>
                                    <TextField fullWidth autoFocus
                                               autoComplete="off"
                                               error={this.state.name.hasError}
                                               helperText={this.state.name.errorMsg}
                                               id="name"
                                               name="name"
                                               label={nameLabel}
                                               value={this.state.name.value}
                                               onChange={(event) => this.handleInputChange(event, this.validateName)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item spacing={0} justify="center">
                                <Grid item {...gridSize}>
                                    <TextField fullWidth
                                               error={this.state.unit.hasError}
                                               helperText={this.state.unit.errorMsg}
                                               id="unit"
                                               name="unit"
                                               label={unitLabel}
                                               value={this.state.unit.value}
                                               onChange={(event) => this.handleInputChange(event, this.validateUnit)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item spacing={0} justify="center" margin='dense'>
                                <Grid item {...gridSize}>
                                    <Button fullWidth type="submit" variant="raised" color="primary" size="large"
                                            disabled={this.isFormInvalid()}>
                                        <Icon type="plus"/>
                                        {this.getSubmitButton()}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }

    getSubmitButton() {
        if (this.state.isEdit) {
            return <FormattedMessage id="indicator.config.form.button.edit"/>;
        } else {
            return <FormattedMessage id="indicator.config.form.button.create"/>;
        }
    }

    getHeader() {
        if (this.state.isEdit) {
            return <FormattedMessage id="indicator.config.header.edit"/>;
        } else {
            return <FormattedMessage id="indicator.config.header.create"/>;
        }
    }
}

export default injectIntl(withStyles(styles)(IndicatorConfig));