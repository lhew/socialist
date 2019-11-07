import * as React from 'react'

interface INotLoggedInProps {
  children: React.ReactNode
}
export default ({ children }: INotLoggedInProps) => <div>{children}</div>
