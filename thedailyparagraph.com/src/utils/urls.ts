import { NavAction, NavLocation, NavParams } from 'retil-nav'
import { parse as parseUUID, stringify as stringifyUUID } from 'uuid'

import { LetterParams, LetterQuery } from 'src/pages/letter/letterURLs'
import { ProfileParams } from 'src/pages/profile/profileURLs'

const editorURLs = urlSchema({
  dashboard: () => `/dashboard`,

  drafts: () => `/drafts`,

  letter: (params: { letterId: string }) => `/~${params.letterId}`,

  published: () => `/published`,
})

editorURLs.dashboard()
patternFor(editorURLs.dashboard)
editorURLs.letter({ letterId: 'test' })
patternFor(editorURLs.letter)

const joinURLs = urlSchema({
  // To start, ask for an email/password. Explain that you can't login with
  // Google or Facebook, as we value their privacy.
  createAccount: () => `/`,

  // Show the costs involved with the nametag, but do not ask for billing
  // information immediately.
  // Free nametags end with 4 random numbers, and the preceeding characters
  // or any combination of them with a subset of the 4 trailing numbers,
  // cannot match any existing paid handles.
  createNametag: () => `/create-nametag`,

  // Members must write an introduction that passes spam detection, with at
  // least 280 characters, before reserving a nametag.
  // Show the new nametag next to the introduction, with an option to edit
  // the nametag in a popup, showing any associated costs.
  writeIntroduction: () => `/write-introduction`,

  // Conditionally shown if the user has picked a paid membership. Charges
  // for 1 year of posting under this nametag, and reserves the name for 4
  // years after that.
  purchaseMembership: () => `/purchase-membership`,

  thankyou: () => `/thankyou`,
})

const profileURLs = urlSchema({
  /**
   * A full list of all the member's publications
   */
  publishedLetters: () => `/publications`,

  /**
   * By default, the member's landing page will just contain the user's
   * introduction except at the top, and a list of recently excerpts of
   * recently published letters *excluding* the introduction – although
   * at some point, it'll be possible for the user to edit this while
   * keeping the introduction the same.
   */
  top: () => `/`,
})

const readURLs = urlSchema({
  feed: () => `/`,
  inbox: () => `/inbox`,
})

const settingsURLs = urlSchema({
  changeEmail: () => `/change-email`,
  changePassword: () => `/change-password`,

  // Includes nametag and billing details
  membership: () => `/membership`,
})

export const urls = urlSchema({
  editor: nestURLSchema('/editor', editorURLs),

  hello: () => `/hello`,

  join: nestURLSchema('/join', joinURLs),

  /**
   * Shows a letter on a page without the selection bar. On mobile, links from
   * the selection bar will use this route with a `from` param, while on a
   * two-column layout, double clicking in the selection bar will cause this
   * link to be used – and should also cause the selection bar to be animated
   * out.
   */
  letter: ({
    profileNametag,
    letterId,
    letterSlug,
    ...query
  }: LetterParams & LetterQuery) => ({
    query: { ...query },
    pathname: `/${profileNametag}/${letterSlug || ''}~${encodeUUID(letterId)}`,
  }),

  login: () => `/login`,
  logout: () => `/logout`,

  policies: () => `/policies`,

  profile: nestURLSchema(
    (profileParams: ProfileParams) => `/${profileParams.nametag}`,
    profileURLs,
  ),

  read: nestURLSchema('/read', readURLs),

  recoverAccount: () => `/recover-account`,

  settings: nestURLSchema('/settings', settingsURLs),
})

urls.editor.dashboard()

urls.profile.publishedLetters({ nametag: 'test' })

patternFor(urls.letter, {
  optional: ['letterSlug'],
})

patternFor(urls.profile.publishedLetters, {
  optional: ['nametag'],
})

patternFor(urls.editor.letter, {
  optional: ['letterId'],
})

patternFor(urls.editor)

// ---

type URLConfig<TParams extends NavParams = NavParams> =
  // https://stackoverflow.com/questions/52667959/what-is-the-purpose-of-bivariancehack-in-typescript-types
  { bivarianceHack(instance: TParams): NavAction }['bivarianceHack']

type URLSchemaConfig = {
  [name: string]: URLSchema | URLConfig
}

type URLSchema = {
  [name: string]: URLSchema | URLSchemaLeaf<any>
}

type URLSchemaLeaf<TParams extends NavParams = {}> = {} extends TParams
  ? (params?: URLSchemaEmptyParams) => NavLocation
  : (params: TParams) => NavLocation

type URLNestableSchemaLeaf<TParams extends NavParams = NavParams> =
  | { bivarianceHack(instance?: TParams): NavLocation }['bivarianceHack']

type URLNestableSchema = {
  [name: string]: URLSchema | URLNestableSchemaLeaf
}

type URLNestedSchemaAndLeaf<
  TSchema extends URLNestableSchema,
  TParams extends NavParams = {},
> = URLSchemaLeaf<TParams> & URLNestedSchema<TSchema, TParams>

type URLNestedSchema<
  TSchema extends URLNestableSchema,
  TParams extends NavParams = {},
