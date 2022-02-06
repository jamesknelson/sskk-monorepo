import { css } from '@emotion/react'

export interface DocumentFooterProps {
  githubEditURL?: string
}

export function DocumentFooter(props: DocumentFooterProps) {
  return (
    <footer
      css={({ color }) => css`
        border-top: 1px solid ${color.surfaceBorder};
        padding: 1rem;
        text-align: center;
      `}>
      {props.githubEditURL && (
        <a
          target="_new"
          href={props.githubEditURL}
          css={({ color }) => css`
            color: ${color.onSurface};
            text-decoration: underline;
          `}>
          Edit this page on GitHub
        </a>
      )}
    </footer>
  )
}
