import React, {Component} from 'react';
import {Button, DatePicker, Form, Icon, InputNumber} from "antd";

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
        this.props.form.resetFields();
        this.props.handleSubmit(this.dateInput.picker.input.value, this.valueInput.inputNumberRef.state.value);
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
        children.push(
            <FormItem key={"dateInput"}>
                {getFieldDecorator("dateInput")(
                    <DatePicker
                        ref={dateInput => (this.dateInput = dateInput)}/>
                )}
            </FormItem>);
        children.push(
            <FormItem key={"valueInput"}>
                {getFieldDecorator("valueInput")(
                    <InputNumber prefix={<Icon type="info-circle-o" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                 ref={valueInput => (this.valueInput = valueInput)}
                                 placeholder="Value"/>
                )}
            </FormItem>
        );
        return children;
    }

    render() {

        return (
            <Form layout="inline" onSubmit={this.handleSubmit} style={{textAlign: 'center'}}>
                {this.getInputFields()}
                <FormItem span={8}>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        Submit
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

const WrappedAddRecordForm = Form.create()(AddRecordForm);

export default WrappedAddRecordForm