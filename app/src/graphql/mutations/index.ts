import gql from 'graphql-tag'

export const CREATE_USER = gql`
    mutation CreateUser($userData: UserInput!){
    createUser(userData: $userData){
        name
        email
        image
        active
    }
  }
`;

export const CREATE_GROUP = gql`
    mutation CreateGroup($groupData: GroupInput!){
    createGroup(groupData: $groupData){
        id
        name
        active
    }
  }
`;