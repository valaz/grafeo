import React, {Component} from 'react';
import {login} from '../../util/APIUtils';
import './Login.css';
import {Link} from 'react-router-dom';
import {ACCESS_TOKEN} from '../../constants';

import {Button, Form, Icon, Input, notification} from 'antd';
import {FormattedMessage, injectIntl} from "react-intl";

const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(injectIntl(LoginForm));
        return (
            <div className="login-container">
                <h1 className="page-title">
                    <FormattedMessage id="login.header"/>
                </h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.props.onLogin}/>
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.title = this.props.intl.formatMessage({id: 'login.header'});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                    .then(response => {
                        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                        this.props.onLogin();
                    }).catch(error => {
                    if (error.status === 401) {
                        notification.error({
                            message: 'Progressio',
                            description: this.props.intl.formatMessage({id: 'login.notification.incorrect'})
                        });
                    } else {
                        notification.error({
                            message: 'Progressio',
                            description: error.message || this.props.intl.formatMessage({id: 'notification.error'})
                        });
                    }
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        let usernameRules = {
            rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: 'login.form.username.error.empty'})
            }],
        };
        let passwordRules = {
            rules: [{
                required: true,
                message: this.props.intl.formatMessage({id: 'login.form.password.error.empty'})
            }],
        };
        let usernamePlaceholder = this.props.intl.formatMessage({id: 'login.form.username.placeholder'});
        let passwordPlaceholder = this.props.intl.formatMessage({id: 'login.form.password.placeholder'});
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('usernameOrEmail', usernameRules)(
                        <Input
                            autoFocus
                            prefix={<Icon type="user"/>}
                            size="large"
                            name="usernameOrEmail"
                            placeholder={usernamePlaceholder}/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', passwordRules)(
                        <Input
                            prefix={<Icon type="lock"/>}
                            size="large"
                            name="password"
                            type="password"
                            placeholder={passwordPlaceholder}/>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">
                        <FormattedMessage id="login.form.submit"/>
                    </Button>
                    <FormattedMessage id="login.form.register.or"/> <Link to="/signup">
                    <FormattedMessage id="login.form.register.now"/>
                </Link>
                </FormItem>
            </Form>
        );
    }
}


export default injectIntl(Login);