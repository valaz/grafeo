import React, {Component} from 'react';
import {createIndicator} from '../util/APIUtils';
import {INDICATOR_NAME_MAX_LENGTH} from '../constants';
import './NewIndicator.css';
import {Button, Form, Icon, Input, notification} from 'antd';

const FormItem = Form.Item;
const {TextArea} = Input;

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
        this.addChoice = this.addChoice.bind(this);
        this.removeChoice = this.removeChoice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleIndicatorDaysChange = this.handleIndicatorDaysChange.bind(this);
        this.handleIndicatorHoursChange = this.handleIndicatorHoursChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    addChoice(event) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: choices.concat([{
                text: ''
            }])
        });
    }

    removeChoice(choiceNumber) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: [...choices.slice(0, choiceNumber), ...choices.slice(choiceNumber + 1)]
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const indicatorData = {
            name: this.state.question.text,
            indicatorLength: this.state.indicatorLength
        };

        createIndicator(indicatorData)
            .then(response => {
                this.props.history.push("/");
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
            question: {
                text: value,
                ...this.validateQuestion(value)
            }
        });
    }


    handleIndicatorDaysChange(value) {
        const indicatorLength = Object.assign(this.state.indicatorLength, {days: value});
        this.setState({
            indicatorLength: indicatorLength
        });
    }

    handleIndicatorHoursChange(value) {
        const indicatorLength = Object.assign(this.state.indicatorLength, {hours: value});
        this.setState({
            indicatorLength: indicatorLength
        });
    }

    isFormInvalid() {
        if (this.state.question.validateStatus !== 'success') {
            return true;
        }
    }

    render() {
        return (
            <div className="new-poll-container">
                <h1 className="page-title">Create Poll</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">
                        <FormItem validateStatus={this.state.question.validateStatus}
                                  help={this.state.question.errorMsg} className="poll-form-row">
                        <TextArea
                            placeholder="Enter your indicator name"
                            style={{fontSize: '16px'}}
                            autosize={{minRows: 3, maxRows: 6}}
                            name="question"
                            value={this.state.question.text}
                            onChange={this.handleQuestionChange}/>
                        </FormItem>
                        <FormItem className="poll-form-row">
                            <Button type="primary"
                                    htmlType="submit"
                                    size="large"
                                    disabled={this.isFormInvalid()}
                                    className="create-poll-form-button">
                                <Icon type="plus"/>
                                Create Poll</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}


export default NewIndicator;