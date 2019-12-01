import { PageHeader } from 'antd'
import { Menu, Icon } from 'antd'
import * as React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface ILoggedInProps {
  children: React.ReactNode,
  subtitle?: React.ReactNode
}
export default ({ children, subtitle }: ILoggedInProps) => {
  const [state, setState] = useState({
    current: 'mail',
  })

  const handleClick = e => {
    console.log('click ', e)
    setState({
      current: e.key,
    })
  }

  return (
    <>
      <Menu onClick={handleClick} selectedKeys={[state.current]} mode="vertical">
        <Menu.Item key="dashboard">
          <Link to="/">
            <Icon type="appstore" />
            Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="lists">
          <Link to="/lists">
            <Icon type="unordered-list" />
            Lists</Link>
        </Menu.Item>
        <Menu.Item key="groups">
          <Link to="/groups">
            <Icon type="team" />
            Groups</Link>
        </Menu.Item>
        <Menu.Item key="account">
          <Link to="/account">
            <Icon type="user" />
            Your account
          </Link>
        </Menu.Item>
      </Menu>
      <div className="main-content">
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          title={<h3>SocialList</h3>}
          subTitle={subtitle}
        />{' '}
        {children}
      </div>
    </>
  )
}
