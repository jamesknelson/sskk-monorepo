import { css } from '@emotion/react'
import { LinkSurface } from 'retil-interaction'

import { createBackgroundScene } from 'src/components/web/background'
import { LetterMetaBlock } from 'src/components/web/block/letterMetaBlock'
import { TextBlock } from 'src/components/web/block/textBlock'
import { RaisedLabelledButtonBody } from 'src/components/web/button/raisedLabelledButtonBody'
import appURLs from 'src/routes/appURLs'
import { Card } from 'src/components/web/card/card'

export const title = "You've just taken the first step."
export const meta = {}

export const backgroundScene = createBackgroundScene(async () => {
  const [{ default: MountainVillage }, { default: SailingShips }] =
    await Promise.all([
      import('src/assets/backgrounds/mountain-village.optimized.svg?url'),
      import('src/assets/backgrounds/sailing-ships.optimized.svg?url'),
    ])

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
        src={MountainVillage}
        css={css`
          position: absolute;
          bottom: 0;
          left: -25%;
          opacity: 0.1;
          width: 100%;
          transform: scaleX(-0.5) scaleY(0.5);
          transform-origin: bottom;
          z-index: 0;
        `}
      />
      <img
        alt=""
        src={SailingShips}
        css={css`
          position: absolute;
          bottom: 0;
          right: calc(-50px - 25%);
          width: 100%;
          opacity: 0.1;
          transform: scaleX(-0.5) scaleY(0.5);
          transform-origin: bottom;
          z-index: 0;
        `}
      />
    </div>
  )
})

export function Page() {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
      `}>
      <Card radius={0}>
        <div
          css={css`
            padding: 2rem 0;
          `}>
          <LetterMetaBlock
            title={title}
            from={[
              {
                type: 'member',
                handle: 'jkn',
                name: 'James K Nelson (at Letterhouse)',
              },
            ]}
            to={[{ type: 'placeholder', label: 'The Reader' }]}
          />
          <TextBlock>
            <p>
              Letterhouse is a letter-writing community, and that means that its
              members write letters. Whether they be short letters or long
              letters, silly letters or profound letters, letters to self,
              letters to the public, letters to the editor or letters to friends
              — the thing that unites letterhouse members is that we're letter
              writers.
            </p>
            <p>
              We're excited that you've shown interest in joining our
              letterhouse community. But before asking for your email or account
              details, there's one thing that we ask of you.
            </p>
            <p>
              We ask you to write a hello letter to the readers of letterhouse.
            </p>
            <p>
              But what should you write? That is totally up to you! It could be
              a quick hello, a detailed story of how you got to this page,
              something that's on your mind, or anything else that strikes your
              fancy. The only rule is that it must have <em>at least</em> 280
              characters.
            </p>
            <p>Whatever you decide to write, I can't wait to read it!</p>
          </TextBlock>
        </div>
      </Card>
      <div
        css={css`
          display: flex;
          justify-content: center;
          margin: 1.5rem 0 1rem;
        `}>
        <LinkSurface href={appURLs.join.writeIntroLetter()}>
          <RaisedLabelledButtonBody label="Say hello" rightGlyph="chevron" />
        </LinkSurface>
      </div>
    </div>
  )
}
