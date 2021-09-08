import styled from '@emotion/styled'

import { StyledCodeBlock } from 'src/components/codeBlock'
import { colors, media } from 'src/theme'

export const TextContent = styled.div`
  position: relative;

  * {
    word-wrap: break-word;
  }

  strong {
    font-weight: bold;
  }
  em {
    font-style: italic;
  }

  code {
    background: ${colors.structure.wash};
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

    margin: 1rem 1rem 1rem;
    ${media.tabletPlus`
      margin: 1rem 2rem 1rem;      
    `}
  }

  hr {
    left: 33% !important;
    margin: 1.5rem 1rem;
    ${media.tabletPlus`
      margin: 1.5rem 1rem; 
    `}
    position: relative;
    width: 33% !important;
    height: 1px;
    background-color: ${colors.structure.border};
  }

  ${StyledCodeBlock} {
    margin: 1rem 0.5rem;
    padding: 0.5rem;
    ${media.tabletPlus`
      margin: 1rem;
      padding: 0.5rem 1rem;
    `}
  }

  h1,
  h1 a,
  h2,
  h2 a {
    color: ${colors.ink.black};
  }

  h1 {
    font-size: 1.5rem;
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
    color: ${colors.text.secondary};
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
    color: ${colors.text.link};
    text-decoration: underline;
  }
`
