import React, { useEffect } from 'react'
import { css } from 'styled-components'

import { AuthLayout } from 'src/components/authLayout'
import { useAuthController } from 'src/env/auth'

const loader = () => <LogoutPage />

export default loader

export function LogoutPage() {
  const authController = useAuthController()

  useEffect(() => {
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
