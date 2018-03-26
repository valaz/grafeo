import React, {Component} from 'react';
import {Button, Col, DatePicker, Form, Icon, InputNumber, Row} from "antd";
import moment from 'moment';

const FormItem = Form.Item;

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
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.form.resetFields();
                this.props.handleSubmit(this.dateInput.picker.input.value, this.valueInput.inputNumberRef.state.value);
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

    getInputFields() {
        const {getFieldDecorator} = this.props.form;
        const children = [];
        const dateInputConfig = {
            rules: [{type: 'object', required: true, message: 'Please select date!'}],
        };
        const valueInputConfig = {
            rules: [{type: 'number', required: true, message: 'Please input value!'}],
        };
        children.push(
            <Col xs={24} sm={12} md={8} lg={6}>
                <FormItem key={"dateInput"}>
                    {getFieldDecorator("dateInput", dateInputConfig)(
                        <DatePicker
                            style={{width: '100%'}}
                            ref={dateInput => (this.dateInput = dateInput)}/>
                    )}
                </FormItem>
            </Col>);
        children.push(
            <Col xs={24} sm={12} md={8} lg={6}>
                <FormItem key={"valueInput"}>
                    {getFieldDecorator("valueInput", valueInputConfig)(
                        <InputNumber prefix={<Icon type="info-circle-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                     ref={valueInput => (this.valueInput = valueInput)}
                                     style={{width: '100%'}}
                                     placeholder="Value"/>
                    )}
                </FormItem>
            </Col>
        );
        return children;
    }

    render() {

        return (
            <Form onSubmit={this.handleSubmit} style={{textAlign: 'center'}}>
                <Row gutter={24}>
                    {this.getInputFields()}
                    <Col xs={24} sm={24} md={8} lg={6}>
                        <FormItem {...formItemLayout}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{width: '100%'}}
                            >
                                Submit
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
        const dateFormat = 'YYYY-MM-DD';
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

export default WrappedAddRecordForm