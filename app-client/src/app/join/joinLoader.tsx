import type React from 'react'
import { LoaderProps, loadAsync } from 'retil-mount'
import { joinPathnames, loadMatch } from 'retil-nav'
import { patternFor } from 'retil-nav-scheme'
import { createMemo } from 'retil-support'

import { BackgroundScene } from 'lib-ui-web/component/background'

import { LoadingPage } from '~/app/loadingPage'
import { Env } from '~/env'
import { CreateHeadTagsInput, createHeadTags } from '~/head'

import { JoinPath, JoinProvider } from './joinContext'
import Layout from './joinLayout'
import { JoinPersistence, createJoinPersistence } from './joinPersistence'
import urls from './joinScheme'

interface JoinOwnEnv {
  join: {
    persistence: JoinPersistence
    mountPath: string
  }
}

interface JoinEnv extends Env, JoinOwnEnv {}

const joinMatchLoader = loadMatch<JoinEnv>({
  // The top level loader is synchronous, so that it can be immediately
  // displayed when the user clicks through to the join flow, while
  // subsequent loaders are
  [patternFor(urls.top)]: loadAsync(async (env) => {
    const pageModule = await import('./1-joinTopPage')

    // env.nav.precache(
    //   joinPathnames(env.join.mountPath, urls.writeIntroLetter().pathname),
    // )

    return loadJoinStep({
      env,
      mod: pageModule,
      path: 'top',
    })
  }),

  [patternFor(urls.writeIntroLetter)]: loadAsync(async (env) => {
    const pageModule = await import('./2-writeIntroLetterPage')

    // env.nav.precache(
    //   joinPathnames(env.join.mountPath, urls.createAccount().pathname),
    // )

    return loadJoinStep({
      env,
      mod: pageModule,
      path: 'writeIntroLetter',
    })
  }),

  [patternFor(urls.createAccount)]: loadAsync(async (env) => {
    const pageModule = await import('./3-createAccountPage')

    // env.nav.precache(
    //   joinPathnames(env.join.mountPath, urls.selectMembershipType().pathname),
    // )

    return loadJoinStep({
      env,
      mod: pageModule,
      path: 'createAccount',
    })
  }),

  [patternFor(urls.chooseAddress)]: loadAsync(async (env) => {
    const pageModule = await import('./6-chooseAddressPage')

    // env.nav.precache(
    //   joinPathnames(env.join.mountPath, urls.selectMembershipType().pathname),
    // )

    return loadJoinStep({
      env,
      mod: pageModule,
      path: 'chooseAddress',
    })
  }),
})

interface LoadJoinStepProps {
  env: JoinEnv
  mod: CreateHeadTagsInput & {
    backgroundScene: BackgroundScene
    Page: React.ComponentType
  }
  path: JoinPath
}

function loadJoinStep(props: LoadJoinStepProps): React.ReactNode {
  const { env, mod, path } = props

  env.head.push(...createHeadTags(mod))
  env.mutablePersistedContext.appLayoutTransitionKey = '/join'

  mod.backgroundScene.load()

  console.log(path, env.mutablePersistedContext)

  return (
    <JoinProvider
      mountPath={env.join.mountPath}
      path={path}
      persistence={env.join.persistence}>
      <Layout backgroundScene={mod.backgroundScene} transitionKey={path}>
        <mod.Page />
      </Layout>
    </JoinProvider>
  )
}

const joinPersistenceMemo = createMemo<Promise<JoinPersistence>>()

export default loadAsync(async function joinLoader(props: LoaderProps<Env>) {
  if (!props.hasHydrated) {
    return <LoadingPage />
  }

  const client = props.client
  const customerId = props.customerIdentity?.id

  const joinOwnEnv: JoinOwnEnv = {
    join: {
      persistence: await joinPersistenceMemo(
        () => createJoinPersistence(client, customerId),
        [client, customerId],
      ),
      mountPath: props.nav.matchname,
    },
  }

  return joinMatchLoader({
    ...props,
    ...joinOwnEnv,
    mount: {
      ...props.mount,
      env: {
        ...props.mount.env,
        ...joinOwnEnv,
      },
    },
  })
})
