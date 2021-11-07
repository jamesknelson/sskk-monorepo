import { loadAsync } from 'retil-mount'
import { loadMatch, loadRedirect } from 'retil-nav'
import { AppEnv } from 'src/env'

import { loadAuthenticated } from 'src/env/routing'
// import {
//   DashboardPostListDocument,
//   DashboardPostEditorDocument,
// } from 'src/generated/graphql'
import { /*decodeUUID, */ patternFor } from 'src/utils/urls'

import urls, { EditorLetterParams } from './editorURLs'

const loader = loadAuthenticated(
  loadMatch<AppEnv>({
    '/': loadRedirect(urls.drafts()),
    [patternFor(urls.drafts)]: loadAsync(async (_env) => {
      const pageModulePromise = import('./dashboardPostListPage')
      // const query = await env.precacheQuery(
      //   DashboardPostListDocument,
      //   {
      //     profile_id: env.profile!.id,
      //   },
      //   'editor',
      // )

      const { Page } = await pageModulePromise

      return <Page />
    }),
    [patternFor(urls.new)]: loadAsync(async (_env) => {
      const pageModulePromise = import('./dashboardPostEditorPage')
      // const query = await env.precacheQuery(
      //   DashboardPostEditorDocument,
      //   {
      //     is_new: true,
      //   },
      //   'editor',
      // )

      const { Page } = await pageModulePromise

      return <Page />
    }),
    [patternFor(urls.letter)]: loadAsync<AppEnv<EditorLetterParams>>(
      async (_env) => {
        // let storyId: string
        // try {
        //   storyId = decodeUUID(env.nav.params.letterId)
        // } catch (error) {
        //   return notFoundLoader(env)
        // }

        const pageModulePromise = import('./dashboardPostEditorPage')
        // const query = await env.precacheQuery(
        //   DashboardPostEditorDocument,
        //   {
        //     post_id: storyId as string,
        //   },
        //   'editor',
        // )

        // if (!query.data.post) {
        //   return notFoundLoader(env)
        // }

        const { Page } = await pageModulePromise

        return <Page />
      },
    ),
  }),
)

export default loader
