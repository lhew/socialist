import * as React from 'react';
import auth from '../auth';

const initialValues = { image: "", name: "", email: "", id: "" }
export const UserContext = React.createContext({ user: initialValues, setUserData: userData => userData })

const UserProvider = ({ user, children }) => {

    const [state, setState] = React.useState(null)

    return <UserContext.Provider value={{
        user: state || user,
        setUserData(userData) {
            console.log('user data agora eh isso ', userData);
            setState(userData)
        }
    }}>
        {children}
    </UserContext.Provider>
}

export default UserProvider