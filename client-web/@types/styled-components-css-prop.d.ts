// types by @EddyVinck:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245#issuecomment-667702855

import 'styled-components'
import { CSSProp } from 'styled-components'
import { theme } from '../styling/theme'

type CSSFunction = (args: { theme: typeof theme }) => CSSObject

declare module 'react' {
  interface Attributes {
    css?: CSSProp | CSSFunction
  }
}

type Theme = typeof theme

// https://github.com/styled-components/styled-components-website/issues/447
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
