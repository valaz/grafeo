import React, {Component} from 'react';
import {facebookLogin, login} from '../../util/APIUtils';
import {ACCESS_TOKEN} from '../../constants';
import {FormattedMessage, injectIntl} from "react-intl";
import {Grid, withStyles} from '@material-ui/core';
import Notification from "../../common/Notification";
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

    render() {
        const {classes} = this.props;
        if (this.state.isLoading) {
            return (
                <div className={classes.root}>
                    <LoadingIndicator/>
                </div>)
        } else {
            let fbAppId =  settings.FB_APP_ID;
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
                                <Grid container item spacing={0} justify="center" margin='dense'>
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
                            </Grid>
                        </Grid>
                    </form>
                </div>
            )
        }
    }
}

export default injectIntl(withStyles(styles)(Login));