import * as React from 'react'
import { useEffect } from 'react'
import { useMutation, useLazyQuery } from 'react-apollo'
import { GET_GROUPS_BY_ID } from '../../graphql/queries'
import { CREATE_GROUP, UPDATE_GROUP } from '../../graphql/mutations'
import { UserContext } from '../../providers/UserProvider'
import { RouteComponentProps } from 'react-router-dom'
import groupReducer from './reducer'
import {onValidate} from './validations';

interface IUserData {
    email: string,
    index?: string | number
}

export interface IGroupData {
    id?: string | number,
    name: string,
    users: IUserData[]
}


interface GroupsRouteparams {
    id: string 
}

interface GroupProps extends RouteComponentProps<GroupsRouteparams> {
    children(props: any): React.ReactNode
} 


const GroupsContainer: React.FunctionComponent<GroupProps> = ({ history, match: { params }, children }) => {

    const [state, dispatch] = React.useReducer(groupReducer, {
        loading: false,
        group: {
            id: null,
            name: null,
            users: []
        },
        error: null
    });

    const [createGroup, { data, loading, error }] = useMutation(CREATE_GROUP)
    const [updateGroup, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(UPDATE_GROUP)

    const [getGroupsBy, {
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


    return <>{children({createGroup, data, loading, error, updateGroup, updateData, })}</>
}

export default GroupsContainer