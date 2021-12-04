import { Theme as EmotionTheme, ThemeContext } from '@emotion/react'
import { useContext } from 'react'

import { Theme as AppTheme } from 'src/types/theme'

export function useTheme(): AppTheme {
  return useContext(ThemeContext) as EmotionTheme
}
