import { css } from '@emotion/react'
import { useEffectOnce } from 'retil-support'

import { useAuthController } from 'src/env/auth'

const loader = () => <LogoutPage />

export default loader

export function LogoutPage() {
  const authController = useAuthController()

  useEffectOnce(() => {
    authController.signOut()
  })

  return (
    <>
      <h1>Thanks for visiting!</h1>
      <p
        css={css`
          margin-top: 1.5rem;
          text-align: center;
        `}>
        We do hope to see you again.
      </p>
    </>
  )
}
