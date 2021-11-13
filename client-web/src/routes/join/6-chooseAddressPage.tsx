import { css } from '@emotion/react'

import { createBackgroundScene } from 'src/components/web/background'
import { TextBlock } from 'src/components/web/block/textBlock'
import { Card } from 'src/components/web/card/card'
import { smallCardClampWidth } from 'src/style/dimensions'

export const title = "You've taken the first step."
export const meta = {
  robots: 'noindex',
}

export const backgroundScene = createBackgroundScene(async () => {
  const { default: Image } = await import(
    'src/assets/backgrounds/hot-air-balloon.optimized.svg?url'
  )

  return () => (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      `}>
      <img
        alt=""
        src={Image}
        css={css`
          position: absolute;
          bottom: 0;
          right: 12%;
          opacity: 0.1;
          z-index: 0;
          transform: scale3d(-1.5, 1.5, 1.5);
          transform-origin: center bottom;
        `}
      />
    </div>
  )
})

export function Page() {
  return (
    <div
      css={css`
        padding: 0 1rem;
      `}>
      <Card
        css={css`
          margin: 2rem auto;
          max-width: ${smallCardClampWidth};
          padding: 3rem 1.5rem 3rem;
        `}>
        <TextBlock
          css={css`
            text-align: center;
          `}>
          <h1>Can I have your number?</h1>
        </TextBlock>
        <hr />
      </Card>
    </div>
  )
}
