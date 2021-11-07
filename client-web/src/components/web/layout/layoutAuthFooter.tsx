import { css } from '@emotion/react'
import { animated, useTransition } from 'react-spring'
import { highStyle } from 'retil-css'
import { LinkSurface } from 'retil-interaction'
import { useSourceLegacy } from 'retil-source'

import { useAppEnv } from 'src/env'
import appURLs from 'src/pages/appURLs'
import {
  OutlineButtonBody,
  RaisedButtonBody,
} from 'src/presentation/buttonBodies'
import { structureColors } from 'src/presentation/colors'
import {
  barHeight,
  barWidth,
  blockMarginHorizontal,
} from 'src/presentation/dimensions'
import { FlexGap } from 'src/presentation/flexGap'
import { raisedCardShadow } from 'src/presentation/shadows'
import { appAuthBarZ } from 'src/presentation/zIndexes'
import { authBarHiddenSource } from 'src/services/authBarService'

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
              css={[
                css`
                  position: fixed;
                  left: ${barWidth};
                  right: 0;
                  bottom: 0;
                  height: ${barHeight};
                  z-index: ${appAuthBarZ};

                  display: flex;
                  align-items: center;

                  background-color: ${structureColors.bg};
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
                <OutlineButtonBody lowProfile label="Login" />
              </LinkSurface>
              <FlexGap size="0.5rem" />
              <LinkSurface href={appURLs.join()}>
                <RaisedButtonBody lowProfile label="Join" />
              </LinkSurface>
            </animated.footer>
          ),
      )}
    </>
  )
}

const AppAuthFooterMessage = styled.p`
  color: ${textColors.secondary};
  flex: 1;

  font-family: sans-serif;
  font-size: 0.9rem;
  line-height: 1rem;

  strong {
    font-weight: 700;
  }
`
