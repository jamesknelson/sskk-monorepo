import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { rgba } from 'polished'
import { animated, useTransition } from 'react-spring'
import { highStyle } from 'retil-css'
import { LinkSurface } from 'retil-interaction'
import { useSourceLegacy } from 'retil-source'

import { OutlinedLabelledButtonBody } from 'src/components/web/button/outlinedLabelledButtonBody'
import { RaisedLabelledButtonBody } from 'src/components/web/button/raisedLabelledButtonBody'
import { FlexGap } from 'src/components/web/flex/flexGap'
import { useAppEnv } from 'src/env'
import appURLs from 'src/routes/appURLs'
import { authBarHiddenSource } from 'src/services/authBarService'
import {
  barHeight,
  barWidth,
  blockMarginHorizontal,
} from 'src/style/dimensions'
import { raisedCardShadow } from 'src/style/shadows'
import { appAuthBarZ } from 'src/style/zIndexes'

export interface LayoutAuthFooterProps {}

export function LayoutAuthFooter(_props: LayoutAuthFooterProps) {
  const env = useAppEnv()
  const forceAuthBarHidden = useSourceLegacy(authBarHiddenSource)
  const authBarHidden = env.customer !== null || forceAuthBarHidden

  let authFooterTransitions = useTransition(!authBarHidden, {
    config: {
      tension: 320,
    },
    from: { transform: `translateY(100%)` },
    enter: { transform: `translateY(0%)` },
    leave: { transform: `translateY(100%)` },
  })

  return (
    <>
      <div
        css={css`
          height: ${barHeight};
          width: 100%;
        `}
      />
      {authFooterTransitions(
        (style, show) =>
          show && (
            <animated.footer
              style={style}
              css={(theme) => [
                css`
                  position: fixed;
                  left: ${barWidth};
                  right: 0;
                  bottom: 0;
                  height: ${barHeight};
                  z-index: ${appAuthBarZ};

                  display: flex;
                  align-items: center;

                  background-color: ${theme.color.surface};
                  box-shadow: ${raisedCardShadow()};
                `,
                highStyle({
                  paddingLeft: blockMarginHorizontal,
                  paddingRight: blockMarginHorizontal,
                }),
              ]}>
              <AppAuthFooterMessage>
                Reserve your Letterhouse <strong>@address</strong> before
                someone else does. Join Letterhouse now!
              </AppAuthFooterMessage>
              <LinkSurface href={appURLs.login()}>
                <OutlinedLabelledButtonBody lowProfile label="Login" />
              </LinkSurface>
              <FlexGap size="0.5rem" />
              <LinkSurface href={appURLs.join()}>
                <RaisedLabelledButtonBody lowProfile label="Join" />
              </LinkSurface>
            </animated.footer>
          ),
      )}
    </>
  )
}

const AppAuthFooterMessage = styled.p`
  color: ${({ theme }) => rgba(theme.color.onPrimary, theme.opacity.alt)};

  flex: 1;

  font-family: sans-serif;
  font-size: 0.9rem;
  line-height: 1rem;

  strong {
    font-weight: 700;
  }
`
