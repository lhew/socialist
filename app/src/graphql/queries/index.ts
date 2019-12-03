import gql from 'graphql-tag'
export const GET_USER_BY_ATTRIBUTE = gql`
    query($email: String, $authId: String){
        getUsersBy(email: $email, authId: $authId) {
            name
            id
            email
            image
        }
    }`