import * as React from 'react'
import { patterns } from '../../shared/utils/validation'
import { useMutation } from 'react-apollo'
import { CREATE_GROUP } from '../../graphql/mutations'
import { UserContext } from '../../providers/UserProvider'
import GroupsForm from '../../components/GroupsForm'

interface IUserData {
    email: string,
    index: string | number
}

interface IGroupData {
    group: string,
    users: IUserData[]
}

const CreateGroup: React.FunctionComponent<any> = () => {
    const emailRegexp = new RegExp(patterns.email, 'i')
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

    const [createGroup, { data, loading, error }] = useMutation(CREATE_GROUP)
    const context = React.useContext(UserContext);
    const initialValues: IGroupData = {
        group: "",
        users: [{ email: "", index: Date.now() }]
    };
    return <GroupsForm
    title="Create group"
    initialValues={initialValues}
    onValidate={onValidate}
    loading={loading}
    data={data}
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
    />
}

export default CreateGroup

// return (
//         <div className="groups-create inner-content">
//             <h3>Create new group</h3>
//             <Formik
//                 initialValues={initialValues}
//                 onSubmit={(values, actions) => {
//                     createGroup({
//                         variables: {
//                             groupData: {
//                                 name: values.group,
//                                 owner: context.user.id,
//                                 users: values.users && values.users.map(user => user.email)
//                             }
//                         }
//                     })
//                 }}
//                 validate={onValidate}
//             >{(form) => <form onSubmit={form.handleSubmit}>
//                 <Field label="group name" name="group" component={FormField} />

//                 <Divider />

//                 <h4>Invite people to your list</h4>
//                 <p>Send invites by typing a friend's email</p>
//                 <br />

//                 {form.values.users.map((user, index) => <Field
//                     type="email"
//                     key={user.index}
//                     name={`users[${index}].email`}
//                     placeholder={`User #${index + 1} email`}
//                     onKeyDown={event => handleEnterPress(event, form.setValues, form.values)}
//                     component={FormField}
//                 />)}
//                 <Button loading={loading} disabled={!form.isValid || loading} htmlType="submit">Submit</Button>
//                 {data && <p>Group created :)</p>}
//                 <pre>{JSON.stringify(form.values, null, 2)}</pre>
//             </form>}
//             </Formik>
//         </div>
// )