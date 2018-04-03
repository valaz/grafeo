import React, {Component} from 'react';
import {checkEmailAvailability, checkUsernameAvailability, signup} from '../../util/APIUtils';
import './Signup.css';
import {Link} from 'react-router-dom';
import {
    EMAIL_MAX_LENGTH,
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH
} from '../../constants';

import {Button, Form, Input, notification} from 'antd';
import {FormattedMessage, injectIntl} from "react-intl";

const FormItem = Form.Item;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            username: {
                value: ''
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    componentDidMount() {
        document.title = this.props.intl.formatMessage({id: 'signup.header'});
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

    handleSubmit(event) {
        event.preventDefault();

        const signupRequest = {
            name: this.state.name.value,
            email: this.state.email.value,
            username: this.state.username.value,
            password: this.state.password.value
        };
        signup(signupRequest)
            .then(response => {
                notification.success({
                    message: 'Progressio',
                    description: this.props.intl.formatMessage({id: 'signup.notification.success'})
                });
                this.props.history.push("/login");
            }).catch(error => {
            notification.error({
                message: 'Progressio',
                description: error.message || this.props.intl.formatMessage({id: 'notification.error'})
            });
        });
    }

    isFormInvalid() {
        return !(this.state.name.validateStatus === 'success' &&
            this.state.username.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="signup-container">
                <h1 className="page-title">
                    <FormattedMessage id="signup.header"/>
                </h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem
                            label={this.props.intl.formatMessage({id: 'signup.form.name.label'})}
                            hasFeedback
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>
                            <Input
                                autoFocus
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder={this.props.intl.formatMessage({id: 'signup.form.name.placeholder'})}
                                value={this.state.name.value}
                                onChange={(event) => this.handleInputChange(event, this.validateName)}/>
                        </FormItem>
                        <FormItem
                            label={this.props.intl.formatMessage({id: 'signup.form.username.label'})}
                            hasFeedback
                            validateStatus={this.state.username.validateStatus}
                            help={this.state.username.errorMsg}>
                            <Input
                                size="large"
                                name="username"
                                autoComplete="off"
                                placeholder={this.props.intl.formatMessage({id: 'signup.form.username.placeholder'})}
                                value={this.state.username.value}
                                onBlur={this.validateUsernameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateUsername)}/>
                        </FormItem>
                        <FormItem
                            label={this.props.intl.formatMessage({id: 'signup.form.email.label'})}
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input
                                size="large"
                                name="email"
                                type="email"
                                autoComplete="off"
                                placeholder={this.props.intl.formatMessage({id: 'signup.form.email.placeholder'})}
                                value={this.state.email.value}
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateEmail)}/>
                        </FormItem>
                        <FormItem
                            label={this.props.intl.formatMessage({id: 'signup.form.password.label'})}
                            hasFeedback
                            validateStatus={this.state.password.validateStatus}
                            help={this.state.password.errorMsg}>
                            <Input
                                size="large"
                                name="password"
                                type="password"
                                autoComplete="off"
                                placeholder={this.props.intl.formatMessage({id: 'signup.form.password.placeholder'})}
                                value={this.state.password.value}
                                onChange={(event) => this.handleInputChange(event, this.validatePassword)}/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="signup-form-button"
                                    disabled={this.isFormInvalid()}>
                                <FormattedMessage id="signup.form.submit"/>
                            </Button>
                            <FormattedMessage id="signup.form.login.registered"/> <Link to="/login">
                            <FormattedMessage id="signup.form.login.now"/>
                        </Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateName = (name) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'signup.form.name.error.short'}, {minLength: NAME_MIN_LENGTH})
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'signup.form.name.error.long'}, {maxLength: NAME_MAX_LENGTH})
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };

    validateEmail = (email) => {
        if (!email) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'signup.form.email.error.empty'})
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if (!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'signup.form.email.error.invalid'})
            }
        }

        if (email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'signup.form.email.error.long'}, {maxLength: EMAIL_MAX_LENGTH})
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    };

    validateUsername = (username) => {
        if (username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'signup.form.username.error.short'}, {minLength: USERNAME_MIN_LENGTH})
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'signup.form.username.error.long'}, {maxLength: USERNAME_MAX_LENGTH})
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    };

    validateUsernameAvailability() {
        // First check for client side errors in username
        const usernameValue = this.state.username.value;
        const usernameValidation = this.validateUsername(usernameValue);

        if (usernameValidation.validateStatus === 'error') {
            this.setState({
                username: {
                    value: usernameValue,
                    ...usernameValidation
                }
            });
            return;
        }

        this.setState({
            username: {
                value: usernameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUsernameAvailability(usernameValue)
            .then(response => {
                if (response.available) {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'error',
                            errorMsg: this.props.intl.formatMessage({id: 'signup.form.username.error.taken'})
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be rechecked at server
            this.setState({
                username: {
                    value: usernameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if (emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if (response.available) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'error',
                            errorMsg: this.props.intl.formatMessage({id: 'signup.form.email.error.taken'})
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validatePassword = (password) => {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'signup.form.password.error.short'}, {minLength: PASSWORD_MIN_LENGTH})
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'signup.form.password.error.long'}, {maxLength: PASSWORD_MAX_LENGTH})
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

}

export default injectIntl(Signup);