import type React from 'react'
import { Loader, LoaderProps, loadAsync } from 'retil-mount'
import { joinPathnames, loadMatch } from 'retil-nav'

import { BackgroundScene } from 'src/components/background'
import { AppEnv } from 'src/env'
import { CreateHeadTagsInput, createHeadTags } from 'src/utils/createHeadTags'
import { patternFor } from 'src/utils/urls'

import { JoinPath, JoinProvider } from './joinContext'
import Layout from './joinLayout'
import urls from './joinURLs'

interface JoinEnv extends AppEnv {
  joinMountPath: string
}

const joinMatchLoader = loadMatch<JoinEnv>({
  // The top level loader is synchronous, so that it can be immediately
  // displayed when the user clicks through to the join flow, while
  // subsequent loaders are
  [patternFor(urls.top)]: loadStep(async (env) => {
    const pageModule = await import('./1-joinTopPage')

    env.nav.precache(
      joinPathnames(env.joinMountPath, urls.writeIntroLetter().pathname),
    )

    return {
      mod: pageModule,
      path: 'top',
    }
  }),

  [patternFor(urls.writeIntroLetter)]: loadStep(async (env) => {
    // TODO:
    // - show loading page before while hydrating
    // - if the user is logged in, read anything saved server-side,
    //   comparing the version with something in sessionStorage, and
    //   using whichever one is newer.

    const pageModule = await import('./2-writeIntroLetterPage')

    env.nav.precache(
      joinPathnames(env.joinMountPath, urls.createAccount().pathname),
    )

    return {
      mod: pageModule,
      path: 'writeIntroLetter',
    }
  }),

  [patternFor(urls.createAccount)]: loadStep(async (env) => {
    const pageModule = await import('./3-createAccountPage')

    // env.nav.precache(
    //   joinPathnames(env.joinMountPath, urls.selectMembershipType().pathname),
    // )

    return {
      mod: pageModule,
      path: 'createAccount',
    }
  }),
})

type LoadJoinStep = (env: LoaderProps<JoinEnv>) => Promise<{
  mod: CreateHeadTagsInput & {
    backgroundScene: BackgroundScene
    Page: React.ComponentType
  }
  path: JoinPath
}>

function loadStep(loadJoinStep: LoadJoinStep): Loader<JoinEnv> {
  return loadAsync(async (env) => {
    const { mod, path } = await loadJoinStep(env)

    env.head.push(...createHeadTags(mod))
    env.mutablePersistedContext.transitionKey = '/join'

    mod.backgroundScene.load()

    return (
      <JoinProvider mountPath={env.joinMountPath} path={path}>
        <Layout backgroundScene={mod.backgroundScene} transitionKey={path}>
          <mod.Page />
        </Layout>
      </JoinProvider>
    )
  })
}

export default function joinLoader(props: LoaderProps<AppEnv>) {
  return joinMatchLoader({
    ...props,
    joinMountPath: props.nav.matchname,
    mount: {
      ...props.mount,
      env: {
        ...props.mount.env,
        joinMountPath: props.nav.matchname,
      },
    },
  })
}
