import * as React from 'react'
import { withRouter } from 'react-router-dom'
import auth from '../auth'

const Callback = ({ history }) => {
  React.useEffect(() => {
    const asyncFn = async () => {
      try {
        await auth.handleAuthentication()
        const token = await auth.getIdToken()
        localStorage.setItem('auth-token', JSON.stringify(token))
        history.replace('/')
      } catch (e) {
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
      <p>Loading...</p>
    </div>
  )
}

export default withRouter(Callback)
