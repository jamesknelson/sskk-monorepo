import { css } from '@emotion/react'
import { rgba } from 'polished'
import { LinkSurface } from 'retil-interaction'

import { Glasses, Home, Pen } from 'src/assets/glyphs'
import { paletteColors } from 'src/presentation/colors'
import { barHeight, barWidth } from 'src/presentation/dimensions'
import { FlexGap } from 'src/presentation/flexGap'
import { GlyphComponent, Icon } from 'src/presentation/icon'
import { appNavBarZ } from 'src/presentation/zIndexes'

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
