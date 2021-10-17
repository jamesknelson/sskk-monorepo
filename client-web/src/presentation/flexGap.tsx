import styled from '@emotion/styled'
import { HighStyleValue, highStyle } from 'retil-css'

export interface FlexGapProps {
  size?: HighStyleValue<string>
}

export const FlexGap = styled.div<FlexGapProps>((props) =>
  highStyle({
    flexBasis: props.size || 0,
    width: props.size || undefined,
    flexGrow: props.size ? 0 : 1,
    flexShrink: 0,
  }),
)
