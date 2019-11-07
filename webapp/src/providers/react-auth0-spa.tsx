import * as React from 'react'
import { useState, useEffect, useContext, createContext } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'

interface IAuth0Provider {
  children: React.ReactNode
  domain: string
  client_id: string
  redirect_uri: string
  loading?: boolean
  popupOpen?: boolean
  loginWithPopup?(params: any): void
  onRedirectCallback(appState: any): void
}

export interface IAuth0 {
  user: any
  isAuthenticated: boolean
  loading?: boolean
  loginWithRedirect(p: any): void
  logout(p: any): void
}

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname)

export const Auth0Context = createContext({
  user: {},
  isAuthenticated: false,
  loginWithRedirect: () => null,
  logout: () => null,
})
export const useAuth0 = (): IAuth0 => useContext(Auth0Context)
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}: IAuth0Provider) => {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [user, setUser] = useState()
  const [auth0Client, setAuth0] = useState()
  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions as Auth0ClientOptions)
      setAuth0(auth0FromHook)

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback()
        onRedirectCallback(appState)
      }

      const isAuthenticatedResult = await auth0FromHook.isAuthenticated()

      setIsAuthenticated(isAuthenticatedResult)

      if (isAuthenticatedResult) {
        const userResult = await auth0FromHook.getUser()
        setUser(userResult)
      }

      setLoading(false)
    }
    initAuth0()
    // eslint-disable-next-line
  }, [])

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true)
    try {
      await auth0Client.loginWithPopup(params)
    } catch (error) {
      console.error(error)
    } finally {
      setPopupOpen(false)
    }
    const userPopupResult = await auth0Client.getUser()
    setUser(userPopupResult)
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    setLoading(true)
    await auth0Client.handleRedirectCallback()
    const userRedirectResult = await auth0Client.getUser()
    setLoading(false)
    setIsAuthenticated(true)
    setUser(userRedirectResult)
  }
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}
