import * as React from 'react'

export interface AppLayoutProps {
  children: React.ReactNode
  title: string
}

export function AuthLayout(props: AppLayoutProps) {
  const { children, title } = props

  return (
    <div className="AuthLayout">
      <h1>{title}</h1>
      {children}
    </div>
  )
}
