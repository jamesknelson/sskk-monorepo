import '@emotion/react'
import { Theme as AppTheme } from 'lib-ui-web/theme'

declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}
