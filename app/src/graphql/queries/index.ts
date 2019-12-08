import {gql} from 'apollo-boost'
export const GET_USER_BY_ATTRIBUTE = gql`
    query($email: String, $authId: String){
        getUsersBy(email: $email, authId: $authId) {
            name
            id
            email
            authId
            image
        }
    }`

export const GET_GROUPS_BY_ID = gql`
    query groups($id: String){
        getGroupsBy(_id: $id) {
            id
            name
            owner
            users
        }
    }`

export const GET_GROUPS_BY_OWNER = gql`
    query groups($owner: String){
        getGroupsBy(owner: $owner) {
            id
            name
            owner
            users
        }
    }`