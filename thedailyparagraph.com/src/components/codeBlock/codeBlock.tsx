import { darken, desaturate, lighten } from 'polished'
import React, { useMemo } from 'react'
import Prism from 'prismjs'
import styled from 'styled-components'

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

export const twoToneTheme: CodeBlockTheme = {
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

export const lightTheme: CodeBlockTheme = {
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

export interface CodeBlockTheme {
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

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children: string
  language?: string
  theme?: CodeBlockTheme
}

export function CodeBlock({
  children,
  language = 'javascript',
  theme = lightTheme,
  ...rest
}: CodeBlockProps) {
  const html = useMemo(
    () => Prism.highlight(children, Prism.languages[language], language),
    [children, language],
  )

  return (
    <StyledPre {...rest} codeTheme={theme}>
      <code
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </StyledPre>
  )
}

const theme = {
  background: ({ codeTheme }: { codeTheme: CodeBlockTheme }) =>
    codeTheme.background,
  propAttr: ({ codeTheme }: { codeTheme: CodeBlockTheme }) =>
    codeTheme.propAttr,
  text: ({ codeTheme }: { codeTheme: CodeBlockTheme }) => codeTheme.text,
  comment: ({ codeTheme }: { codeTheme: CodeBlockTheme }) => codeTheme.comment,
  keyword: ({ codeTheme }: { codeTheme: CodeBlockTheme }) => codeTheme.keyword,
  string: ({ codeTheme }: { codeTheme: CodeBlockTheme }) => codeTheme.string,
  variable: ({ codeTheme }: { codeTheme: CodeBlockTheme }) =>
    codeTheme.variable,
  tag: ({ codeTheme }: { codeTheme: CodeBlockTheme }) => codeTheme.tag,
  entity: ({ codeTheme }: { codeTheme: CodeBlockTheme }) => codeTheme.entity,
  operator: ({ codeTheme }: { codeTheme: CodeBlockTheme }) =>
    codeTheme.operator,
  number: ({ codeTheme }: { codeTheme: CodeBlockTheme }) => codeTheme.number,
  inserted: ({ codeTheme }: { codeTheme: CodeBlockTheme }) =>
    codeTheme.inserted,
  fn: ({ codeTheme }: { codeTheme: CodeBlockTheme }) => codeTheme.fn,
}

const StyledPre: any = styled.pre<{ codeTheme: CodeBlockTheme }>`
  background: ${theme.background};
  border-radius: 5px;
  margin: 0;
  overflow: auto;

  &,
  & > code {
    color: ${theme.text} !important;
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
    border-left: 3px solid ${theme.entity};
  }

  .token.comment,
  .token.block-comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: ${theme.comment};
  }

  .token.punctuation {
    color: ${theme.text};
  }

  .token.tag {
    color: ${theme.tag};
  }

  .token.function-name {
    color: ${theme.variable};
  }

  .token.boolean,
  .token.number {
    color: ${theme.number};
  }

  .token.function {
    color: ${theme.fn};
  }

  .token.namespace,
  .token.deleted,
  .token.attr-name,
  .token.property,
  .token.class-name,
  .token.constant,
  .token.symbol {
    color: ${theme.propAttr};
  }

  .token.selector,
  .token.important,
  .token.atrule,
  .token.keyword,
  .token.builtin {
    color: ${theme.keyword};
  }

  .token.string,
  .token.char,
  .token.attr-value,
  .token.regex {
    color: ${theme.string};
  }

  .token.variable {
    color: ${theme.variable};
  }

  .token.operator {
    color: ${theme.operator};
  }

  .token.entity,
  .token.url {
    color: ${theme.entity};
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
    color: ${theme.inserted};
  }
`
