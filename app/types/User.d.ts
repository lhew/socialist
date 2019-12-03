export interface IUser {
    name?: string
    id?: string
    email?: string
    image?: string
}

export interface IUserData {
    data: IUser[]
}

export interface IUSerDataVars {
    email: string,
    name: string
}