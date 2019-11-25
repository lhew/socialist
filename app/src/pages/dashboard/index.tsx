import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'


interface IInitialValues {
  item: string
  [k: string]: any
}

const Dashboard:React.FunctionComponent<any> = () => {
    
    return (
        <LoggedIn subtitle="Dashboard">
            <p>Create Dashboard</p>
        </LoggedIn>
    )
}

export default Dashboard