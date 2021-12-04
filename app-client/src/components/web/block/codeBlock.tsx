import { css } from '@emotion/react'
import { darken, desaturate, lighten } from 'polished'
import React, { useMemo } from 'react'
import Prism from 'prismjs'

import { blockHorizontalGutter, blockVerticalGutter } from './blockStyles'

const green = '#12c8ba'
const red = '#dd3c6f'
const purple = '#8233ff'
const lighterGrey = '#f0f4fc'
const lightGrey = '#dae1f2'
const darkGrey = '#8a8ab5'
const darkerGrey = '#7272a3'
const lightBlack = '#342656'
const black = '#0f0035'

const lightRed = desaturate(0.15, lighten(0.15, red))

export const twoToneColorScheme: CodeBlockColorScheme = {
  background: black,
  propAttr: lighten(0.3, red),
  text: darken(0.05, lightGrey),
  comment: darkerGrey,
  keyword: lighten(0.15, red),
  string: lighten(0.3, green),
  variable: lighterGrey,
  entity: lightRed,
  tag: lighten(0.07, red),
  operator: lighten(0.15, green),
  number: lighten(0.2, green),
  inserted: green,
  fn: green,
}

export const lightColorScheme: CodeBlockColorScheme = {
  background: lighterGrey,
  propAttr: lighten(0.15, lightBlack),
  text: darken(0.1, darkerGrey),
  comment: darkGrey,
  keyword: darken(0.05, green),
  string: darken(0.1, purple),
  variable: darken(0.1, red),
  tag: darken(0.1, green),
  entity: lightRed,
  operator: lighten(0.15, green),
  number: lighten(0.2, green),
  inserted: green,
  fn: green,
}

export interface CodeBlockColorScheme {
  background: string
  propAttr: string
  text: string
  comment: string
  keyword: string
  string: string
  variable: string
  tag: string
  entity: string
  operator: string
  number: string
  inserted: string
  fn: string
}

export interface CodeBlockProps extends React.ComponentProps<'pre'> {
  children: string
  language?: string
  colorScheme?: CodeBlockColorScheme
}

export function CodeBlock({
  children,
  language = 'javascript',
  colorScheme = lightColorScheme,
  ...rest
}: CodeBlockProps) {
  const html = useMemo(
    () => Prism.highlight(children, Prism.languages[language], language),
    [children, language],
  )

  return (
    <pre
      {...rest}
      css={[
        blockVerticalGutter,
        blockHorizontalGutter,
        css`
          background: ${colorScheme.background};
          border-radius: 5px;
          overflow: auto;
          padding: 0.5rem;

          &,
          & > code {
            color: ${colorScheme.text} !important;
            font-family: monospace;
            text-align: left;
            white-space: pre;
            word-spacing: normal;
            word-break: normal;
            word-wrap: normal;
            font-size: 14px;
            line-height: 1.3 !important;

            -moz-tab-size: 4;
            -o-tab-size: 4;
            tab-size: 4;

            -webkit-hyphens: none;
            -moz-hyphens: none;
            -ms-hyphens: none;
            hyphens: none;
          }

          > code {
            background-color: transparent;
          }

          .highlighted-line {
            background-color: rgba(255, 255, 255, 0.4);
            display: block;
            margin-right: -16px;
            margin-left: -16px;
            padding-right: 1em;
            padding-left: 0.75em;
            border-left: 3px solid ${colorScheme.entity};
          }

          .token.comment,
          .token.block-comment,
          .token.prolog,
          .token.doctype,
          .token.cdata {
            color: ${colorScheme.comment};
          }

          .token.punctuation {
            color: ${colorScheme.text};
          }

          .token.tag {
            color: ${colorScheme.tag};
          }

          .token.function-name {
            color: ${colorScheme.variable};
          }

          .token.boolean,
          .token.number {
            color: ${colorScheme.number};
          }

          .token.function {
            color: ${colorScheme.fn};
          }

          .token.namespace,
          .token.deleted,
          .token.attr-name,
          .token.property,
          .token.class-name,
          .token.constant,
          .token.symbol {
            color: ${colorScheme.propAttr};
          }

          .token.selector,
          .token.important,
          .token.atrule,
          .token.keyword,
          .token.builtin {
            color: ${colorScheme.keyword};
          }

          .token.string,
          .token.char,
          .token.attr-value,
          .token.regex {
            color: ${colorScheme.string};
          }

          .token.variable {
            color: ${colorScheme.variable};
          }

          .token.operator {
            color: ${colorScheme.operator};
          }

          .token.entity,
          .token.url {
            color: ${colorScheme.entity};
          }

          .token.important,
          .token.bold {
            font-weight: bold;
          }
          .token.italic {
            font-style: italic;
          }

          .token.entity {
            cursor: help;
          }

          .token.inserted {
            color: ${colorScheme.inserted};
          }
        `,
      ]}>
      <code
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </pre>
  )
}
