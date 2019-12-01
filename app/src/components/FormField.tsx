import { useState } from 'react'
import * as React from 'react'
import { Input, Form } from 'antd'
import { getIn } from 'formik'

interface IFormFieldProps {
    label?: React.ReactNode
    [k: string]: any
}

const FormField: React.FunctionComponent<IFormFieldProps> = ({ label, form: { values, errors, touched }, field: {name, ...field}, ...props }) => {
   
    const isTouched = getIn(touched, name);
    const errorValue = getIn(errors, name);

    return (<Form.Item
        label={label || null}
        validateStatus={isTouched && errorValue && 'error'}
        help={isTouched && errorValue}
    >
        <Input
            name={name}
            {...field}
            {...props}
        />
    </Form.Item>)
}

export default FormField;