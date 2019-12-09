import { Dispatch } from 'react';
import { GroupsActionPayloads, GroupActions } from './reducer';
import { client } from '../../App';
import { GET_GROUPS_BY_ID } from 'src/graphql/queries';
import { IGroupData } from './container';
import { ApolloQueryResult } from 'apollo-boost';



export const getGroup = (id: string) => async (dispatch: Dispatch<GroupsActionPayloads>) => {
    dispatch({ type: GroupActions.LOADING });
    try {
        // QueryData<{ getUsersBy: IGroupData[] }, { id: string }>
        const group:ApolloQueryResult<{getUsersBy: IGroupData[]}>  = await client.query({
            query: GET_GROUPS_BY_ID,
            variables: {
                id
            }
        });

        console.log(group);

    } catch (e) {
        dispatch({
            type: GroupActions.ERROR,
            error: "There was an error procesing your request. try again in a few minutes."
        })
    }

}