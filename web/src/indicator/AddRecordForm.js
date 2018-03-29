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
            <Col xs={{span: 22, offset: 1}} sm={{span: 10, offset: 1}} md={{span: 6, offset: 1}} key={"dateInput"}>
                <FormItem>
                    {getFieldDecorator("dateInput", dateInputConfig)(
                        <DatePicker
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
                <Row>
                    {this.getInputFields()}
                    <Col xs={{span: 22, offset: 1}} sm={{span: 22, offset: 1}} md={{span: 6, offset: 2}}>
                        <FormItem>
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