import * as React from 'react'
import NotLoggedIn from '../templates/NotLoggedIn'
import { Button } from 'antd'
import { useAuth0 } from '../providers/react-auth0-spa'

export default () => {
  const { loginWithRedirect, isAuthenticated, getTokenSilently, user } = useAuth0()

  React.useEffect(() => {
    const asyncFN = async () => {
      const a = await getTokenSilently()
      console.log(a)
    }

    asyncFN()
  }, [])
  return (
    <NotLoggedIn>
      <h1>Stop using paper! {console.log(isAuthenticated, user)}</h1>
      <Button
        size="large"
        onClick={e => {
          console.log('oi', loginWithRedirect({}))
        }}
      >
        Login now
      </Button>
    </NotLoggedIn>
  )
}
