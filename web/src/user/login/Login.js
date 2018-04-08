import React, {Component} from 'react';
import {login} from '../../util/APIUtils';
import {ACCESS_TOKEN} from '../../constants';
import {FormattedMessage, injectIntl} from "react-intl";
import {Button, Grid, TextField} from "material-ui";
import {notification} from 'antd';


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
                notification.error({
                        message: 'Progressio',
                        description: this.props.intl.formatMessage({id: 'login.notification.incorrect'})
                    }
                );
            } else {
                notification.error({
                    message: 'Progressio',
                    description: error.message || this.props.intl.formatMessage({id: 'notification.error'})
                });
            }
        });
    }

    render() {
        let usernamePlaceholder = this.props.intl.formatMessage({id: 'login.form.username.placeholder'});
        let passwordPlaceholder = this.props.intl.formatMessage({id: 'login.form.password.placeholder'});
        return <form onSubmit={this.handleSubmit}>
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
                                // margin="normal"
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
                                // margin="normal"
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
    }
}

export default injectIntl(Login);