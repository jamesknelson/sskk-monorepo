import * as React from 'react'
import styled, { css } from 'styled-components'

import { LargeCardLayout } from 'src/components/largeCardLayout'
import { colors } from 'src/theme'

const P = styled.p`
  color: ${colors.text.secondary};
  line-height: 1.4rem;
  margin-top: 1.5rem;
  text-align: center;
`

function LegalPage() {
  return (
    <LargeCardLayout
      title="Policies and Terms"
      css={css`
        margin-top: 2rem;
      `}>
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
    </LargeCardLayout>
  )
}

export const router = () => <LegalPage />
