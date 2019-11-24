import * as React from 'react'
import { withRouter } from 'react-router-dom'
import auth from '../auth'

const Callback = ({ history }) => {
  const [result, setResult] = React.useState(<div />)

  React.useEffect(() => {
    const asyncFn = async () => {
      try {
        await auth.handleAuthentication()
        const token = await auth.getIdToken()
        console.log('token: ', token)
        localStorage.setItem('auth-token', JSON.stringify(token))
        history.replace('/')
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
