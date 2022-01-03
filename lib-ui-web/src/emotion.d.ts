import '@emotion/react'
import { Theme as AppTheme } from './type'

declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}
