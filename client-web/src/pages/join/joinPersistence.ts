import { ApolloClient } from '@apollo/client'
import throttle from 'lodash/throttle'
import { NavController } from 'retil-nav'
import { areShallowEqual, Deferred } from 'retil-support'
import {
  unstable_scheduleCallback as scheduleCallback,
  unstable_LowPriority as LowPriority,
} from 'scheduler'

import * as roles from 'src/constants/roles'
import { joinPersistenceStorageKey } from 'src/constants/storageKeys'
import {
  GetPersistedOnboardingDataDocument,
  PersistOnboardingDataDocument,
} from 'src/generated/graphql'

// Data will be persisted a maximum of once over this time period.
const persistenceThrottleMilliseconds = 5000

export interface JoinPersistableData {
  id?: string | null

  address_handle?: string | null
  address_type?: string | null

  introduction_letter_date?: Date | null
  introduction_letter_editor_state?: any | null
  introduction_letter_extra_recipients?: any[] | null
  introduction_letter_time?: string | null
  introduction_letter_url_slug?: string | null

  persona_name?: string | null
  persona_photo_url?: string | null

  skip_onboarding_redirect_on_login?: boolean | null

  updated_at?: string | null
}

export interface JoinPersistence {
  block(mountPath: string, navController: NavController): () => void

  get(): JoinPersistableData

  save(
    persistableData: JoinPersistableData,
    options?: { immediate?: boolean },
  ): void
}

export async function createJoinPersistence(
  client: ApolloClient<any>,
  customerId?: string | null,
): Promise<JoinPersistence> {
  console.log('create persistence')

  const clearSession = () => {
    try {
      sessionStorage.removeItem(joinPersistenceStorageKey)
    } catch {}
  }

  // If we know who the customer is, read in data from server before returning
  let serverData: JoinPersistableData | null = null

  if (typeof customerId === 'string') {
    const result = await client.query({
      fetchPolicy: 'cache-first',
      query: GetPersistedOnboardingDataDocument,
      variables: {
        customer_id: customerId,
      },
      context: {
        role: roles.customer,
      },
    })

    if (!result.errors && !result.error) {
      serverData = result.data.customer_onboardings_by_pk || null
    }
  }

  let sessionData: JoinPersistableData | null = null
  try {
    const data = JSON.parse(sessionStorage.getItem(joinPersistenceStorageKey)!)
    if (data?.id && data?.id !== customerId) {
      clearSession()
    } else if (data) {
      sessionData = data
    }
  } catch {}

  const datas = [sessionData, serverData]
  const dataDates = datas.map((data) =>
    new Date(data?.updated_at! || 0).getTime(),
  )
  const latestDataIndex = dataDates.indexOf(Math.max(...dataDates))

  let latestPersistedData: JoinPersistableData = datas[latestDataIndex] || {}
  let latestData = latestPersistedData
  let currentTask: null | Promise<void>

  const get = (): JoinPersistableData => latestData

  function persistToSessionStorage(data: JoinPersistableData) {
    try {
      sessionStorage.setItem(joinPersistenceStorageKey, JSON.stringify(data))
      return true
    } catch {
      return false
    }
  }

  async function persist() {
    if (latestData === latestPersistedData) {
      return
    }

    if (currentTask) {
      // Persistence tasks are taking longer than our throttle time, so skip
      // this slot and re-schedule for the next one.
      await currentTask
      return schedulePersist()
    }

    const dataToPersist = latestData
    const deferred = new Deferred<void>()

    currentTask = deferred.promise

    let failed = !persistToSessionStorage(dataToPersist)

    try {
      if (dataToPersist.id) {
        const { id, __typename, ...dataVariable } = dataToPersist as any
        deleteKeysWithFalsyValues(dataVariable)
        const result = await client.mutate({
          mutation: PersistOnboardingDataDocument,
          context: {
            role: roles.customer,
          },
          variables: {
            data: dataVariable,
          },
        })
        failed = !result.errors
      }
    } catch (error) {
      failed = true
    }

    if (!failed) {
      latestPersistedData = dataToPersist
    }

    if (currentTask === deferred.promise) {
      currentTask = null
    }

    deferred.resolve()
  }
  // Throttle calls to persist and schedule them with low priority, in an
  // attempt to stop them from blocking the UI.
  const throttledPersist = throttle(persist, persistenceThrottleMilliseconds, {
    leading: false,
    trailing: true,
  })
  const schedulePersist = () => {
    scheduleCallback(LowPriority, () => {
      throttledPersist()
    })
  }

  const save = (
    mergeData: JoinPersistableData,
    options: { immediate?: boolean } = {},
  ) => {
    const data = {
      ...latestData,
      ...mergeData,
      id: customerId,
    }

    if (!areShallowEqual(data, latestData)) {
      latestData = {
        ...data,
        updated_at: new Date().toISOString(),
      }

      if (options.immediate) {
        persist()
      } else {
        schedulePersist()
      }
    }
  }

  const block = (mountPath: string, navController: NavController) => {
    return navController.block((navigation) => {
      // When closing the tab, instead of blocking, just immediately save the
      // latest data to session storage – so that the data will be there if
      // the customer re-opens the tab.
      if (!navigation) {
        return !persistToSessionStorage(latestData)
      }

      // Don't block if there's no interesting data to persist
      const data = { ...latestData, updated_at: null, id: null }
      deleteKeysWithFalsyValues(data)
      if (latestData === latestPersistedData || !Object.keys(data).length) {
        return false
      }

      // Don't block if we're navigating within the onboarding system, or if
      // we know who the customer is. Instead, flush any throttled saves.
      if (customerId || navigation?.pathname.startsWith(mountPath)) {
        throttledPersist.flush()
        return false
      }

      const leave = window.confirm(
        'You have unsaved changes. Would you like to discard them?',
      )
      if (leave) {
        clearSession()
      }
      return !leave
    })
  }

  return {
    block,
    get,
    save,
  }
}

function deleteKeysWithFalsyValues(object: Record<string, any>) {
  Object.keys(object).forEach((k) => !object[k] && delete object[k])
}
