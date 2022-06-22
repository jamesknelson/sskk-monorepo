import { css } from '@emotion/react'
import { rgba } from 'polished'
import { LinkSurface } from 'retil-interaction'
import { NavAction } from 'retil-nav'

import { Glasses, Home, Pen } from '~/asset/glyph'
import { FlexGap } from '~/component/flex/flexGap'
import { GlyphComponent, Icon } from '~/component/icon'
import { barHeight, barWidth } from '~/style/dimensions'
import { appNavBarZ } from '~/style/zIndexes'

export interface LayoutNavScheme {
  read: () => NavAction
  top: () => NavAction
}

export interface LayoutNavProps {
  scheme: LayoutNavScheme
}

export function LayoutNav({ scheme }: LayoutNavProps) {
  return (
    <nav
      css={css`
        flex: 0 0 calc(${barWidth} + 1px);
      `}>
      <div
        css={(theme) => css`
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          width: ${barWidth};
          z-index: ${appNavBarZ};

          display: flex;
          flex-direction: column;

          background: ${theme.color.primary}
            linear-gradient(
              105deg,
              rgba(0, 0, 0, 0.1),
              rgba(255, 255, 255, 0.05)
            );
          box-shadow: 0 0 2px 0px ${rgba(theme.color.primary, 0.75)},
            0 0 10px ${rgba(theme.color.primary, 0.15)} inset,
            0 0 10px ${rgba(theme.color.primary, 0.15)};
        `}>
        <FlexGap
          // TODO: put a member pill here
          size={barHeight}
        />
        <FlexGap size={'0.5rem'} />
        <LayoutNavSidebarItem glyph={Home} href={scheme.top()} label="Home" />
        <LayoutNavSidebarItem
          glyph={Glasses}
          href={scheme.read()}
          label="Read"
        />
        <LayoutNavSidebarItem glyph={Pen} href="/" label="Write" />
        <FlexGap />
        <div
          css={(theme) => css`
            height: ${barHeight};

            display: flex;
            align-items: center;
            justify-content: center;

            color: ${theme.color.primary};
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

interface LayoutNavSidebarItemProps {
  glyph: GlyphComponent
  href: NavAction
  label: string
}

function LayoutNavSidebarItem(props: LayoutNavSidebarItemProps) {
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
