import { css } from '@emotion/react'

export interface Props {}

export function Page(_props: Props) {
  return (
    <>
      <h1
        css={css`
          font-family: 'chomskyregular', sans-serif;
          font-size: 3.5rem;
          line-height: 3.5rem;
          text-align: center;
          margin: 1.5rem 1rem 3rem;
        `}>
        The Daily Letter
      </h1>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          width: calc(100% - 1rem);
          margin: 0 auto;
        `}>
        Read
      </div>
    </>
  )
}
