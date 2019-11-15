import 'antd/dist/antd.css'
import * as React from 'react'
import Home from './pages/Home'
import PrivateRoute from './components/PrivateRoute'
import { Switch, Route, Router } from 'react-router-dom'
import Order from './pages/Order'
import history from './utils/history'
import { useAuth0 } from './providers/react-auth0-spa'
import { Spin } from 'antd'

export default () => {
  const { loading, isAuthenticated } = useAuth0()

  if (loading) {
    return (
      <div>
        <Spin />
        <span>Wait a moment...</span>
      </div>
    )
  }

  return (
    <Router history={history}>
      <Switch>
        {!isAuthenticated && <Route path="/" exact component={Home} />}
        {isAuthenticated && <PrivateRoute path="/" component={Order} />}
      </Switch>
    </Router>
  )
}
