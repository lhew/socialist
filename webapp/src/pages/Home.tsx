import * as React from 'react'
// import { useAuth0 } from '../providers/react-auth0-spa'
import NotLoggedIn from '../templates/NotLoggedIn'
import { Button } from 'antd'

export default () => {
  // const { user, isAuthenticated, loginWithRedirect, logout, loading } = useAuth0()

  return (
    <NotLoggedIn>
      <h1>Stop using paper!</h1>
      <Button size="large">Login now</Button>
    </NotLoggedIn>
  )
}
