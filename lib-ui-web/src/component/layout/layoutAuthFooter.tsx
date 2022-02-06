import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { rgba } from 'polished'
import { animated, useTransition } from 'react-spring'
import { highStyle } from 'retil-css'
import { LinkSurface } from 'retil-interaction'
import { NavAction } from 'retil-nav'

import { RaisedLabelledButtonBody } from '~/component/button/raisedLabelledButtonBody'
import { OutlinedLabelledButtonBody } from '~/component/button/outlinedLabelledButtonBody'
import { FlexGap } from '~/component/flex/flexGap'
import { barHeight, barWidth, blockMarginHorizontal } from '~/style/dimensions'
import { raisedCardShadow } from '~/style/shadows'
import { appAuthBarZ } from '~/style/zIndexes'

export interface LayoutAuthFooterScheme {
  join: () => NavAction
  login: () => NavAction
}

export interface LayoutAuthFooterProps {
  active: boolean
  scheme: LayoutAuthFooterScheme
}

export function LayoutAuthFooter(props: LayoutAuthFooterProps) {
  const { active, scheme } = props
  const authFooterTransitions = useTransition(active, {
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
              <LinkSurface href={scheme.login()}>
                <OutlinedLabelledButtonBody lowProfile label="Login" />
              </LinkSurface>
              <FlexGap size="0.5rem" />
              <LinkSurface href={scheme.join()}>
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
