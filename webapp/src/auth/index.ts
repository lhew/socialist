import auth0 from 'auth0-js'

class Auth {
  public auth0: any
  public idToken: string
  public expiresAt: number
  public authFlag: string

  constructor() {
    // this.auth0 = null;
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_DOMAIN,
      clientID: process.env.REACT_APP_CLIENT_ID,
      redirectUri: 'http://localhost:3000/callback',
      audience: `https://${process.env.REACT_APP_DOMAIN}/userinfo`,
      responseType: 'token id_token',
      scope: 'openid email',
    })

    this.authFlag = 'isLoggedIn'
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  public login() {
    this.auth0.authorize()
  }

  public getIdToken() {
    return this.idToken
  }

  public handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          console.log('deu merda? ', err)
          return reject(err)
        }
        if (!authResult || !authResult.idToken) {
          console.log('deu ruim? ', err)
          return reject(err)
        }

        console.log('login deu bom pay')
        this.setSession(authResult)
        resolve('deu bom')
      })
    })
  }

  public setSession(authResult) {
    // this.idToken = authResult.idToken
    // console.log(this.idToken)
    // // set the time that the id token will expire at
    // this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime()
    this.idToken = authResult.idToken
    localStorage.setItem(this.authFlag, JSON.stringify(true))
  }

  public logout() {
    this.auth0.logout({
      returnTo: 'http://localhost:3000',
      clientID: '<YOUR_AUTH0_CLIENT_ID>',
    })
  }

  // public silentAuth() {
  //   return new Promise((resolve, reject) => {
  //     this.auth0.checkSession({}, (err, authResult) => {
  //       if (err) {
  //         return reject(err)
  //       }
  //       this.setSession(authResult)
  //       resolve()
  //     })
  //   })
  // }

  public silentAuth() {
    if (this.isAuthenticated()) {
      return new Promise((resolve, reject) => {
        this.auth0.checkSession({}, (err, authResult) => {
          if (err) {
            localStorage.removeItem(this.authFlag)
            return reject(err)
          }
          this.setSession(authResult)
          resolve('ok')
        })
      })
    }

    return false
  }

  public isAuthenticated() {
    // Check whether the current time is past the token's expiry time
    // return new Date().getTime() < this.expiresAt
    return JSON.parse(localStorage.getItem(this.authFlag) || 'false')
  }

  public signIn() {
    this.auth0.authorize()
  }

  public signOut() {
    localStorage.setItem(this.authFlag, JSON.stringify(false))
    this.auth0.logout({
      returnTo: 'http://localhost:3000',
      clientID: process.env.REACT_APP_CLIENT_ID,
    })
  }
}

const auth = new Auth()

export default auth
