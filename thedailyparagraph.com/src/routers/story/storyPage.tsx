import Head from 'next/head'
import React, { useMemo } from 'react'
import { css } from 'styled-components'

import { StoryCard } from 'src/components/story'
import { publicURL } from 'src/config'
import { createStateFromContentObject } from 'src/prose/contentObject'
import { getTitle } from 'src/prose/getTitle'
import { StoryFieldsFragment } from 'src/generated/graphql'
import { dimensions } from 'src/theme'
import { PrecachedQuery, usePrecachedQuery } from 'src/utils/graphql'
import { getStoryPath } from 'src/utils/routing'

export interface Props {
  query: PrecachedQuery<{ stories: StoryFieldsFragment[] }>
}

export function Page(props: Props) {
  const { query } = props
  const { data } = usePrecachedQuery(query)
  const story = data.stories[0]
  const profile = story.profile!
  const editorState = useMemo(
    () => createStateFromContentObject(story.content),
    [story.content],
  )
  const publishedAt = new Date(story.published_at! + 'Z')
  const isPublished = publishedAt <= new Date()
  const title = getTitle(editorState)

  const canonicalPath = getStoryPath({
    profileId: profile.id,
    profileHandle: profile.handle,
    publishedAt,
    storyId: story.id,
    storySlug: story.slug,
  })
  const canonicalURL = publicURL + canonicalPath

  return (
    <>
      <Head>
        <title>
          {title || profile.display_name} &ndash; The Daily Paragraph
        </title>
        {isPublished && story.slug && (
          <link rel="canonical" href={canonicalURL} />
        )}
        {!isPublished && <meta name="robots" content="noindex" />}
      </Head>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: ${dimensions.largeCardWidth};
          width: calc(100% - 1rem);
          margin: 0 auto;
        `}>
        <StoryCard
          disableTitlePath
          editorState={editorState}
          profileAvatarURL={profile.avatar_url}
          profileDisplayName={profile.display_name}
          profileHandle={profile.handle!}
          profileId={profile.id}
          publishedAt={publishedAt}
          storyId={story.id}
          storySlug={story.slug}
          titleAs="h1"
          css={css`
            margin: 2rem 1rem;
            width: 100%;
          `}
        />
      </div>
    </>
  )
}
