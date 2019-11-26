import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'
import { Card, Icon } from 'antd'
import { Link } from 'react-router-dom'

interface IInitialValues {
    item: string
    [k: string]: any
}

const Groups: React.FunctionComponent<any> = () => {

    return (
        <LoggedIn subtitle="Groups">
            <div className="groups-list__grid inner-content">
                <Link to="/groups/create">
                    <Card>
                        <Icon type="plus" />
                        <span>Create new group</span>
                    </Card>
                </Link>
            </div>
        </LoggedIn>
    )
}

export default Groups