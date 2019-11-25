import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'


interface IInitialValues {
  item: string
  [k: string]: any
}

const Account:React.FunctionComponent<any> = () => {
    
    return (
        <LoggedIn subtitle="Account">
            <p>Create account</p>
        </LoggedIn>
    )
}

export default Account