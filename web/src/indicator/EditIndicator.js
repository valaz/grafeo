import React, {Component} from 'react';
import {editIndicator, getIndicator} from '../util/APIUtils';
import {INDICATOR_NAME_MAX_LENGTH} from '../constants';
import './NewIndicator.css';
import {Button, Form, Icon, Input, notification} from 'antd';
import {withRouter} from "react-router-dom";

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
        document.title = "Edit indicator";
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
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create indicator.');
            } else {
                notification.error({
                    message: 'Progressio App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
    }

    validateQuestion = (questionText) => {
        if (questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (questionText.length > INDICATOR_NAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${INDICATOR_NAME_MAX_LENGTH} characters allowed)`
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
                <h1 className="page-title">Edit Indicator</h1>
                <Form onSubmit={this.handleSubmit} className="create-indicator-form">
                    <FormItem validateStatus={this.state.indicator.validateStatus}
                              help={this.state.indicator.errorMsg} className="indicator-form-row">
                        <Input
                            autoFocus
                            placeholder="Enter your indicator name"
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
                            Edit Indicator</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}


export default withRouter(EditIndicator);