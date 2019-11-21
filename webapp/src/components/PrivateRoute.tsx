import * as React from 'react'
import { useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useAuth0 } from '../providers/react-auth0-spa'

interface IPrivateRouteProps {
  component: React.FunctionComponent<any>
  path: string | string[]
  exact: boolean
}

const PrivateRoute = ({ component: Component, path, ...rest }: IPrivateRouteProps) => {
  const { loginWithRedirect } = useAuth0()

  const isAuthenticated = localStorage.getItem('token')

  useEffect(() => {
    const fn = async () => {
      // if (!isAuthenticated) {
      //   await loginWithRedirect({
      //     appState: { targetUrl: path },
      //   })
      // }
    }
    fn()
  }, [isAuthenticated, loginWithRedirect, path])

  // const render = props => (isAuthenticated ? <Component {...props} /> : null)

  return <Route path={path} render={props => <Component {...props} />} {...rest} />
}

export default PrivateRoute
