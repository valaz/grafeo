import React, {Component} from 'react';
import {editIndicator, getIndicator} from '../util/APIUtils';
import {INDICATOR_NAME_MAX_LENGTH} from '../constants';
import './NewIndicator.css';
import {Button, Form, Icon, Input, notification} from 'antd';
import {withRouter} from "react-router-dom";
import {FormattedMessage, injectIntl} from 'react-intl';

const FormItem = Form.Item;

class EditIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indicator: {
                name: ''
            }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    loadIndicator(id) {
        let promise;
        if (this.props.isAuthenticated) {
            promise = getIndicator(id);
        }

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });
        promise
            .then(response => {
                console.log(response);
                this.setState({
                    indicator: response,
                    isLoading: false
                })
            }).catch(error => {
            if (error.status === 404 || error.status === 403) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
            console.log(error);
        });
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.loadIndicator(id);
        document.title = this.props.intl.formatMessage({id: 'indicator.edit.header'});
    }

    handleSubmit(event) {
        event.preventDefault();
        const indicatorData = {
            id: this.state.indicator.id,
            name: this.state.indicator.name,
            indicatorLength: this.state.indicatorLength
        };
        console.log(indicatorData);
        editIndicator(indicatorData)
            .then(response => {
                console.log(response);
                this.props.history.push("/indicator/" + response.id);
            }).catch(error => {
            if (error.status === 401) {
                this.props.handleLogout('/login', 'error', this.props.intl.formatMessage({id: 'indicator.edit.notification.logout'}));
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
                errorMsg: this.props.intl.formatMessage({id: 'indicator.edit.error.empty'})
            }
        } else if (questionText.length > INDICATOR_NAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: this.props.intl.formatMessage({
                        id: 'indicator.edit.error.long'
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
            indicator: {
                id: this.state.indicator.id,
                name: value,
                ...this.validateQuestion(value)
            }
        });
    }

    isFormInvalid() {
        if (this.state.indicator.validateStatus !== 'success') {
            return true;
        }
    }

    render() {
        return (
            <div className="new-indicator-container">
                <h1 className="page-title">
                    <FormattedMessage id="indicator.edit.header"/>
                </h1>
                <Form onSubmit={this.handleSubmit} className="create-indicator-form">
                    <FormItem validateStatus={this.state.indicator.validateStatus}
                              help={this.state.indicator.errorMsg} className="indicator-form-row">
                        <Input
                            autoFocus
                            placeholder={this.props.intl.formatMessage({id: 'indicator.edit.placeholder'})}
                            style={{fontSize: '16px'}}
                            autosize={{minRows: 3, maxRows: 6}}
                            name="question"
                            value={this.state.indicator.name}
                            onChange={this.handleQuestionChange}/>
                    </FormItem>
                    <FormItem className="indicator-form-row">
                        <Button type="primary"
                                htmlType="submit"
                                size="large"
                                disabled={this.isFormInvalid()}
                                className="create-indicator-form-button">
                            <Icon type="edit"/>
                            <FormattedMessage id="indicator.edit.button"/>
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default injectIntl(withRouter(EditIndicator));