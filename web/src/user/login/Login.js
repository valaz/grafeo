import React, {Component} from 'react';
import {login} from '../../util/APIUtils';
import {ACCESS_TOKEN} from '../../constants';
import {FormattedMessage, injectIntl} from "react-intl";
import {Button, Grid, IconButton, Snackbar, TextField} from "material-ui";
import {Close} from '@material-ui/icons'


class Login extends Component {
    render() {
        const AntWrappedLoginForm = injectIntl(LoginForm);
        return (
            <div style={{padding: 24, background: '#f1f1f1'}}>
                <h1 className="page-title">
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
            showPassword: false,
            notification: {
                open: false,
                message: ''
            },
            open: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.title = this.props.intl.formatMessage({id: 'login.header'});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.username.value);
        console.log(this.state.password.value);
        let loginRequest = {
            usernameOrEmail: this.state.username.value,
            password: this.state.password.value
        };
        login(loginRequest)
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                this.props.onLogin();
            }).catch(error => {
            console.log(error);
            if (error.status === 401) {
                this.setState({
                    notification: {
                        open: true,
                        message: this.props.intl.formatMessage({id: 'login.notification.incorrect'})
                    }
                });
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

    handleClick = () => {
        this.setState({open: true});
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({
            notification: {
                open: false,
                message: ''
            }
        });
    };

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
        let snackbar = this.getSnackBar();
        return (
            <div>
                {snackbar}
                <form onSubmit={this.handleSubmit}>
                    <Grid item xs={12}>
                        <Grid container
                              justify="center"
                              direction='column'
                              spacing={16}>
                            <Grid container item spacing={0} justify="center">
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <TextField fullWidth autoFocus
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
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <TextField fullWidth
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
                            <Grid container item spacing={0} justify="center">
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Button fullWidth type="submit" variant="raised" color="primary" size="large"
                                            disabled={this.isFormInvalid()}>
                                        <FormattedMessage id="login.form.submit"/>
                                    </Button>
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

    getSnackBar() {
        return <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={this.state.notification.open}
            autoHideDuration={3000}
            onClose={this.handleClose}
            SnackbarContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.notification.message}</span>}
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={this.handleClose}
                >
                    <Close/>
                </IconButton>,
            ]}
        />;
    }
}

export default injectIntl(Login);