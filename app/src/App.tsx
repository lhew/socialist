import * as React from 'react'
import Home from './pages/Home'
import PrivateRoute from './components/PrivateRoute'
import { Switch, Route, Router } from 'react-router-dom'
import Order from './pages/Order'
import history from './utils/history'
import { Spin } from 'antd'
import Callback from './pages/Callback'
// import jwt_decode from 'jwt-decode'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import auth from './auth'
import Dashboard from './pages/dashboard'
import Groups from './pages/groups'
import Account from './pages/account'
import Lists from './pages/lists'
import CreateGroup from './pages/groups/CreateGroup'


const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})


export default () => {

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
                  <Route path="/callback" component={Callback} />
                  {!auth.isAuthenticated() && <>
                  <Route path="/" exact component={Home} />
                  <Route component={() => <p>Not found <a href="#" onClick={() => auth.signIn()}>Login again</a></p>} />
                  </>}
                  {auth.isAuthenticated() && (
                    <>
                      <PrivateRoute path="/" exact component={Dashboard} />
                      <PrivateRoute path="/groups" exact component={Groups} />
                      <PrivateRoute path="/groups/create" exact component={CreateGroup} />
                      <PrivateRoute path="/account" exact component={Account} />
                      <PrivateRoute path="/lists" exact component={Lists} />
                      <Route component={() => <p>Not found</p>} />
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
