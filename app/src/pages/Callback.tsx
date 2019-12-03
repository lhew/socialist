import * as React from 'react'
import { withRouter } from 'react-router-dom'
import auth from '../auth'
import { GET_USER_BY_ATTRIBUTE } from '../graphql/queries'
import { useLazyQuery } from 'react-apollo'
import { CREATE_USER } from '../graphql/mutations'
import { IUserData, IUSerDataVars } from 'types/User'
import jwt_decode from 'jwt-decode'
import { client } from '../App'
import { UserContext } from '../providers/UserProvider'


export interface ITokenPayload {
  at_hash: string
  aud: string
  email: string
  email_verified: boolean
  given_name: string,
  family_name: string,
  picture: string,
  exp: string
  iat: string
  iss: string
  nonce: string
  sub: string
}

interface ITokenResult {
  idToken: string,
  idTokenPayload: ITokenPayload
}

const Callback = ({ history }) => {
  const [result, setResult] = React.useState(<div />)
  const context = React.useContext(UserContext)

  React.useEffect(() => {
    console.log('bora')
    const asyncFn = async () => {
      try {
        const token:ITokenResult = await auth.handleAuthentication()
        if (token) {
          // const tokenResult = jwt_decode(token)
          console.log('tokenResult: ', token)
          localStorage.setItem('auth-token', JSON.stringify(token.idToken));

          setResult(<p>Checking user {token.idTokenPayload.email}...</p>)
          
          const queryUser = await client.query({
            query: GET_USER_BY_ATTRIBUTE,
            variables: { 
              email: token.idTokenPayload.email 
            } 
          });

          if (queryUser.data && queryUser.data.getUsersBy && queryUser.data.getUsersBy.length === 0) {
              setResult(<p>Creating user for {token.idTokenPayload.email}</p>)
              const createUserMutation = await client.mutate({
                mutation: CREATE_USER,
                variables: {
                  userData: {
                    email: token.idTokenPayload.email,
                    name: `${token.idTokenPayload.given_name}  ${token.idTokenPayload.family_name}`,
                    authId: token.idTokenPayload.sub,
                    image: token.idTokenPayload.picture,
                    active: true,
                  }
                }
              })

            if(createUserMutation.data && createUserMutation.data && createUserMutation.data.createUser){
                context.setUserData(createUserMutation.data.createUser) 
            }
          
            console.log('tudo certo, vambora');
            
          }else {
            context.setUserData(queryUser.data.getUsersBy[0]) 
            setResult(<p>Redirecting to dashboard</p>)
          }
          
        
          history.replace('/')
        }else {
          throw Error('deu ruim')
        }
      } catch (e) {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('isLoggedIn')
        setResult(
          <p>
            There was an error trying to Authenticate you.{' '}
            <a
              href="#"
              onClick={() => {
                auth.signIn()
              }}
            >
              Click here{' '}
            </a>
            to try again{' '}
          </p>
        )
        console.log('q merda foi essa ', e)
      }
    }

    asyncFn()
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
      }}
    >
      {/* <img src={loading} alt="loading"/> */}
      {!result && <p>Loading...</p>}
      {result && <div>{result}</div>}
    </div>
  )
}

export default withRouter(Callback)
