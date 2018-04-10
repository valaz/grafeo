import React, {Component} from 'react';
import {FormattedMessage, injectIntl} from "react-intl";
import {Button, Grid, TextField, withStyles} from "material-ui";
import {DatePicker} from "material-ui-pickers";
import moment from "moment";

const dateFormat = 'YYYY-MM-DD';
const datePickerFormat = "LL";

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        paddingRight: 24,
        paddingLeft: 24,
    },
    textField: {},
    picker: {
        day: {
            color: '#fff',
        },
        selected: {
            backgroundColor: '#fff',
        },
        current: {
            color: '#fff',
        },
    },
    button: {
        marginTop: '10px'
    }
});

class AddRecordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: {
                value: null
            },
            value: {
                value: ''
            },
            notification: {
                open: false,
                message: ''
            },
            editDate: null,
            editValue: null,
            selectedDate: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editValue && nextProps.editValue > 0) {
            let valueValue = nextProps.editValue;
            this.setState({
                value: {
                    value: valueValue,
                    ...this.validateValue(valueValue)
                }
            });
        }
        if (nextProps.editDate) {
            let dateValue = moment(nextProps.editDate, dateFormat);
            this.setState({
                date: {
                    value: dateValue,
                    ...this.validateDate(dateValue)
                }
            });
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: {
                value: event.target.value
            },
        });
    };

    editDateValue(date, value) {
        const {resetFields} = this.props.form;
        const {setFields} = this.props.form;
        resetFields();
        setFields({
            valueInput: {
                value: value
            }

        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let date = this.state.date.value.format(dateFormat);
        let value = this.state.value.value;
        this.resetFields();
        this.props.handleSubmit(date, value);
    }

    resetFields() {
        this.setState({
            date: {
                value: null,
                validateStatus: null,
                errorMsg: null,
                hasError: false

            },
            value: {
                value: '',
                validateStatus: null,
                errorMsg: null,
                hasError: false

            },
        })
    }

    isFormInvalid() {
        return !(this.state.date.validateStatus === 'success' &&
            this.state.value.validateStatus === 'success'
        );
    }

    handleDateChange(value, validationFun) {
        this.setState({
            date: {
                value: value,
                ...validationFun(value)
            },
            editDate: value.format(dateFormat)
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

    render() {
        const selectedDate = this.state.date.value;
        const {classes} = this.props;
        return (
            <form onSubmit={this.handleSubmit} style={{textAlign: 'center'}} className={classes.root}>
                <Grid container
                      spacing={24}>
                    <Grid item xs={12} sm={6} md={4} align="center">
                        <DatePicker fullWidth
                                    autoOk
                                    error={this.state.date.hasError}
                                    helperText={this.state.date.errorMsg}
                                    id="date"
                                    name="date"
                                    label={this.props.intl.formatMessage({id: 'indicator.view.form.date.placeholder'})}
                                    cancelLabel={this.props.intl.formatMessage({id: 'indicator.view.form.date.cancel'})}
                                    okLabel={this.props.intl.formatMessage({id: 'indicator.view.form.date.ok'})}
                                    todayLabel={this.props.intl.formatMessage({id: 'indicator.view.form.date.today'})}
                                    showTodayButton
                                    disableFuture
                                    format={datePickerFormat}
                                    maxDateMessage="Date must be less than today"
                                    value={selectedDate}
                                    onChange={(event) => this.handleDateChange(event, this.validateDate)}
                                    animateYearScrolling={false}
                                    className={classes.picker}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} align="center">
                        <TextField fullWidth
                                   error={this.state.value.hasError}
                                   helperText={this.state.value.errorMsg}
                                   id="value"
                                   name="value"
                                   label={this.props.intl.formatMessage({id: 'indicator.view.form.value.placeholder'})}
                                   value={this.state.value.value}
                                   onChange={(event) => this.handleInputChange(event, this.validateValue)}
                                   type="number"
                                   className={classes.textField}

                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} align="center">
                        <Button fullWidth type="submit" variant="raised" color="primary" size="large"
                                disabled={this.isFormInvalid()} className={classes.button}>
                            <FormattedMessage id="indicator.view.form.submit"/>
                        </Button>
                    </Grid>
                </Grid>
            </form>
        )
    }

    validateValue = (value) => {
        if (value) {
            return {
                validateStatus: 'success',
                errorMsg: '',
                hasError: false
            }
        } else {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'indicator.view.form.value.error.empty'}),
                hasError: true
            }
        }
    };

    validateDate = (date) => {
        if (date !== null) {
            return {
                validateStatus: 'success',
                errorMsg: '',
                hasError: false
            }
        } else {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'indicator.view.form.date.error.empty'}),
                hasError: true
            }
        }
    };
}

export default injectIntl(withStyles(styles)(AddRecordForm));