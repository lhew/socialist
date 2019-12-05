import * as React from 'react'
import { useEffect } from 'react'
import { Route, withRouter } from 'react-router-dom'
import auth from '../auth'
import { Icon } from 'antd'
import LoggedIn from '../templates/LoggedIn'

interface IPrivateRouteProps {
  component: React.FunctionComponent<any>
  path: string | string[]
  subtitle?: string
  exact?: boolean
}

const PrivateRoute = ({ component: Component, path, ...rest }: IPrivateRouteProps) => {

  const isAuthenticated = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const fn = async () => {
      const result = await auth.isAuthenticated()
      // console.log('private routeresult: ', result)
      // console.log(rest)
      if (!result) {

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
  const Loading = () => <>
    <Icon type="loading" />
    Loading...
  </>;

  return (
    <Route
      path={path}
      {...rest}
      render={props => (<LoggedIn subtitle={rest.subtitle || ""}>
        <React.Suspense fallback={<Loading />}>
          <Component {...props} />
        </React.Suspense >
      </LoggedIn>)}
    />
  )
}

export default PrivateRoute
