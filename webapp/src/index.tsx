import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import { Auth0Provider } from './providers/react-auth0-spa'
import history from './utils/history'

const onRedirectCallback = appState => {
  history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname)
}

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_DOMAIN as string}
    client_id={process.env.REACT_APP_CLIENT_ID as string}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
