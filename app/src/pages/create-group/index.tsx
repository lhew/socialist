import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'
import { Icon, Button, Divider } from 'antd'
import { Formik, Field, Form, FieldArray } from 'formik'
import FormField from '../../components/FormField'
import { patterns } from '../../shared/utils/validation'
import { CustomInput } from '../../components/CustomField'

interface IUserData {
    email: string,
    index: string | number
}

interface IGroupData {
    group: string,
    users: IUserData[]
}
// addonAfter={<Icon type="close" onClick={() => {
//     setValues(removeUser(values, user.index))
// }} />}

const CreateGroup: React.FunctionComponent<any> = () => {

    const initialValues: IGroupData = {
        group: "",
        users: [{ email: "", index: Date.now() }]
    };

    const newUser = (values) => ({ ...values, users: [...values.users, { email: "", index: Date.now() }] });
    const removeUser = (values, index) => ({ ...values.users, users: [values.users.filter(user => user.index !== index)] })

    return (
        <LoggedIn subtitle="Groups / Create">
            <div className="groups-create inner-content">
                <h3>Create new group</h3>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(e) => { console.log(e) }}
                    validate={(values: IGroupData) => {

                        const emailRegexp = new RegExp(patterns.email, 'i')
                        const errors = {
                            group: null,
                            users: []
                        }
                        if (!values.group) {
                            errors.group = "This field is mandatory"
                        }

                        values.users.map((user, index) => {
                            if (!emailRegexp.test(user.email)) {
                                errors.users[index] = { email: "Type a valid email here" }
                            }
                        })

                        return errors
                    }}
                >
                    {({ values, setValues, errors, touched }) =>
                        <Form noValidate>
                            <Field label="group name" name="group" component={FormField} />

                            <Divider />

                            <h4>Invite people to your list</h4>
                            <p>Send invites by typing a friend's email</p>
                            <br />

                            {values.users.map((user, index) => <Field
                                type="email"
                                key={user.index}
                                name={`users[${index}].email`}
                                placeholder={`User #${index + 1} email`}
                                onKeyUp={e => {
                                    if (e.keyCode === 13) {
                                        e.preventDefault();
                                        setValues(newUser(values))
                                    }
                                }}
                                component={FormField}

                            />)}
                            <Button htmlType="submit" >Submit</Button>
                        </Form>
                    }
                </Formik>
            </div>
        </LoggedIn >
    )
}

export default CreateGroup