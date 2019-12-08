import * as React from 'react'
import { Icon, Button, Divider } from 'antd'
import { Formik, Field, Form } from 'formik'
import FormField from './FormField'
import { patterns } from '../shared/utils/validation'

const GroupsFormBody = ({ title, initialValues, onSubmit, onValidate, loading, data }) => {

    const emailRegexp = new RegExp(patterns.email, 'i')
    const handleEnterPress = (event, setValues, values) => {
        if (event.keyCode === 13 && emailRegexp.test(event.target.value)) {
            event.preventDefault();
            setValues(newUser(values))
        }
    }
    const newUser = (values) => ({
        ...values,
        users: [...values.users, { email: "", index: Date.now() }]
    });

    const removeUser = (values, index) => (
        {
            ...values.users,
            users: [values.users.filter(user => user.index !== index)]
        })

    return (<div className="groups-create inner-content">
        <h3>{title}</h3>
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={onValidate}
        >{(form) => <form onSubmit={form.handleSubmit}>
            <Field label="group name" name="name" component={FormField} />

            <Divider />

            <h4>Invite people to your list</h4>
            <p>Send invites by typing a friend's email</p>
            <br />

            {form.values.users.map((user, index) => <Field
                type="email"
                key={user.index}
                name={`users[${index}].email`}
                placeholder={`User #${index + 1} email`}
                onKeyDown={event => handleEnterPress(event, form.setValues, form.values)}
                component={FormField}
            />)}
            <Button loading={loading} disabled={!form.isValid || loading} htmlType="submit">Submit</Button>
            <pre>{JSON.stringify(form.values, null, 2)}</pre>
        </form>}
        </Formik></div>)
}

export default GroupsFormBody;