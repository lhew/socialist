import * as React from 'react'
import NotLoggedIn from '../templates/NotLoggedIn'
import { Button } from 'antd'
import auth from 'src/auth'
// import { useAuth0 } from '../providers/react-auth0-spa'

export default () => {
  // const { loginWithRedirect } = useAuth0()

  return (
    <NotLoggedIn>
      <h1>Stop using paper!</h1>
      <Button
        size="large"
        onClick={e => {
          // console.log('oi', loginWithRedirect({}))
          auth.signIn()
        }}
      >
        Login now
      </Button>
    </NotLoggedIn>
  )
}
