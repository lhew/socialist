import * as React from 'react'
import { useEffect } from 'react'
import { useMutation, useLazyQuery } from 'react-apollo'
import { GET_GROUPS_BY_ID } from '../../graphql/queries'
import { CREATE_GROUP, UPDATE_GROUP } from '../../graphql/mutations'
import { UserContext } from '../../providers/UserProvider'
import GroupsFormBody from '../../components/GroupsFormBody'
import { Spin, Alert } from 'antd'
import { RouteComponentProps } from 'react-router-dom'
import {onValidate} from './validations';
import GroupsContainer from './container'
interface IUserData {
    email: string,
    index?: string | number
}

export interface IGroupData {
    id?: string | number,
    name: string,
    users: IUserData[]
}

interface IGroupProps extends RouteComponentProps<{id: string}> {
    params: {
        id: string
    }
}

const GroupsForm: React.FunctionComponent<IGroupProps> = (props) => {



    return <GroupsContainer {...props}>
        {({groupLoading, })}
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

                if (groupFound()) {
                    payload.variables.id = values.id
                    updateGroup(payload)
                } else {
                    createGroup(payload)
                }

            }
            }
        />}
        </GroupsContainer>
}

export default GroupsForm
