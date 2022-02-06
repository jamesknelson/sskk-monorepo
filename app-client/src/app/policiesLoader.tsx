import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Card } from 'lib-ui-web/component/card'

const P = styled.p(
  ({ theme }) => css`
    color: ${theme.color.onSurface};
    opacity: ${theme.opacity.alt};
    line-height: 1.4rem;
    margin-top: 1.5rem;
    text-align: center;
  `,
)

export const Title = styled.h1(
  ({ theme }) => css`
    color: ${theme.color.onSurface};
    font-size: 2rem;
    font-weight: 400;
    margin-top: 4rem;
    margin-bottom: 0.5rem;
    text-align: center;
  `,
)

function LegalPage() {
  return (
    <div
      css={css`
        padding: 0 1rem;
      `}>
      <div
        css={css`
          margin: 0 auto 2rem;
        `}>
        <Card
          css={css`
            padding: 0 0 4rem;
          `}>
          <Title>Policies and Terms</Title>

          <P>
            Your data is yours.
            <br />
            We will not sell your data.
            <br />
            Not to anyone.
          </P>

          <P>
            Don’t be an asshole.
            <br />
            Treat others with respect.
            <br />
            It’s a public space.
          </P>

          <P>
            We’re just a small team.
            <br />
            Anything could happen so
            <br />
            Sorry. Deal with it.
          </P>

          {/* <P>
            There is one thing though.
            <br />
            Advertisements are bullshit.
            <br />
            We’ll never show them.
          </P>

          <P>
            So please join a plan.
            <br />
            To support our adventure.
            <br />
            Or it may vanish.
          </P> */}
        </Card>
      </div>
    </div>
  )
}

const loader = () => <LegalPage />

export default loader
