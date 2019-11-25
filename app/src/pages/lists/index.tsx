import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'


interface IInitialValues {
  item: string
  [k: string]: any
}

const Lists:React.FunctionComponent<any> = () => {
    
    return (
        <LoggedIn subtitle="Lists">
            <p>Create Lists</p>
        </LoggedIn>
    )
}

export default Lists