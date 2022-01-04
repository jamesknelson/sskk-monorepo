import { css } from '@emotion/react'
import styled from '@emotion/styled'
import startCase from 'lodash/startCase'
import React from 'react'

import { sansFontFamily } from '~/style/fonts'

import { ColorScheme, Theme } from './theme'

export interface ThemeSamplerProps {
  palettes: Record<string, Record<string, string>>
  theme: Theme
}

export function ThemeSample(props: ThemeSamplerProps) {
  const { color, opacity } = props.theme

  return (
    <Panel>
      <ThemeSampleSurface
        bgColor={color.background}
        textColor={color.onBackground}>
        background / onBackground
        <Row>
          <ThemeSampleSurface
            bgColor={color.primaryWash}
            textColor={color.onSecondaryWash}>
            primaryWash / onPrimaryWash
            <ThemeSampleSurface
              bgColor={color.primary}
              textColor={color.onPrimary}>
              primary / onPrimary
            </ThemeSampleSurface>
          </ThemeSampleSurface>
          <ThemeSampleSurface
            bgColor={color.secondaryWash}
            textColor={color.onSecondaryWash}>
            secondaryWash / onSecondaryWash
            <ThemeSampleSurface
              bgColor={color.secondary}
              textColor={color.onSecondary}>
              secondary / onSecondary
            </ThemeSampleSurface>
          </ThemeSampleSurface>
          <ThemeSampleSurface
            bgColor={color.tertiaryWash}
            textColor={color.onTertiaryWash}>
            tertiaryWash / onTertiaryWash
            <ThemeSampleSurface
              bgColor={color.tertiary}
              textColor={color.onTertiary}>
              tertiary / onTertiary
            </ThemeSampleSurface>
          </ThemeSampleSurface>
        </Row>
        <Row>
          <ThemeSampleSurface
            bgColor={color.surface}
            borderColor={color.surfaceBorder}
            textColor={color.onSurface}>
            surfaceBorder / surface / onSurface
            <TextRow
              color={color}
              label="base"
              opacity={1}
              css={css`
                border-top: 1px solid ${color.surfaceLine};
                padding-top: 1rem;
              `}
            />
            <TextRow color={color} label="alt" opacity={opacity.alt} />
            <TextRow
              color={color}
              label="peripheral"
              opacity={opacity.peripheral}
            />
            <TextRow
              color={color}
              label="placeholder"
              opacity={opacity.placeholder}
            />
            <Row
              css={css`
                border-top: 1px solid ${color.surfaceLine};
                padding-top: 1rem;
              `}>
              <ThemeSampleSurface
                bgColor={color.primaryWash}
                textColor={color.onPrimaryWash}>
                primaryWash / onPrimaryWash
              </ThemeSampleSurface>
              <ThemeSampleSurface
                bgColor={color.secondaryWash}
                textColor={color.onSecondaryWash}>
                secondaryWash / onSecondaryWash
              </ThemeSampleSurface>
            </Row>
            <Row>
              <ThemeSampleSurface
                bgColor={color.tertiaryWash}
                textColor={color.onTertiaryWash}>
                tertiaryWash / onTertiaryWash
              </ThemeSampleSurface>
              <ThemeSampleSurface
                bgColor={color.issueWash}
                textColor={color.onIssueWash}>
                issueWash / onIssueWash
              </ThemeSampleSurface>
            </Row>
          </ThemeSampleSurface>
        </Row>
        <ThemeSampleSurface
          bgColor={color.altSurface}
          borderColor={color.altSurfaceBorder}
          textColor={color.onAltSurface}>
          altSurfaceBorder / altSurface / onAltSurface
        </ThemeSampleSurface>
        <Row>
          <ThemeSampleSurface
            bgColor={color.inverseSurface}
            textColor={color.onInverseSurface}
            borderColor={color.inverseSurfaceBorder}>
            inverseSurfaceBorder / inverseSurface / onInverseSurface
            <ThemeSampleSurface
              bgColor={color.inversePrimary}
              textColor={color.onPrimary}>
              inversePrimary / onPrimary
            </ThemeSampleSurface>
          </ThemeSampleSurface>
        </Row>
        <Row>
          <ThemeSampleSurface
            bgColor={color.issueWash}
            textColor={color.onIssueWash}>
            issueWash / onIssueWash
            <ThemeSampleSurface bgColor={color.issue} textColor={color.onIssue}>
              issue / onIssueWash
            </ThemeSampleSurface>
          </ThemeSampleSurface>
        </Row>
      </ThemeSampleSurface>
    </Panel>
  )
}

