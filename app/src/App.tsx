import * as React from 'react'
import Home from './pages/Home'
import PrivateRoute from './components/PrivateRoute'
import { Switch, Route, Router } from 'react-router-dom'
import Order from './pages/Order'
import { Spin } from 'antd'
import Callback, { ITokenPayload } from './pages/Callback'
// import jwt_decode from 'jwt-decode'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import auth from './auth'
import Dashboard from './pages/dashboard'
import Groups from './pages/groups'
import Account from './pages/account'
import Lists from './pages/lists'
import CreateGroup from './pages/create-group'
import UserProvider from './providers/UserProvider'
import { GET_USER_BY_ATTRIBUTE } from './graphql/queries'
import { createBrowserHistory } from 'history'


export const history = createBrowserHistory();


export const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_CLIENT,
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization: auth.getIdToken(),
      },
    }));
  },
})

export default () => {

  const [authResult, setAuthResult] = React.useState({});

  React.useEffect(() => {
    const asyncFn = async () => {
      if (window.location.pathname === '/callback') {
        return
      }
      try {
        const result = await auth.silentAuth() as ITokenPayload;
        const queryUser = await client.query({
          query: GET_USER_BY_ATTRIBUTE,
          variables: {
            email: result.email
          }
        });

        setAuthResult(queryUser.data.getUsersBy[0])
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
      <UserProvider user={authResult}>
        <Router history={history}>
          <Switch>
            <Route
              component={({ location }) => {
                return (
                  <div className="canvas">
                    <Route path="/callback" component={Callback} />
                    {!auth.isAuthenticated() && <>
                      <Route path="/" exact component={Home} />
                      <Route component={() => <p className="not-found">Not found <a href="#" onClick={() => auth.signIn()}>Login again</a></p>} />
                    </>}
                    {auth.isAuthenticated() && (<>
                      <PrivateRoute path="/" exact component={Dashboard} />
                      <PrivateRoute path="/groups" exact component={Groups} />
                      <PrivateRoute path="/groups/create" exact component={CreateGroup} />
                      <PrivateRoute path="/account" exact component={Account} />
                      <PrivateRoute path="/lists" exact component={Lists} />
                      {/* <Route component={() => <p className="not-found">Not found</p>} /> */}
                    </>
                    )}
                  </div>
                )
              }}
            />
          </Switch>
        </Router>
      </UserProvider>
    </ApolloProvider>
  )
}
