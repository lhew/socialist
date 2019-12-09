import { IGroupData } from "./container";

export enum GroupActions {
    LOADING,
    FETCHED,
    SAVE,
    SUCCESS,
    ERROR,
}
export type GroupsActionPayloads =
    { type: GroupActions.LOADING } |
    { type: GroupActions.FETCHED, group: IGroupData } |
    { type: GroupActions.SUCCESS, group: IGroupData } |
    { type: GroupActions.ERROR, error: string, }

export interface GroupState {
    loading: boolean,
    group: IGroupData,
    success?: string | null,
    error?: string | null
}

export default (state: GroupState, action: GroupsActionPayloads): GroupState => {

    switch (action.type) {
        case GroupActions.LOADING:
            return {
                ...state,
                loading: true
            }
        case GroupActions.FETCHED:
            return {
                ...state,
                loading: false,
                error: null,
                group: action.group
            }
        case GroupActions.SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                group: action.group
            }
        case GroupActions.ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
                success: null
            }

    }
}