interface ThemeSampleSurfaceProps {
  children: React.ReactNode
  className?: string

  bgColor: string
  borderColor?: string
  textColor?: string
}

function ThemeSampleSurface(props: ThemeSampleSurfaceProps) {
  return (
    <div
      className={props.className}
      css={css`
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        border-radius: 2px;

        background-color: ${props.bgColor};
        color: ${props.textColor || 'inherit'};
        ${props.borderColor
          ? css`
              border: 1px solid ${props.borderColor};
            `
          : null}
      `}>
      {props.children}
    </div>
  )
}

interface TextRowProps {
  opacity: number
  label: string | null
  color: ColorScheme
  className?: string
}

function TextRow(props: TextRowProps) {
  const { color, label, opacity, ...rest } = props

  return (
    <Row {...rest} style={{ opacity }}>
      <span
        css={css`
          color: ${color.onSurface};
          flex: 0px 1 1;
          font-weight: bold;
        `}>
        {label}
      </span>{' '}
      <span
        css={css`
          flex: 0px 1 1;
          color: ${color.onSurface};
        `}>
        onSurface
      </span>{' '}
      <span
        css={css`
          flex: 0px 1 1;
          color: ${color.primary};
        `}>
        primary
      </span>{' '}
      <span
        css={css`
          flex: 0px 1 1;
          color: ${color.secondary};
        `}>
        secondary
      </span>{' '}
      <span
        css={css`
          flex: 0px 1 1;
          color: ${color.issue};
        `}>
        issue
      </span>
    </Row>
  )
}

const Row = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;
`

const Panel = styled.div`
  padding: 2rem;
  border-radius: 8px;
  background-color: white;
  border: 3px solid black;
  margin: 1rem 0;
  width: 100%;

  font-family: ${sansFontFamily};
`

export interface ThemePaletteProps {
  palette: Record<string, Record<string, string>>
}

export function ThemePalette(props: ThemePaletteProps) {
  const names = Object.keys(props.palette)
  const weights = [
    ...new Set(
      ([] as string[]).concat(
        ...names.map((name) => Object.keys(props.palette[name])),
      ),
    ),
  ].filter((weight) => weight !== '100' && weight !== '0')

  return (
    <Panel>
      <div
        css={css`
          display: grid;
          width: 100%;
          gap: 3px;
          grid-template-columns: 40px;
          grid-template-rows: 30px;
          grid-auto-columns: 1fr;
          grid-auto-rows: 40px;
        `}>
        <div
          css={css`
            grid-column: 1;
            grid-row: 1;
          `}></div>
        {names.map((name, i) => (
          <div
            key={i}
            css={css`
              grid-column: ${i + 2};
              grid-row: 1;

              display: flex;
              align-items: center;
              justify-content: center;
            `}>
            {startCase(name)}
          </div>
        ))}
        {weights.map((weight, j) => (
          <React.Fragment key={j}>
            <div
              css={css`
                grid-column: 1;
                grid-row: ${j + 2};

                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 1rem;
              `}>
              {weight}
            </div>
            {names.map((name, i) => (
              <div
                key={name}
                css={css`
                  grid-column: ${i + 2};
                  grid-row: ${j + 2};

                  background-color: ${props.palette[name][weight]};
                `}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </Panel>
  )
}
