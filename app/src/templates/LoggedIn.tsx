import { PageHeader, Avatar, Dropdown } from 'antd'
import { Menu, Icon } from 'antd'
import * as React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../providers/UserProvider'
import auth from '../auth'

interface ILoggedInProps {
  children: React.ReactNode,
  subtitle?: React.ReactNode
}
export default ({ children, subtitle }: ILoggedInProps) => {

  const context = React.useContext(UserContext)
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
      </Menu>
      <div className="main-content">
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          title={<h3>SocialList</h3>}
          subTitle={subtitle || ""}
        />
        <div className="avatar-wrapper">
          <Dropdown overlay={() => (
            <Menu>
              <Menu.Item>
                {context.user.name}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item>
                <Link to="/account">
                  My Profile
            </Link>
              </Menu.Item>
              <Menu.Item>
                <a href="#" onClick={() => {
                  auth.signOut();
                  localStorage.removeItem('auth-token')
                  }}>
                  Logout
            </a>
              </Menu.Item>
            </Menu>
          )} placement="bottomRight">
            <Avatar src={context.user.image} className="main-avatar" />
          </Dropdown>
        </div>
          {children}
      </div>
    </>
  )
}
