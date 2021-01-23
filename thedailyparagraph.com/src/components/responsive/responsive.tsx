import React from 'react'
import styled from 'styled-components'

import { useMediaQuery } from 'src/utils/media'
import { media, mediaQueries } from 'src/theme'

export { media, mediaQueries }

export const StyledPhoneOnly = styled.div`
  ${media.tabletPlus`
    display: none !important;
  `}
`

export const StyledTabletPlus = styled.div`
  ${media.phoneOnly`
    display: none !important;
  `}
`

// Note: on server side, the result will always be rendered, but will be
// hidden using a CSS media query.

export const PhoneOnly = (
  props: React.ComponentProps<typeof StyledPhoneOnly>,
) => {
  let isPhone = useMediaQuery(mediaQueries.phoneOnly)
  return isPhone === null || isPhone ? <StyledPhoneOnly {...props} /> : null
}

export const TabletPlus = (
  props: React.ComponentProps<typeof StyledTabletPlus>,
) => {
  let isWide = useMediaQuery(mediaQueries.tabletPlus)
  return isWide === null || isWide ? <StyledTabletPlus {...props} /> : null
}
