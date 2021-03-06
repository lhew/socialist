import {gql} from 'apollo-boost'

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
        owner
        users
    }
  }
`;

export const UPDATE_GROUP = gql`
    mutation UpdateGroup($id: ID!, $groupData: GroupInput!){
      updateGroup(id: $id, groupData: $groupData){
        id
        name
        active
        owner
        users
    }
  }
`;