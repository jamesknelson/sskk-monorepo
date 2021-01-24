import React from 'react'
import { css } from 'styled-components'

import { AuthLayout } from 'src/components/authLayout'
import { useAuthController } from 'src/utils/auth'

export const router = () => <LogoutPage />

export function LogoutPage() {
  const authController = useAuthController()

  React.useEffect(() => {
    authController.signOut()
  }, [])

  return (
    <AuthLayout title="Thanks">
      <p
        css={css`
          margin-top: 1.5rem;
          text-align: center;
        `}>
        Thanks for visiting :)
      </p>
    </AuthLayout>
  )
}
