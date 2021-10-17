import { css } from '@emotion/react'
import { LoaderProps } from 'retil-mount'
import { AppEnv } from 'src/env'

import { paletteColors } from 'src/presentation/colors'
import { LoadingSpinner } from 'src/presentation/loadingSpinner'

function LoadingPage() {
  return (
    <div
      css={css`
        position: fixed;
        height: 4rem;
        width: 4rem;
        top: calc(50% - 2rem);
        left: calc(50% - 2rem);
        margin: 0 auto;
      `}>
      <LoadingSpinner color={paletteColors.ink100} />
    </div>
  )
}

const loader = (_props: LoaderProps<AppEnv>) => <LoadingPage />

export default loader
