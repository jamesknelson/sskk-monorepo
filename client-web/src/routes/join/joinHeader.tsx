import { css } from '@emotion/react'
import { rgba } from 'polished'
import { highStyle } from 'retil-css'
import { useNavLinkProps } from 'retil-nav'

// import { ChevronLeft, ChevronRight } from 'src/assets/glyphs'
import { Tooltip } from 'src/components/web/tooltip'
import { barHeight, blockMarginHorizontal } from 'src/style/dimensions'
import { easeIn, easeOut } from 'src/style/easings'
import { useAppEnv } from 'src/env'
import appURLs from 'src/routes/appURLs'
// import { Icon } from 'src/presentation/icon'

import { JoinPath, useJoinContext } from './joinContext'
import { useTheme } from 'src/style/useTheme'

const totalStepCount = 6

export default function JoinHeader() {
  return (
    <div
      css={css`
        position: relative;
        flex-grow: 1;

        display: flex;
        justify-content: space-between;
        height: ${barHeight};
        margin: 0 calc(0.5rem + 1px);
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
        {/* {props.showBack && (
          // TODO: animate this
          <Icon
            color={paletteColors.ink500}
            glyph={ChevronLeft}
            label={null}
            size="1.5rem"
          />
        )} */}
      </div>
      <JoinStepIndicators />
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
        {/* <ButtonSurface>
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
        </ButtonSurface> */}
      </div>
    </div>
  )
}

interface JoinPositionProps {
  disableLink?: boolean
  paths: JoinPath[]
  step: number
  tooltip: string
}

const JoinPosition = ({
  disableLink,
  paths,
  step,
  tooltip,
}: JoinPositionProps) => {
  const colorScheme = useTheme().color
  const { completedSteps, path: activePath } = useJoinContext()

  const active = paths.includes(activePath)
  const href = appURLs.join[paths[0]]()

  const percentage = (100 / (totalStepCount - 1)) * step
  const complete = completedSteps > step
  const next = completedSteps === step

  const linkProps = useNavLinkProps(href, {
    disabled: disableLink || active || (!complete && !next),
  })

  // const borderColor =
  //   next || complete ? theme.color.primary : paletteColors.ink100
  // const borderShadowColor = rgba(borderColor, 0.12)
  // const circleColor = !complete
  //   ? 'transparent'
  //   : active
  //   ? paletteColors.ink500
  //   : paletteColors.ink900
  const borderColor =
    next || complete ? colorScheme.primary : colorScheme.primaryWash
  const borderShadowColor = rgba(borderColor, 0.12)
  const circleColor = !complete
    ? 'transparent'
    : active
    ? colorScheme.primaryWash
    : colorScheme.primary

  const targetSize = '40px'

  return (
    <Tooltip label={tooltip} placement="bottom" offset={[0, -4]}>
      <a
        {...linkProps}
        css={css`
          position: absolute;
          left: calc(${percentage}% - ${targetSize} / 2);
          top: calc((${barHeight} - ${targetSize}) / 2);
          height: ${targetSize};
          width: ${targetSize};

          display: flex;
          align-items: center;
          justify-content: center;
        `}>
        <div
          css={css`
            position: relative;
            height: 13px;
            width: 13px;
            border-radius: 9999px;
            background-color: ${colorScheme.background};
            box-shadow: 0 0 0 1.2px ${borderColor} inset,
              0 0 10px ${borderShadowColor}, 0 0 10px ${borderShadowColor} inset;
            transition: box-shadow 500ms 500ms ${easeOut};
          `}>
          <div
            style={{ backgroundColor: circleColor }}
            css={css`
              position: absolute;
              height: calc(0.5rem + 1px);
              width: calc(0.5rem + 1px);
              left: 0.125rem;
              top: 0.125rem;
              background-color: ${circleColor};
              border-radius: 9999px;
              transition: background-color 250ms ${easeIn};
            `}
          />
        </div>
      </a>
    </Tooltip>
  )
}

function JoinStepIndicators() {
  const colorScheme = useTheme().color
  const appEnv = useAppEnv()
  const { completedSteps } = useJoinContext()
  const progressBarProportion = Math.min(
    1,
    completedSteps / (totalStepCount - 1),
  )

  return (
    <div
      css={css`
        position: relative;
        flex-basis: 300px;
        flex-grow: 1;
        flex-shrink: 1;
        margin: 0 auto;
        max-width: 710px;
      `}>
      <div
        css={css`
          position: absolute;
          width: 100%;
          top: 50%;
          border-radius: 9999px;
          height: 1px;
          flex-grow: 1;
          // ink100
          box-shadow: 0 0 0 1px ${colorScheme.primaryWash} inset,
            0 0 10px 0px ${rgba(colorScheme.primaryWash, 0.33)},
            0 0 3px 1px ${rgba(colorScheme.primaryWash, 0.1)};
        `}
      />
      <div
        style={{
          transform: `scaleX(${progressBarProportion})`,
        }}
        css={css`
          position: absolute;
          width: 100%;
          top: 50%;
          border-radius: 9999px;
          height: 1px;
          flex-grow: 1;
          // ink500
          box-shadow: 0 0 0 1px ${colorScheme.primaryWash} inset,
            0 0 10px 0px ${rgba(colorScheme.primaryWash, 0.33)},
            0 0 3px 1px ${rgba(colorScheme.primaryWash, 0.1)};
          transform-origin: 0 0;
          transition: transform 250ms 250ms linear;
        `}
      />
      <JoinPosition paths={['top']} step={0} tooltip="Welcome!" />
      <JoinPosition
        paths={['writeIntroLetter']}
        step={1}
        tooltip="Write your introduction"
      />
      <JoinPosition
        disableLink={!!appEnv.customer}
        paths={['createAccount']}
        step={2}
        tooltip="Create your login"
      />
      <JoinPosition
        paths={['selectMembershipType', 'enterPaymentDetails']}
        step={3}
        tooltip="Pick your plan"
      />
      <JoinPosition
        paths={['chooseAddress']}
        step={4}
        tooltip="Choose your @address"
      />
      <JoinPosition
        paths={['confirmAndComplete']}
        step={5}
        tooltip="Join Letterhouse"
      />
    </div>
  )
}
