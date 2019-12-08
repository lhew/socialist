import * as React from 'react'
import { useEffect } from 'react'
import { patterns } from '../../shared/utils/validation'
import { useMutation, useLazyQuery } from 'react-apollo'
import { GET_GROUPS_BY_ID } from '../../graphql/queries'
import { CREATE_GROUP, UPDATE_GROUP } from '../../graphql/mutations'
import { UserContext } from '../../providers/UserProvider'
import GroupsFormBody from '../../components/GroupsFormBody'
import { Spin, Alert } from 'antd'

interface IUserData {
    email: string,
    index?: string | number
}

interface IGroupData {
    id?: string | number,
    name: string,
    users: IUserData[]
}

const GroupsForm: React.FunctionComponent<any> = ({ history, match: { params } }) => {

    const [createGroup, { data, loading, error }] = useMutation(CREATE_GROUP)
    const [updateGroup, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(UPDATE_GROUP)

    const [getGroupsBy, {
        called,
        data: groupData,
        loading: groupLoading,
        error: groupError
    }] = useLazyQuery(GET_GROUPS_BY_ID);

    const context = React.useContext(UserContext);

    const groupFound = () => groupData && groupData.getGroupsBy && groupData.getGroupsBy.length > 0
    const hasIDParam = () => params && params.id && params.id.length > 1;

    const initialValues: IGroupData = groupFound() ? {
        id: groupData.getGroupsBy[0].id,
        name: groupData.getGroupsBy[0].name,
        users: groupData.getGroupsBy[0].users &&
            groupData.getGroupsBy[0].users.map((user, index) => ({ email: user, index }))
    } : {
            name: "",
            users: [{ email: "", index: Date.now() }]
        };

    useEffect(() => {
        if (hasIDParam()) {
            getGroupsBy({
                variables: {
                    id: params.id
                }
            })
        }
    }, []);

    useEffect(() => {
        if (data || updateData) {
            console.log('dataÇ ', data, 'updatedata :', updateData);

            setTimeout(() => {
                history.replace("/groups")
            }, 1500)
        }
    }, [data, updateData])

    const emailRegexp = new RegExp(patterns.email, 'i')
    const onValidate = (values: IGroupData) => {
        const errors = {
            name: null,
            users: []
        }
        if (!values.name) {
            errors.name = "This field is mandatory"
        }

        values.users.map((user, index) => {
            if (!emailRegexp.test(user.email)) {
                errors.users[index] = { email: "Type a valid email here" }
            }
        })

        if (errors.name === null && errors.users.length === 0)
            return {};

        return errors
    }


    return <>
        {groupLoading && <Spin />}
        {hasIDParam() && !groupFound() && <Alert message="There was an error fetching this group info" type="error" />}
        {groupError && <Alert message="There was an error updating your group. If the problem persists, contact us." type="error" />}
        {!hasIDParam() && error && <Alert message="There was an error creating your group. If the problem persists, contact us." type="error" />}
        {updateData && <Alert message="Group updated" type="success" />}
        {!hasIDParam() && data && <Alert message="Group registered" type="success" />}

        {(!hasIDParam() || (hasIDParam() && groupFound())) && <GroupsFormBody
            title="Create group"
            initialValues={initialValues}
            onValidate={onValidate}
            loading={loading}
            data={data}
            onSubmit={(values, actions) => {

                const payload = {
                    variables: {
                        id: null,
                        groupData: {
                            name: values.name,
                            owner: context.user.id,
                            users: values.users && values.users.map(user => user.email)
                        } as IGroupData
                    }
                }

                if(groupFound()) {
                    payload.variables.id = values.id
                    updateGroup(payload)
                }else{
                    createGroup(payload)
                }

            }
            }
        />}
    </>
}

export default GroupsForm
