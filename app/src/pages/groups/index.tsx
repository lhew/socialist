import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'


interface IInitialValues {
  item: string
  [k: string]: any
}

const Groups:React.FunctionComponent<any> = () => {
    
    return (
        <LoggedIn subtitle="Groups">
            <p>Create group</p>
        </LoggedIn>
    )
}

export default Groups