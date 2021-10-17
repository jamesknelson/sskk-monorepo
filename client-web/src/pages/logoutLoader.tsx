import { css } from '@emotion/react'
import { useEffectOnce } from 'retil-support'

import { AuthLayout } from 'src/components/authLayout'
import { useAuthController } from 'src/env/auth'

const loader = () => <LogoutPage />

export default loader

export function LogoutPage() {
  const authController = useAuthController()

  useEffectOnce(() => {
    authController.signOut()
  })

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
