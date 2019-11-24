import { PageHeader } from 'antd'
import { Menu, Icon } from 'antd'
import * as React from 'react'
import { useState } from 'react'

interface ILoggedInProps {
  children: React.ReactNode
}
export default ({ children }: ILoggedInProps) => {
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
    <div className="canvas">
      <Menu onClick={handleClick} selectedKeys={[state.current]} mode="vertical">
        <Menu.Item key="account">
          <Icon type="mail" />
          Your Account
        </Menu.Item>
        <Menu.Item key="groups">
          <Icon type="appstore" />
          Groups
        </Menu.Item>
        <Menu.Item key="lists">
          <Icon type="appstore" />
          Lists
        </Menu.Item>
      </Menu>
      <div className="main-content">
        <PageHeader
          style={{
            border: '1px solid rgb(235, 237, 240)',
          }}
          title={<h3>SocialList</h3>}
          subTitle="Home"
        />{' '}
        {children}
      </div>
    </div>
  )
}
