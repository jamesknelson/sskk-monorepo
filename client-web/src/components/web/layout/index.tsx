import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { rgba } from 'polished'
import React from 'react'
import { animated, useTransition } from 'react-spring'
import { highStyle } from 'retil-css'
import { LinkSurface } from 'retil-interaction'
import { useSourceLegacy } from 'retil-source'

import { Glasses, Home, Pen } from 'src/assets/glyphs'
import { ColumnTransition } from 'src/components/columnTransition'
import { useAppEnv } from 'src/env'
import appURLs from 'src/pages/appURLs'
import {
  OutlineButtonBody,
  RaisedButtonBody,
} from 'src/presentation/buttonBodies'
import {
  paletteColors,
  structureColors,
  textColors,
} from 'src/presentation/colors'
import {
  barHeight,
  barWidth,
  blockMarginHorizontal,
} from 'src/presentation/dimensions'
import { FlexGap } from 'src/presentation/flexGap'
import { GlyphComponent, Icon } from 'src/presentation/icon'
import { raisedCardShadow } from 'src/presentation/shadows'
import { appAuthBarZ, appMainZ, appNavBarZ } from 'src/presentation/zIndexes'
import { authBarHiddenSource } from 'src/services/authBarService'

export interface AppLayoutProps {
  children: React.ReactNode
  getTransitionKey: () => string
}

export default function AppLayout({
  children,
  getTransitionKey,
}: AppLayoutProps) {
  const transitionKey = getTransitionKey()

  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        max-width: 100%;
      `}>
      <AppNavSidebar />
      <div
        css={css`
          flex-grow: 1;

          display: flex;
          flex-direction: column;
        `}>
        <main
          css={css`
            position: relative;
            flex-grow: 1;
            z-index: ${appMainZ};

            display: flex;
            flex-direction: column;
          `}>
          <ColumnTransition
            css={css`
              flex-grow: 1;
            `}
            children={children}
            transitionKey={transitionKey}
          />
        </main>
        <AppAuthFooter />
      </div>
    </div>
  )
}

function AppNavSidebar() {
  return (
    <nav
      css={css`
        flex: 0 0 calc(${barWidth} + 1px);
      `}>
      <div
        css={css`
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: ${barWidth};
          z-index: ${appNavBarZ};

          display: flex;
          flex-direction: column;

          background: ${paletteColors.ink900}
            linear-gradient(
              105deg,
              rgba(0, 0, 0, 0.1),
              rgba(255, 255, 255, 0.05)
            );
          box-shadow: 0 0 2px 0px ${rgba(paletteColors.ink900, 0.75)},
            0 0 10px ${rgba(paletteColors.ink900, 0.15)} inset,
            0 0 10px ${rgba(paletteColors.ink900, 0.15)};
        `}>
        <FlexGap
          // TODO: put a member pill here
          size={barHeight}
        />
        <FlexGap size={'0.5rem'} />
        <NavSidebarItem glyph={Home} href="/" label="Home" />
        <NavSidebarItem glyph={Glasses} href="/" label="Read" />
        <NavSidebarItem glyph={Pen} href="/" label="Write" />
        <FlexGap />
        <div
          css={css`
            height: ${barHeight};

            display: flex;
            align-items: center;
            justify-content: center;

            color: ${paletteColors.ink900};
            font-family: Chomsky;
            font-size: 2rem;
            text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.1),
              -1px -1px 1px rgba(0, 0, 0, 0.1);
          `}>
          <span>l.h</span>
        </div>
      </div>
    </nav>
  )
}

interface NavSidebarItemProps {
  glyph: GlyphComponent
  href: string
  label: string
}

function NavSidebarItem(props: NavSidebarItemProps) {
  return (
    <LinkSurface
      href={props.href}
      css={css`
        flex: 4rem 0 0;
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
      `}>
      <Icon
        color="rgba(255, 255, 255, 0.75)"
        label={props.label}
        glyph={props.glyph}
        size="28px"
      />
    </LinkSurface>
  )
}

interface AppAuthFooterProps {}

function AppAuthFooter(_props: AppAuthFooterProps) {
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
