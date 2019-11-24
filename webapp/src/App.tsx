import 'antd/dist/antd.css'
import * as React from 'react'
import Home from './pages/Home'
import PrivateRoute from './components/PrivateRoute'
import { Switch, Route, Router } from 'react-router-dom'
import Order from './pages/Order'
import history from './utils/history'
// import { useAuth0 } from './providers/react-auth0-spa'
// import { Spin } from 'antd'
import Callback from './pages/Callback'
// import jwt_decode from 'jwt-decode'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import auth from './auth'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization: auth.getIdToken(),
      },
    }))
  },
})

export default () => {
  // const [authData, setAuth] = React.useState(false)

  // try {
  //   const token: string | null = localStorage.getItem('token')

  //   if (token) {
  //     const tokenValue = jwt_decode(JSON.parse(token))
  //     console.log(tokenValue)
  //     setAuth(tokenValue)
  //     // console.log(authData)
  //   }
  // } catch (e) {
  //   console.log('deu errado ', e)
  //   await loginWithRedirect({
  //     appState: { targetUrl: path },
  //   })
  // } // const isAuthenticated = window.localStorage.getItem('token')
  // const { loading } = useAuth0()

  // if (loading) {
  //   return (
  //     <div>
  //       <Spin />
  //       <span>Wait a moment...</span>
  //     </div>
  //   )
  // }

  React.useEffect(() => {
    const asyncFn = async () => {
      if (window.location.pathname === '/callback') {
        return
      }
      try {
        const result = await auth.silentAuth()
        console.log('login result: ', result)
        if (!result) {
          // auth.signIn()
        }
        // window.location.reload()
        // console.log(' autenticou? ', auth.isAuthenticated())
        // if (!auth.getIdToken()) {
        //   auth.signIn()
        // }
      } catch (err) {
        if (err.error === 'login_required') {
          auth.signIn()
          console.log('loga ae kct')
        }
        console.log(err.error)
      }
    }
    asyncFn()
  }, [])

  return (
    <ApolloProvider client={client}>
      <Router history={history}>
        <Switch>
          <Route
            component={({ location }) => {
              return (
                <>
                  {/* {auth} */}
                  <Route path="/callback" component={Callback} />
                  {!auth.isAuthenticated() && <Route path="/" exact component={Home} />}
                  {/* {authData && <pre>{authData}</pre>} */}
                  {auth.isAuthenticated() && (
                    <>
                      <PrivateRoute path="/" exact component={Order} />
                    </>
                  )}
                </>
              )
            }}
          />
        </Switch>
      </Router>
    </ApolloProvider>
  )
}
