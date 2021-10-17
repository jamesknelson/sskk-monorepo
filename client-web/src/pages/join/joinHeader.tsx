import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { rgba } from 'polished'
import { highStyle } from 'retil-css'
import { ButtonSurface } from 'retil-interaction'

import { Tooltip } from 'src/components/tooltip'
import { ChevronLeft, ChevronRight } from 'src/assets/glyphs'
import { paletteColors, structureColors } from 'src/presentation/colors'
import { barHeight, blockMarginHorizontal } from 'src/presentation/dimensions'
import { easeInOut } from 'src/presentation/easings'
import { Icon } from 'src/presentation/icon'
import { standardRadius } from 'src/presentation/radii'
import { inkShadow } from 'src/presentation/shadows'

export interface JoinHeaderProps {
  showBack?: boolean
}

export default function JoinHeader(props: JoinHeaderProps) {
  return (
    <div
      css={css`
        position: relative;
        flex-grow: 1;

        display: flex;
        justify-content: space-between;
        height: ${barHeight};
        margin: 0 0.5rem;

        background-color: ${structureColors.wash};
        border-radius: 0 0 ${standardRadius} ${standardRadius};
        box-shadow: ${inkShadow(structureColors.border, {
          external: true,
        })};
      `}>
      <div
        css={[
          css`
            display: flex;
            flex-basis: 12rem;
            flex-grow: 0;
            flex-shrink: 1;

            align-items: center;
            margin-left: -0.5rem;
          `,
          highStyle({
            paddingLeft: blockMarginHorizontal,
          }),
        ]}>
        {props.showBack && (
          // TODO: animate this
          <Icon
            color={paletteColors.ink500}
            glyph={ChevronLeft}
            label={null}
            size="1.5rem"
          />
        )}
      </div>
      <JoinStepIndicators step={2} />
      <div
        css={[
          css`
            display: flex;
            flex-basis: 12rem;
            flex-grow: 0;
            flex-shrink: 1;

            align-items: center;
            justify-content: flex-end;
            margin-right: -0.5rem;
          `,

          highStyle({
            paddingRight: blockMarginHorizontal,
          }),
        ]}>
        <ButtonSurface>
          <div
            css={css`
              display: flex;
              align-items: center;

              color: ${paletteColors.ink100};

              font-family: sans-serif;
              font-size: 14px;
              font-weight: 500;
              text-transform: uppercase;
            `}>
            0 / 280
            <Icon
              color={paletteColors.ink100}
              glyph={ChevronRight}
              label={null}
              css={css`
                margin-left: 1rem;
              `}
              size="1.5rem"
            />
          </div>
        </ButtonSurface>
      </div>
    </div>
  )
}

interface StyledJoinPositionProps {
  active: boolean
  complete: boolean
  percentage: number
}

const StyledJoinPosition = styled.div<StyledJoinPositionProps>`
  display: block;
  height: 13px;
  width: 13px;
  position: absolute;
  left: ${(props) => props.percentage}%;
  margin-left: -6px;
  top: calc(50% - 7px);
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 0 1.2px
      ${(props) =>
        props.active || props.complete
          ? paletteColors.ink900
          : paletteColors.ink100}
      inset,
    0 0 10px
      ${(props) =>
        rgba(
          props.active || props.complete
            ? paletteColors.ink900
            : paletteColors.ink100,
          0.12,
        )},
    0 0 10px
      ${(props) =>
        rgba(
          props.active || props.complete
            ? paletteColors.ink900
            : paletteColors.ink100,
          0.12,
        )}
      inset;

  transition: transform 250ms 250ms ${easeInOut};
  ${(props) =>
    props.complete &&
    css`
      transform: scale(1.05);
    `}
`

interface JoinPositionProps {
  active?: boolean
  complete?: boolean
  href?: string
  percentage: number
  tooltip: string
}

const JoinPosition = ({
  active,
  complete,
  href,
  percentage,
  tooltip,
}: JoinPositionProps) => {
  // const linkProps = useLinkProps({ href })
  const linkProps = {}

  return (
    <Tooltip label={tooltip} placement="bottom">
      <StyledJoinPosition
        as={href ? 'a' : 'div'}
        complete={!!complete}
        active={!!active}
        {...(href ? linkProps : {})}
        percentage={percentage}>
        <InnerJoinPosition
          color={complete ? paletteColors.ink900 : 'transparent'}
        />
      </StyledJoinPosition>
    </Tooltip>
  )
}

interface InnerJoinPositionProps {
  color: string
}

const InnerJoinPosition = styled.div<InnerJoinPositionProps>`
  position: absolute;
  height: calc(0.5rem + 1px);
  width: calc(0.5rem + 1px);
  left: 0.125rem;
  top: 0.125rem;
  background-color: ${(props) => props.color};
  border-radius: 9999px;
  transition: background-color 250ms 250ms ${easeInOut};
`

interface JoinFlowIndicatorProps {
  step: number
}

function JoinStepIndicators({ step }: JoinFlowIndicatorProps) {
  const progressBarProportion = Math.min(1, (step - 1) / 5)

  return (
    <div
      css={css`
        position: relative;
        flex-grow: 1;
        margin: 0 auto;
        max-width: 710px;
      `}>
      <div
        css={css`
          position: absolute;
          width: 100%;
          top: calc(50% - 1px);
          border-radius: 9999px;
          height: 1px;
          flex-grow: 1;
          box-shadow: 0 0 0 1px ${paletteColors.ink100} inset,
            0 0 10px 0px ${rgba(paletteColors.ink100, 0.33)},
            0 0 3px 1px ${rgba(paletteColors.ink100, 0.1)};
        `}
      />
      <div
        style={{
          transform: `scaleX(${progressBarProportion})`,
        }}
        css={css`
          position: absolute;
          width: 100%;
          top: calc(50% - 1px);
          border-radius: 9999px;
          height: 1px;
          flex-grow: 1;
          box-shadow: 0 0 0 1px ${paletteColors.ink500} inset,
            0 0 10px 0px ${rgba(paletteColors.ink500, 0.33)},
            0 0 3px 1px ${rgba(paletteColors.ink500, 0.1)};
          transform-origin: 0 0;
          transition: transform 250ms ${easeInOut};
        `}
      />
      <JoinPosition
        percentage={0}
        active={step === 1}
        complete={step > 1}
        tooltip="Decide to join"
      />
      <JoinPosition
        percentage={20}
        active={step === 2}
        complete={step > 2}
        tooltip="Say hello"
      />
      <JoinPosition
        percentage={40}
        active={step === 3}
        complete={step > 3}
        tooltip="Account details"
      />
      <JoinPosition
        percentage={60}
        active={step === 4}
        complete={step > 4}
        tooltip="Pick your plan"
      />
      <JoinPosition
        percentage={80}
        active={step === 5}
        complete={step > 5}
        tooltip="Choose your @address"
      />
      <JoinPosition
        percentage={100}
        active={step === 6}
        complete={step > 6}
        tooltip="Confirmation"
      />
    </div>
  )
}
