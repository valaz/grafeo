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
            username: '',
            password: '',
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
        console.log(this.state.username);
        console.log(this.state.password);
        let loginRequest = {
            usernameOrEmail: this.state.username,
            password: this.state.password
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

    render() {
        let usernamePlaceholder = this.props.intl.formatMessage({id: 'login.form.username.placeholder'});
        let passwordPlaceholder = this.props.intl.formatMessage({id: 'login.form.password.placeholder'});
        let snackbar = this.getSnackBar();
        return <div>
            {snackbar}
            <form onSubmit={this.handleSubmit}>
                <Grid item xs={12}>
                    <Grid container
                          justify="center"
                          direction='column'
                          spacing={16}>
                        <Grid container item spacing={0} justify="center">
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <TextField fullWidth required
                                           id="username"
                                           label={usernamePlaceholder}
                                           value={this.state.username}
                                           onChange={e => this.setState({username: e.target.value})}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={0} justify="center">
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <TextField fullWidth required
                                           id="password-input"
                                           label={passwordPlaceholder}
                                           type="password"
                                           autoComplete="current-password"
                                           value={this.state.password}
                                           onChange={e => this.setState({password: e.target.value})}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={0} justify="center">
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Button type="submit" variant="raised" color="primary" fullWidth>
                                    <FormattedMessage id="login.form.submit"/>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </div>
    }

    getSnackBar() {
        return <Snackbar
            anchorOrigin={{
                vertical: 'top',
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