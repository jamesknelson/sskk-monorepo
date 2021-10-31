import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { paletteColors, structureColors, textColors } from './colors'
import { standardRadius } from './radii'
import { TextBlock } from './blocks'

// TODO:
// - this should actually be part of the prosemirror json
// - the pills should be rendered by a multi select

export type LetterMetaAddress =
  | { type: 'placeholder'; label: string }
  | { type: 'guest'; handle: string }
  | { type: 'member'; handle: string; name?: string; photoURL?: string }

export interface LetterMetaBlockProps {
  title: string | null
  to: LetterMetaAddress[]
  from: LetterMetaAddress[]
}

export function LetterMetaBlock(props: LetterMetaBlockProps) {
  const { title, to, from } = props

  return (
    <TextBlock
      css={css`
        h1 {
          padding-bottom: 0.5rem;
          margin-bottom: 0;
          border-bottom: 1px solid ${structureColors.divider};
        }
      `}>
      {title && <h1>{title}</h1>}
      <div
        css={css`
          color: ${textColors.tertiary};
          font-family: sans-serif;
          font-size: 15px;
          line-height: 1.5rem;
        `}>
        <LetterMetaRow>
          <UnselectableSpan>To:</UnselectableSpan>
          {to.map((to, i) => (
            <AddressPill key={i} {...to} />
          ))}
        </LetterMetaRow>
        <LetterMetaRow>
          <UnselectableSpan>From:</UnselectableSpan>
          {from.map((to, i) => (
            <AddressPill key={i} {...to} />
          ))}
        </LetterMetaRow>
      </div>
    </TextBlock>
  )
}

function AddressPill(props: LetterMetaAddress) {
  switch (props.type) {
    case 'placeholder':
      return <AddressPillContent>{props.label}</AddressPillContent>
    case 'member':
      return <AddressPillContent>@{props.handle}</AddressPillContent>
    case 'guest':
      return <AddressPillContent>@{props.handle}</AddressPillContent>
  }
}

const AddressPillContent: React.FunctionComponent = ({ children, ...rest }) => (
  <span
    {...rest}
    css={css`
      background-color: ${paletteColors.ink050};
      border-radius: ${standardRadius};
      color: ${paletteColors.ink900};
      padding: 0.25rem 0.5rem;
      margin-left: 0.5rem;
    `}>
    {children}
  </span>
)

const LetterMetaRow = styled.div`
  border-bottom: 1px solid ${structureColors.divider};
  padding: 0.5rem 0;
`

const UnselectableSpan = styled.span`
  user-select: none;
`
