import { PageHeader } from 'antd'
import * as React from 'react'

interface ILoggedInProps {
  children: React.ReactNode
}
export default ({ children }: ILoggedInProps) => (
  <div>
    <PageHeader
      style={{
        border: '1px solid rgb(235, 237, 240)',
      }}
      title={<h3>SocialList</h3>}
      subTitle="Home"
    />{' '}
    ,{children}
  </div>
)
