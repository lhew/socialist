import * as React from 'react'
import { useEffect } from 'react'
import { Route, withRouter } from 'react-router-dom'
import auth from '../auth'

interface IPrivateRouteProps {
  component: React.FunctionComponent<any>
  path: string | string[]
  exact: boolean
}

const PrivateRoute = ({ component: Component, path, ...rest }: IPrivateRouteProps) => {

  const isAuthenticated = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const fn = async () => {
      const result = await auth.isAuthenticated()
      // console.log('private routeresult: ', result)
      // console.log(rest)
      if(!result) {
        
      }
      // if (!isAuthenticated) {
      //   await loginWithRedirect({
      //     appState: { targetUrl: path },
      //   })
      // }
    }
    fn()
  }, [isAuthenticated, path])

  // const render = props => (isAuthenticated ? <Component {...props} /> : null)

  return <Route path={path} render={props => <Component {...props} />} {...rest} />
}

export default PrivateRoute
