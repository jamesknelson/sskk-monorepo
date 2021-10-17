import { css } from '@emotion/react'
import { useRef, useState } from 'react'
import { Boundary } from 'retil-boundary'
import { ButtonSurface } from 'retil-interaction'

import {
  Editor,
  EditorHandle,
  EditorMenu,
  useEditorState,
} from 'src/components/editor'
import {
  OutlineButtonBody,
  RaisedButtonBody,
} from 'src/presentation/buttonBodies'
import { Card } from 'src/presentation/card'
import { structureColors } from 'src/presentation/colors'
import { barHeight } from 'src/presentation/dimensions'
import { FlexGap } from 'src/presentation/flexGap'
import { LetterMetaBlock } from 'src/presentation/letterMetaBlock'
import { ProgressPie } from 'src/presentation/progressPie'
import { standardRadius } from 'src/presentation/radii'
import { TextBlock } from 'src/presentation/blocks'
import { createEditorState, getTitle, isEmpty } from 'src/prose'

/**
 * This page should ask the user to write an introduction letter that will by
 * default be published to their persona page, and submitted to the front page.
 * If there are any changes, it'll confirm before allowing them to navigate
 * away, and it'll also offer a "save draft" button which pops up a window
 * asking them to register.
 */

// Members must write an introduction that passes spam detection, with at
// least 280 characters, before reserving a nametag.
// Show the new nametag next to the introduction, with an option to edit
// the nametag in a popup, showing any associated costs.
// Show a warning that we can't hold your name for you, so try and write
// the introduction quickly.

export const title = "You've taken the first step."
export const meta = {
  robots: 'noindex',
}

const minTextLength = 280

export function Page() {
  const editorHandleRef = useRef<EditorHandle | null>(null)

  const [editorState, setEditorState, applyEditorTransaction] = useEditorState(
    () => createEditorState(),
  )

  const [recipients, setRecipients] = useState([] as string[])

  const [lastSavedDoc, setLastSavedDoc] = useState(editorState.doc)

  const letterEmpty = isEmpty(editorState)
  const letterTitle = getTitle(editorState)

  const pieProportion = Math.min(
    1,
    editorState.doc.textContent.length / minTextLength,
  )

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        padding: 0.5rem;
      `}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}>
        <Card
          radius={`${standardRadius} ${standardRadius} 0 0`}
          css={css`
            overflow: hidden;
          `}>
          <div
            css={css`
              height: ${barHeight};

              display: flex;
              align-items: center;

              background-color: ${structureColors.wash};
              border-bottom: 1px solid ${structureColors.border};
              padding: 0 1.25rem;
            `}>
            <EditorMenu
              state={editorState}
              applyTransaction={applyEditorTransaction}
            />
            <FlexGap />
            <div
              css={css`
                display: flex;
                align-items: center;
              `}>
              <ButtonSurface>
                <OutlineButtonBody label="Save draft" />
              </ButtonSurface>
              <FlexGap size="0.5rem" />
              <ProgressPie proportion={pieProportion} size="2rem" />
              {/* <FlexGap size="0.5rem" /> */}
              {/* <ButtonSurface>
                <RaisedButtonBody label="Next" chevron="right" />
              </ButtonSurface> */}
            </div>
          </div>

          <div
            css={css`
              padding-bottom: 2rem;
            `}>
            <TextBlock>
              <Boundary fallback={<div />}>
                <Editor
                  state={editorState}
                  applyTransaction={applyEditorTransaction}
                  autoFocus
                  minHeight="80px"
                  ref={editorHandleRef}
                />
              </Boundary>
            </TextBlock>
          </div>
        </Card>
      </div>
    </div>
  )
}
