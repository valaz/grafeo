import React, {Component} from 'react';
import {Button, Col, DatePicker, Form, Icon, InputNumber, Row} from "antd";
import moment from 'moment';
import {FormattedMessage, injectIntl} from "react-intl";

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const datePickerFormat = "LL";

class AddRecordForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editDate: null,
            editValue: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        let date = moment(this.dateInput.picker.input.value, datePickerFormat);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.form.resetFields();
                this.props.handleSubmit(date.format(dateFormat), this.valueInput.inputNumberRef.state.value);
            }
        });
    }

    editDateValue(date, value) {
        const {resetFields} = this.props.form;
        const {setFields} = this.props.form;
        resetFields();
        setFields({
            valueInput: {
                value: value
            }

        });
    }

    disabledEndDate = (endValue) => {
        var now = moment();
        return endValue ? endValue.isAfter(now) : false;
    };

    getRecordDates() {
        let data = this.props.data.map(r => ({...r}));
        return data.map(d => d['date']);
    }

    getInputFields() {
        let selectedDates = this.getRecordDates();
        const {getFieldDecorator} = this.props.form;
        const children = [];
        const dateInputConfig = {
            rules: [{
                type: 'object',
                required: true,
                message: this.props.intl.formatMessage({id: 'indicator.view.form.date.error.empty'})
            }],
        };
        const valueInputConfig = {
            rules: [{
                type: 'number',
                required: true,
                message: this.props.intl.formatMessage({id: 'indicator.view.form.value.error.empty'})
            }],
        };
        children.push(
            <Col xs={{span: 22, offset: 1}} sm={{span: 10, offset: 1}} md={{span: 6, offset: 1}} key={"dateInput"}>
                <FormItem>
                    {getFieldDecorator("dateInput", dateInputConfig)(
                        <DatePicker
                            dateRender={(current) => {
                                const style = {};
                                if (selectedDates.includes(current.format("YYYY-MM-DD"))) {
                                    style.border = '1px solid #1890ff';
                                    style.borderRadius = '50%';
                                }
                                return (
                                    <div className="ant-calendar-date" style={style}>
                                        {current.date()}
                                    </div>
                                );
                            }}
                            format={datePickerFormat}
                            disabledDate={this.disabledEndDate}
                            style={{width: '100%'}}
                            ref={dateInput => (this.dateInput = dateInput)}/>
                    )}
                </FormItem>
            </Col>);
        children.push(
            <Col xs={{span: 22, offset: 1}} sm={{span: 10, offset: 2}} md={{span: 6, offset: 2}} key={"valueInput"}>
                <FormItem>
                    {getFieldDecorator("valueInput", valueInputConfig)(
                        <InputNumber prefix={<Icon type="info-circle-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                     ref={valueInput => (this.valueInput = valueInput)}
                                     style={{width: '100%'}}
                                     max={Math.pow(2, 31)}
                                     min={-Math.pow(2, 31)}
                                     placeholder={this.props.intl.formatMessage({id: 'indicator.view.form.value.placeholder'})}
                        />
                    )}
                </FormItem>
            </Col>
        );
        return children;
    }

    render() {

        return (
            <Form onSubmit={this.handleSubmit} style={{textAlign: 'center'}}>
                <Row>
                    {this.getInputFields()}
                    <Col xs={{span: 22, offset: 1}} sm={{span: 22, offset: 1}} md={{span: 6, offset: 2}}>
                        <FormItem>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{width: '100%'}}
                            >
                                <FormattedMessage id="indicator.view.form.submit"/>
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedAddRecordForm = Form.create({
    mapPropsToFields(props) {
        return {
            dateInput: Form.createFormField({
                value: props.editDate ? moment(props.editDate, dateFormat) : null
            }),
            valueInput: Form.createFormField({
                value: props.editValue
            })
        }
    }
})(AddRecordForm);

export default injectIntl(WrappedAddRecordForm)