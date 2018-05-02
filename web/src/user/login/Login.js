import React, {Component} from 'react';
import {login} from '../../util/APIUtils';
import {ACCESS_TOKEN} from '../../constants';
import {FormattedMessage, injectIntl} from "react-intl";
import {Button, Grid, TextField, withStyles} from "material-ui";
import Notification from "../../common/Notification";
import {Link} from "react-router-dom";

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

class Login extends Component {
    render() {
        const AntWrappedLoginForm = injectIntl(LoginForm);
        const {classes} = this.props;
        return (
            <div style={{padding: 24, background: '#f1f1f1'}}>
                <h1 className={classes.header}>
                    <FormattedMessage id="login.header"/>
                </h1>
                <AntWrappedLoginForm onLogin={this.props.onLogin}/>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: {
                value: ''
            },
            password: {
                value: ''
            },
            notification: {
                open: false,
                message: ''
            },
            isLoading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearNotification = this.clearNotification.bind(this);
    }

    componentDidMount() {
        document.title = this.props.intl.formatMessage({id: 'login.header'});
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
        this.setState({
            isLoading: true
        });
        let loginRequest = {
            usernameOrEmail: this.state.username.value,
            password: this.state.password.value
        };
        login(loginRequest)
            .then(response => {
                this.setState({
                    isLoading: false
                });
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                this.props.onLogin();
            }).catch(error => {
            console.log(error);
            if (error.status === 401) {
                this.setState({
                    isLoading: false,
                    notification: {
                        open: true,
                        message: this.props.intl.formatMessage({id: 'login.notification.incorrect'})
                    }
                });
            } else {
                this.setState({
                    isLoading: false,
                    notification: {
                        open: true,
                        message: error.message || this.props.intl.formatMessage({id: 'notification.error'})
                    }
                });
            }
        });
    }

    isFormInvalid() {
        return !(this.state.username.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
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
        let usernamePlaceholder = this.props.intl.formatMessage({id: 'login.form.username.placeholder'});
        let passwordPlaceholder = this.props.intl.formatMessage({id: 'login.form.password.placeholder'});
        return (
            <div>
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
                                               disabled={this.state.isLoading}
                                               error={this.state.username.hasError}
                                               helperText={this.state.username.errorMsg}
                                               id="username"
                                               name="username"
                                               label={usernamePlaceholder}
                                               value={this.state.username.value}
                                               onChange={(event) => this.handleInputChange(event, this.validateUsername)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item spacing={0} justify="center">
                                <Grid item {...gridSize}>
                                    <TextField fullWidth
                                               disabled={this.state.isLoading}
                                               error={this.state.password.hasError}
                                               helperText={this.state.password.errorMsg}
                                               id="password"
                                               name="password"
                                               label={passwordPlaceholder}
                                               type="password"
                                               autoComplete="current-password"
                                               value={this.state.password.value}
                                               onChange={(event) => this.handleInputChange(event, this.validatePassword)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item spacing={0} justify="center" margin='dense'>
                                <Grid item {...gridSize}>
                                    <Button fullWidth type="submit" variant="raised" color="primary" size="large"
                                            disabled={this.isFormInvalid() || this.state.isLoading}>
                                        <FormattedMessage id="login.form.submit"/>
                                    </Button>
                                    <FormattedMessage id="login.form.register.or"/> <Link to="/signup">
                                    <FormattedMessage id="login.form.register.now"/>
                                </Link>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </div>
        )
    }

    validateUsername = (username) => {
        if (username.length > 0) {
            return {
                validateStatus: 'success',
                errorMsg: '',
                hasError: false
            }
        } else {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'login.form.username.error.empty'}),
                hasError: true
            }
        }
    };

    validatePassword = (password) => {
        if (password.length > 0) {
            return {
                validateStatus: 'success',
                errorMsg: '',
                hasError: false
            }
        } else {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'login.form.password.error.empty'}),
                hasError: true
            }
        }
    };
}

export default injectIntl(withStyles(styles)(Login));