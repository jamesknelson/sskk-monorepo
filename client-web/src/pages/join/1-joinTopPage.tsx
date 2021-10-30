import { css } from '@emotion/react'
import { LinkSurface } from 'retil-interaction'

import { createBackgroundScene } from 'src/components/background'
import appURLs from 'src/pages/appURLs'
import { Card } from 'src/presentation/card'
import { LetterMetaBlock } from 'src/presentation/letterMetaBlock'
import { TextBlock } from 'src/presentation/blocks'
import { RaisedButtonBody } from 'src/presentation/buttonBodies'

export const title = "You've just taken the first step."
export const meta = {}

export const backgroundScene = createBackgroundScene(async () => {
  const [{ default: MountainVillage }, { default: SailingShips }] =
    await Promise.all([
      import('src/assets/backgrounds/mountain-village.optimized.svg'),
      import('src/assets/backgrounds/sailing-ships.optimized.svg'),
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
      <MountainVillage
        css={css`
          position: absolute;
          bottom: 0;
          left: 0;
          opacity: 0.1;
          transform: scaleX(-1);
          z-index: 0;
        `}
      />
      <SailingShips
        css={css`
          position: absolute;
          bottom: 0;
          right: -50px;
          width: 100%;
          opacity: 0.1;
          transform: scaleX(-1);
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
            from={['@james (at Letterhouse)']}
            to={['The Reader']}
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
          <RaisedButtonBody label="Say hello" rightGlyph="chevron" />
        </LinkSurface>
      </div>
    </div>
  )
}