> = {} extends TParams ? TSchema : NestedURLSchema<TSchema, TParams>

/**
 * As TypeScript allows anything to be assigned to {}, for routes which don't
 * take any params, we'll use this object instead.
 */
type URLSchemaEmptyParams = {
  never?: never
}

// ---

type URLSchemaFromConfig<TConfig extends URLSchemaConfig> = {
  [Key in Extract<
    keyof TConfig,
    string
  >]: TConfig[Key] extends URLNestedSchemaAndLeaf<infer ISchema, infer IParams>
    ? URLNestedSchemaAndLeaf<ISchema, IParams>
    : TConfig[Key] extends URLConfig<any>
    ? URLSchemaLeafFromConfig<TConfig[Key]>
    : TConfig[Key]
}

type URLSchemaLeafFromConfig<TConfig extends URLConfig<any>> =
  TConfig extends () => NavAction
    ? (params?: URLSchemaEmptyParams) => NavLocation
    : TConfig extends (params: infer IParams) => NavAction
    ? (params: IParams) => NavLocation
    : never

// ---

type NestedURLSchema<
  TSchema extends URLSchema,
  TParams extends NavParams = {},
> = {
  [Key in Extract<keyof TSchema, string>]: TSchema[Key] extends URLSchema
    ? NestedURLSchema<TSchema[Key], TParams>
    : TSchema[Key] extends (params?: URLSchemaEmptyParams) => NavAction
    ? (params: TParams) => NavLocation
    : TSchema[Key] extends (params: infer IRequiredKeyParams) => NavAction
    ? (params: IRequiredKeyParams & TParams) => NavLocation
    : TSchema[Key] extends () => NavLocation
    ? (params: TParams) => NavAction
    : never
}

// ---

export function urlSchema<TConfig extends URLSchemaConfig>(
  config: TConfig,
): URLSchemaFromConfig<TConfig> {
  return undefined as any
}

// take a schema node and return a new schema node, w/ a .pattern fn on it
export function nestURLSchema<
  TSchema extends URLNestableSchema,
  TParams extends NavParams = {},
>(
  root: string | URLConfig<TParams>,
  schema: TSchema,
): URLNestedSchemaAndLeaf<TSchema, TParams> {
  return undefined as any
}

export function patternFor<TParams extends NavParams>(
  url:
    | ((params?: URLSchemaEmptyParams) => NavLocation)
    | ((params: TParams) => NavLocation),
  options: {
    optional?: (keyof TParams)[]
  } = {},
): string {
  return undefined as any
}

// Copied wholesale from: https://www.npmjs.com/package/d64
// Used under MIT license
// Changes the "." character to "~" for purposes of shareability (the "."
// at the end of a URL is often not treated as part of the URL).
const chars = '~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
const codeToIndex = new Uint8Array(128)
for (let i = 0; i < 64; i++) {
  const code = chars.charCodeAt(i)
  codeToIndex[code] = i
}

// Alias "." to "~", as previous the "." character was used in place of it.
codeToIndex['.'.charCodeAt(0)] = codeToIndex['~'.charCodeAt(0)]

function encode(data: ArrayLike<number>): string {
  let s = '',
    l = data.length,
    hang = 0
  for (let i = 0; i < l; i++) {
    const v = data[i]

    switch (i % 3) {
      case 0:
        s += chars[v >> 2]
        hang = (v & 3) << 4
        break
      case 1:
        s += chars[hang | (v >> 4)]
        hang = (v & 0xf) << 2
        break
      case 2:
        s += chars[hang | (v >> 6)]
        s += chars[v & 0x3f]
        hang = 0
        break
    }
  }
  if (l % 3) s += chars[hang]
  return s
}

function decode(str: string): ArrayLike<number> {
  let l = str.length
  let j = 0
  let b = new Uint8Array(~~((l / 4) * 3))
  let hang = 0

  for (let i = 0; i < l; i++) {
    const v = codeToIndex[str.charCodeAt(i)]

    switch (i % 4) {
      case 0:
        hang = v << 2
        break
      case 1:
        b[j++] = hang | (v >> 4)
        hang = (v << 4) & 0xff
        break
      case 2:
        b[j++] = hang | (v >> 2)
        hang = (v << 6) & 0xff
        break
      case 3:
        b[j++] = hang | v
        break
    }
  }
  return b
}

export function encodeUUID(uuid: string): string {
  // Pass through anything starting with ':' so that we can use our URL
  // generation functions to generate patterns
  if (uuid[0] === ':') {
    return uuid
  }

  const bytes = parseUUID(uuid)
  return encode(bytes)
}

export function decodeUUID(maybeEncodedUUID: string): string {
  if (maybeEncodedUUID.length === 36) {
    return maybeEncodedUUID
  }

  const bytes = decode(maybeEncodedUUID)
  return stringifyUUID(Array.from(bytes))
}

export function maybeDecodeUUID(maybeEncodedUUID: string): string | null {
  try {
    return decodeUUID(maybeEncodedUUID)
  } catch (error) {
    return null
  }
}
