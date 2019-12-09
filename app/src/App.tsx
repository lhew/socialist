import * as React from 'react'
import Home from './pages/Home'
import PrivateRoute from './components/PrivateRoute'
import { Switch, Route, Router } from 'react-router-dom'
import Callback, { ITokenPayload } from './pages/Callback'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import auth from './auth'
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
                      {/* <Route component={() => <p className="not-found">Not found <a href="#" onClick={() => auth.signIn()}>Login again</a></p>} /> */}
                    </>}
                    {auth.isAuthenticated() && (<>
                      <PrivateRoute path="/" exact  subtitle="Dashboard" component={React.lazy(() => import("./pages/dashboard")) } />
                      <PrivateRoute path="/groups" exact subtitle="Groups" component={React.lazy(() => import("./pages/groups")) } />
                      <PrivateRoute path="/groups/edit/:id" subtitle="Groups/Edit" component={React.lazy(() => import("./pages/groups-form")) } />
                      <PrivateRoute path="/groups/create" exact subtitle="Groups/Create" component={React.lazy(() => import("./pages/groups-form")) } />
                      <PrivateRoute path="/account" exact subtitle="Account" component={React.lazy(() => import("./pages/account")) } />
                      <PrivateRoute path="/lists" exact subtitle="Lists" component={React.lazy(() => import("./pages/lists-form")) } />
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
