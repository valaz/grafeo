import React, {Component} from 'react';
import {facebookLogin, login} from '../../util/APIUtils';
import {ACCESS_TOKEN} from '../../constants';
import {FormattedMessage, injectIntl} from "react-intl";
import {Button, Grid, TextField, withStyles} from '@material-ui/core';
import Notification from "../../common/Notification";
import {Link} from "react-router-dom";
import FacebookLogin from '@greatsumini/react-facebook-login';
import FBLoginButton from "./FBLoginButton";
import LoadingIndicator from "../../common/LoadingIndicator";
import settings from "../../config";

const gridSize = {
    xs: 12,
    sm: 8,
    md: 6,
    lg: 3
};

const styles = theme => ({
    header: {
        textAlign: 'center'
    },
    root: {
        padding: '16px',
        background: '#f1f1f1'
    }
});

class Login extends Component {
    render() {
        const AntWrappedLoginForm = injectIntl(withStyles(styles)(LoginForm));
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
        this.responseFacebook = this.responseFacebook.bind(this);
        this.componentClicked = this.componentClicked.bind(this);
        this.clearNotification = this.clearNotification.bind(this);
    }

    componentDidMount() {
        document.title = this.props.intl.formatMessage({id: 'login.header'});
    }

    responseFacebook(response) {
        console.log(response);
        // if (!response.name || !response.email || !response.userID || !response.accessToken) {
        if (!response.userID || !response.accessToken) {
            this.setState({
                isLoading: false,
                notification: {
                    open: true,
                    message: this.props.intl.formatMessage({id: 'notification.error'})
                }
            });
        } else {
            this.setState({
                isLoading: true,
            });
            const fbLoginRequest = {
                userId: response.userID,
                token: response.accessToken,
            };
            facebookLogin(fbLoginRequest)
                .then(response => {
                    this.setState({
                        isLoading: false
                    });

                    console.log("Clearing Local Storage - New Facebook Login")
                    localStorage.clear();
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    this.props.onLogin();
                }).catch(error => {
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
                            message: this.props.intl.formatMessage({id: 'notification.error'})
                        }
                    });
                }
            });
        }
    }

    componentClicked(response) {
        this.setState({
            isLoading: true
        });
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
                console.log("Clearing Local Storage - handleSubmit on Login")
                localStorage.clear();
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                this.props.onLogin();
            }).catch(error => {
            if (error.status === 401) {
                this.setState({
                    isLoading: false,
                    notification: {
                        open: true,
                        message: this.props.intl.formatMessage({id: 'login.notification.incorrect'})
                    }
                });
            } else if (error.status === 405) {
                this.setState({
                    isLoading: false,
                    notification: {
                        open: true,
                        message: this.props.intl.formatMessage({id: 'login.notification.use_facebook'})
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

    notification() {
        let {notification} = this.state;
        return (
            <Notification open={notification.open} message={notification.message}
                          cleanup={this.clearNotification}/>
        )
    }

    render() {
        const {classes} = this.props;
        let usernamePlaceholder = this.props.intl.formatMessage({id: 'login.form.username.placeholder'});
        let passwordPlaceholder = this.props.intl.formatMessage({id: 'login.form.password.placeholder'});
        let or = this.props.intl.formatMessage({id: 'login.form.or'});
        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    {this.notification()}
                    <LoadingIndicator/>
                </div>)
        } else {
            let fbAppId =  settings.FB_APP_ID;
            return (
                <div>
                    {this.notification()}
                    <form onSubmit={this.handleSubmit}>
                        <Grid item xs={12}>
                            <Grid container
                                  justify="center"
                                  direction='column'
                                  spacing={2}>
                                <Grid container item spacing={8} justify="center" margin='dense'>
                                    <Grid item {...gridSize}>
                                        <FacebookLogin
                                            appId={fbAppId}
                                            isMobile={false}
                                            autoLoad={false}
                                            fields="name,email"
                                            onSuccess={this.responseFacebook}
                                            render={renderProps => (
                                                <FBLoginButton onClick={renderProps.onClick}/>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <h2 className={classes.header}>
                                    {or}
                                </h2>
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
                                        <Button fullWidth type="submit" variant="contained" color="primary" size="large"
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