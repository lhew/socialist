import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'
import { Card, Icon } from 'antd'
import { Link } from 'react-router-dom'
import { UserContext } from '../../providers/UserProvider'
import { useQuery, useLazyQuery } from 'react-apollo'
import { GET_GROUPS_BY } from '../../graphql/queries'

interface IInitialValues {
    item: string
    [k: string]: any
}

const Groups: React.FunctionComponent<any> = () => {

    const context = React.useContext(UserContext);
    const [getGroupsBy, { called, data, loading, error }] = useLazyQuery(GET_GROUPS_BY)

    React.useEffect(() => {
        if (!called && context.user.id && context.user.id.length > 0) {
            getGroupsBy({
                variables: {
                    owner: context.user.id
                }
            })
        }
    }, [context.user.id])


    return (
                <div className="groups-list__grid inner-content">
                    {called && loading && <><Icon type="loading" /> Fetching your groups</>}
                    {error && <><Icon type="error" /> Something went wrong. try to access the page again</>}
                    {called && data && <>
                        <Link to="/groups/create">
                            <Card>
                                <Icon type="plus" />
                                <span>Create new group</span>
                            </Card>
                        </Link>
                        {data.getGroupsBy && data.getGroupsBy.map(group => (<Link key={group.id} to={`/groups/edit/${group.id}`} >
                            <Card>
                                <Icon type="team" />
                                <span>{group.name}</span>
                            </Card>
                        </Link>)
                        )}
                    </>}
                    {console.log(data)}
                </div>
    )
}

export default Groups