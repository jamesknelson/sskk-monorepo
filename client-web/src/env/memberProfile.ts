import { HydrationEnv } from 'retil-hydration'
import { Source, createState, fromPromise } from 'retil-source'
import { createMemo } from 'retil-support'

import { MemberProfileDocument } from 'src/generated/graphql'

import type { AppApolloClient } from './appEnv'

export type MemberProfileSource = Source<MemberProfile | null | undefined>

const sourceMemo = createMemo<MemberProfileSource>()

export interface MemberProfile {
  id: string
  displayName: string
  avatarURL?: string | null
  handle?: string | null
}

export function getMemberProfileSource(
  request: HydrationEnv,
  client: AppApolloClient,
  memberId?: string | null,
): MemberProfileSource {
  if (request.hydrating !== false) {
    return createState(undefined)[0]
  } else {
    return sourceMemo(() => {
      if (!memberId) {
        return createState(memberId as null | undefined)[0]
      } else {
        const profilePromise = client
          .query({
            query: MemberProfileDocument,
            variables: {
              memberId,
            },
            context: {
              role: 'member',
            },
          })
          .then(({ data }) => {
            const profile = data?.member?.profile
            return (
              profile && {
                id: profile.id,
                displayName: profile.display_name,
                avatarURL: profile.avatar_url,
                handle: profile.handle,
              }
            )
          })
        return fromPromise(profilePromise)
      }
    }, [client, memberId])
  }
}
