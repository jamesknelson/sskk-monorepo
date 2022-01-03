import { Global } from '@emotion/react'
import prosemirrorStyles from 'prosemirror-view/style/prosemirror.css'

import { GlobalStyles } from 'lib-ui-web/style/globalStyles'
import { GlobalStylesInDevMode } from 'lib-ui-web/style/globalStylesInDevMode'

export const AppGlobalStyles = () => {
  return (
    <>
      {import.meta.env.DEV && <GlobalStylesInDevMode />}
      <GlobalStyles />
      <Global styles={prosemirrorStyles} />
    </>
  )
}
