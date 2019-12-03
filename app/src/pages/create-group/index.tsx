import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'
import { Icon, Button, Divider } from 'antd'
import { Formik, Field, Form } from 'formik'
import FormField from '../../components/FormField'
import { patterns } from '../../shared/utils/validation'
import { useMutation } from 'react-apollo'
import { CREATE_GROUP } from '../../graphql/mutations'
import { UserContext } from '../../providers/UserProvider'

interface IUserData {
    email: string,
    index: string | number
}

interface IGroupData {
    group: string,
    users: IUserData[]
}

const CreateGroup: React.FunctionComponent<any> = () => {

    const context = React.useContext(UserContext);
    const emailRegexp = new RegExp(patterns.email, 'i')
    const initialValues: IGroupData = {
        group: "",
        users: [{ email: "", index: Date.now() }]
    };

    const newUser = (values) => ({
        ...values,
        users: [...values.users, { email: "", index: Date.now() }]
    });

    const removeUser = (values, index) => (
        {
            ...values.users,
            users: [values.users.filter(user => user.index !== index)]
        })

    const handleEnterPress = (event, setValues, values) => {
        if (event.keyCode === 13 && emailRegexp.test(event.target.value)) {
            event.preventDefault();
            setValues(newUser(values))
        }
    }

    const [createGroup, { data, loading, error }] = useMutation(CREATE_GROUP)

    const onValidate = (values: IGroupData) => {

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


        if (errors.group === null && errors.users.length === 0)
            return {};

        return errors
    }

    return (
        <LoggedIn subtitle="Groups / Create">
            <div className="groups-create inner-content">
                <h3>Create new group</h3>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        createGroup({
                            variables: {
                                groupData: {
                                    name: values.group,
                                    owner: context.user.id,
                                    users: values.users && values.users.map(user => user.email)
                                }
                            }
                        })
                    }}
                    validate={onValidate}
                >{(form) => <form onSubmit={form.handleSubmit}>
                    <Field label="group name" name="group" component={FormField} />

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
                    {data && <p>Group created :)</p>}
                    <pre>{JSON.stringify(form.values, null, 2)}</pre>
                </form>}
                </Formik>
            </div>
        </LoggedIn >
    )
}

export default CreateGroup