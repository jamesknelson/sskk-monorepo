import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { textColors } from '../../presentation/colors'
import { blockHorizontalGutter } from './blockStyles'

export const TextBlock = styled.div(({ theme }) => [
  blockHorizontalGutter,
  css`
    position: relative;

    * {
      word-wrap: break-word;
      font-family: Karla;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      &,
      * {
        font-family: Karma;
      }
    }

    strong {
      font-weight: bold;
    }
    em {
      font-style: italic;
    }

    code {
      background: ${theme.color.wash};
      color: inherit;
      font-family: monospace;
      font-size: 95%;
      padding: 0.15em;
    }

    ol,
    ul {
      padding-left: 30px;
    }

    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    ul,
    ol,
    img,
    pre,
    hr,
    blockquote {
      font-size: 1rem;
      line-height: 1.5rem;
      margin: 1rem 0;
    }

    hr {
      left: 33% !important;
      margin: 1.5rem 1rem;
      position: relative;
      width: 33% !important;
      height: 1px;
      background-color: ${theme.color.border};
    }

    h1,
    h1 a,
    h2,
    h2 a {
      color: ${theme.color.primary[900]};
    }

    h1 {
      font-size: 2rem;
      line-height: 2.5rem;
      font-weight: 600;
    }
    h2 {
      line-height: 2rem;
      font-weight: 600;
      font-size: 1.5rem;
    }
    h3 {
      font-size: 22px;
      line-height: 2rem;
      font-weight: 600;
    }
    h4,
    h5,
    h6 {
      font-size: 20px;
      line-height: 1.5rem;
      font-weight: 600;
      margin-top: 1rem;
    }
    blockquote {
      position: relative;
      color: ${textColors.secondary};
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
      padding-left: 2rem;
      &::before {
        content: '“';
        position: absolute;
        left: 0;
        height: 100%;
        width: 1rem;
        font-size: 2rem;
        text-align: center;
        padding-top: 0.5rem;
        box-sizing: border-box;
      }

      > p {
        margin-left: 0 !important;
      }
    }
    p a,
    li a {
      color: ${textColors.link};
      text-decoration: underline;
    }
  `,
])
