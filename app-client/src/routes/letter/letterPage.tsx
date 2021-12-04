// import React, { useMemo } from 'react'
import { css } from '@emotion/react'

// import { LetterCard } from 'src/components/letter'
// import { publicURL } from 'src/config'
// import { LetterFieldsFragment } from 'src/generated/graphql'
// import urls from 'src/pages/appURLs'
// import { createStateFromContentObject } from 'src/prose/contentObject'
// import { getTitle } from 'src/prose/getTitle'
// import { PrecachedQuery, usePrecachedQuery } from 'src/utils/precachedQuery'

export interface Props {
  // query: PrecachedQuery<{ letters: LetterFieldsFragment[] }>
}

export function Page(_props: Props) {
  // const { query } = props
  // const { data } = usePrecachedQuery(query)
  // const story = data.letters[0]
  // const profile = story.profile!
  // const editorState = useMemo(
  //   () => createStateFromContentObject(story.content),
  //   [story.content],
  // )
  // const publishedAt = new Date(story.published_at! + 'Z')
  // const isPublished = publishedAt <= new Date()
  // const title = getTitle(editorState)

  // const canonicalPath = urls.letter({
  //   profileNametag: profile.handle!,
  //   letterId: story.id,
  //   letterSlug: story.slug,
  // })
  // const canonicalURL = publicURL + canonicalPath

  return (
    <>
      {/* <Helmet>
        <title>
          {title || profile.display_name} &ndash; The Daily Paragraph
        </title>
        {isPublished && story.slug && (
          <link rel="canonical" href={canonicalURL} />
        )}
        {!isPublished && <meta name="robots" content="noindex" />}
      </Helmet> */}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          width: calc(100% - 1rem);
          margin: 0 auto;
        `}>
        {/* <LetterCard
          disableTitlePath
          editorState={editorState}
          profileAvatarURL={profile.avatar_url}
          profileDisplayName={profile.display_name}
          profileNametag={profile.handle!}
          profileId={profile.id}
          publishedAt={publishedAt}
          letterId={story.id}
          letterSlug={story.slug}
          titleAs="h1"
          css={css`
            margin: 2rem 1rem;
            width: 100%;
          `}
        /> */}
      </div>
    </>
  )
}
