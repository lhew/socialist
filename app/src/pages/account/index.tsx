import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'
import { Icon, Button, Divider } from 'antd'
import { Formik, Field, Form, FieldArray } from 'formik'
import FormField from '../../components/FormField'
import { patterns } from '../../shared/utils/validation'
import { UserContext } from '../../providers/UserProvider'

interface IUserData {
    email: string,
    index: string | number
}

interface IGroupData {
    group: string,
    users: IUserData[]
}

const Account: React.FunctionComponent<any> = () => {

    const context = React.useContext(UserContext)
    const initialValues = {
        name: context.user.name,
        email: context.user.email,
        active: true
    };



    const onValidate = (values) => {

        const emailRegexp = new RegExp(patterns.email, 'i')
        const errors = {
            group: null,
            users: []
        }
        if (!values.group) {
            errors.group = "This field is mandatory"
        }

        return errors
    }

    return (
        <LoggedIn subtitle="Account">
            <div className=" inner-content">
                <h3>Manage your account (soon)</h3>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(e) => { console.log(e) }}
                    validate={onValidate}
                >
                        <Form noValidate>
                            <Field label="Name" name="name" type="text" disabled component={FormField} />
                            <Field label="Email" name="email" type="email" disabled component={FormField} />
                            <Field label="Active" name="active" type="checkbox" disabled component={FormField} />

                            <Divider />

                            <Button htmlType="submit" >Submit</Button>
                            <pre>{JSON.stringify(context.user, null, 2)}</pre>
                        </Form>
                </Formik>
            </div>
        </LoggedIn >
    )
}

export default Account