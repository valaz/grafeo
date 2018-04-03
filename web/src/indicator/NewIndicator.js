import React, {Component} from 'react';
import {createIndicator} from '../util/APIUtils';
import {INDICATOR_NAME_MAX_LENGTH} from '../constants';
import './NewIndicator.css';
import {Button, Form, Icon, Input, notification} from 'antd';
import {FormattedMessage, injectIntl} from 'react-intl';

const FormItem = Form.Item;

class NewIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                text: ''
            },
            choices: [{
                text: ''
            }, {
                text: ''
            }],
            indicatorLength: {
                days: 1,
                hours: 0
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    componentDidMount() {
        document.title = this.props.intl.formatMessage({id: 'indicator.create.header'});
    }

    handleSubmit(event) {
        event.preventDefault();
        const indicatorData = {
            name: this.state.question.text,
            indicatorLength: this.state.indicatorLength
        };

        createIndicator(indicatorData)
            .then(response => {
                this.props.history.push("/indicator/" + response.id);
            }).catch(error => {
            if (error.status === 401) {
                this.props.handleLogout('/login', 'error', this.props.intl.formatMessage({id: 'indicator.create.notification.logout'}));
            } else {
                notification.error({
                    message: 'Progressio',
                    description: error.message || this.props.intl.formatMessage({id: 'notification.error'})
                });
            }
        });
    }

    validateQuestion = (questionText) => {
        if (questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({id: 'indicator.create.error.empty'})
            }
        } else if (questionText.length > INDICATOR_NAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({
                        id: 'indicator.create.error.long'
                    },
                    {
                        maxLength: INDICATOR_NAME_MAX_LENGTH
                    }
                )
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    };

    handleQuestionChange(event) {
        const value = event.target.value;
        this.setState({
            question: {
                text: value,
                ...this.validateQuestion(value)
            }
        });
    }

    isFormInvalid() {
        if (this.state.question.validateStatus !== 'success') {
            return true;
        }
    }

    render() {
        return (
            <div className="new-indicator-container">
                <h1 className="page-title">
                    <FormattedMessage id="indicator.create.header"/>
                </h1>
                <Form onSubmit={this.handleSubmit} className="create-indicator-form">
                    <FormItem validateStatus={this.state.question.validateStatus}
                              help={this.state.question.errorMsg} className="indicator-form-row">
                        <Input
                            autoFocus
                            placeholder={this.props.intl.formatMessage({id: 'indicator.create.placeholder'})}
                            style={{fontSize: '16px'}}
                            autosize={{minRows: 3, maxRows: 6}}
                            name="question"
                            value={this.state.question.text}
                            onChange={this.handleQuestionChange}/>
                    </FormItem>
                    <FormItem className="indicator-form-row">
                        <Button type="primary"
                                htmlType="submit"
                                size="large"
                                disabled={this.isFormInvalid()}
                                className="create-indicator-form-button">
                            <Icon type="plus"/>
                            <FormattedMessage id="indicator.create.button"/>
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default injectIntl(NewIndicator);