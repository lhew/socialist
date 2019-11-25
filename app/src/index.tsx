import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
// import registerServiceWorker from './registerServiceWorker'
import history from './utils/history'

const onRedirectCallback = appState => {
  history.push(appState && appState.targetUrl ? appState.targetUrl : window.location.pathname)
}

ReactDOM.render(
    <App />,
  document.getElementById('root') as HTMLElement
)
// registerServiceWorker()
  