import { NextilRequest } from 'nextil'
import { Source, createState, fromPromise, selectDefault } from 'retil-source'
import { createMemo } from 'retil-support'
import { Client } from 'urql'

import { MemberProfileDocument } from 'src/generated/graphql'

export type MemberProfileSource = Source<MemberProfile | null | undefined>

const sourceMemo = createMemo<MemberProfileSource>()

export interface MemberProfile {
  id: string
  displayName: string
  avatarURL?: string | null
  handle?: string | null
}

export function getMemberProfileSource(
  request: NextilRequest,
  client: Client,
  memberId?: string | null,
): MemberProfileSource {
  if (!request.isRoutedPage) {
    return createState(null)[0]
  } else if (request.isSSR) {
    return createState(undefined)[0]
  } else {
    return sourceMemo(() => {
      if (!memberId) {
        return createState(memberId as null | undefined)[0]
      } else {
        const profilePromise = client
          .query(MemberProfileDocument, {
            memberId,
          })
          .toPromise()
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
        return selectDefault(fromPromise(profilePromise), undefined)
      }
    }, [client, memberId])
  }
}
