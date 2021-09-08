import { NavAction, NavLocation, joinPathnames, parseLocation } from 'retil-nav'
import { emptyObject } from 'retil-support'
import { parse as parseUUID, stringify as stringifyUUID } from 'uuid'

export type URLParams = Record<
  string,
  string | string[] | boolean | null | undefined
>

// Allow null values to be passed into optional parameters
type ExtendParams<TParams> = {
  [Key in keyof TParams]: undefined extends TParams[Key]
    ? TParams[Key] | null
    : TParams[Key]
}

type URLConfig<TParams extends URLParams = URLParams> =
  // https://stackoverflow.com/questions/52667959/what-is-the-purpose-of-bivariancehack-in-typescript-types
  { bivarianceHack(instance: TParams): NavAction }['bivarianceHack']

type URLSchemaConfig = {
  [name: string]: URLSchema | URLConfig
}

type URLSchema = {
  [name: string]: URLSchema | URLSchemaLeaf<any>
}

type URLSchemaLeaf<TParams extends URLParams = {}> = {} extends TParams
  ? (params?: URLSchemaEmptyParams) => NavLocation
  : (params: TParams) => NavLocation

type URLNestableSchemaLeaf<TParams extends URLParams = URLParams> =
  | { bivarianceHack(instance?: TParams): NavLocation }['bivarianceHack']

type URLNestableSchema = {
  [name: string]: URLSchema | URLNestableSchemaLeaf
}

type URLNestedSchemaAndLeaf<
  TSchema extends URLNestableSchema,
  TParams extends URLParams = {},
> = URLSchemaLeaf<TParams> & URLNestedSchema<TSchema, TParams>

type URLNestedSchema<
  TSchema extends URLNestableSchema,
  TParams extends URLParams = {},
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
    ? (params: ExtendParams<IParams>) => NavLocation
    : never

// ---

type NestedURLSchema<
  TSchema extends URLSchema,
  TParams extends URLParams = {},
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

const nestedSchemaSymbol = Symbol()

export function urlSchema<TConfig extends URLSchemaConfig>(
  config: TConfig,
): URLSchemaFromConfig<TConfig> {
  const keys = Object.keys(config)
  const schema = {} as URLSchema
  for (const key of keys) {
    const value = config[key]
    schema[key] =
      nestedSchemaSymbol in value
        ? (value as URLSchema)
        : (params: URLParams = {}) =>
            parseLocation((value as URLConfig)(params))
  }
  return schema as URLSchemaFromConfig<TConfig>
}

export function nestURLSchema<
  TSchema extends URLNestableSchema,
  TParams extends URLParams = {},
>(
  root: string | URLConfig<TParams>,
  schema: TSchema,
): URLNestedSchemaAndLeaf<TSchema, TParams> {
  const leaf = typeof root !== 'string' ? root : () => root

  const handler: ProxyHandler<URLNestableSchemaLeaf> = {
    apply: (target, thisArg, argumentsList) => {
      const head = parseLocation(leaf.apply(thisArg, argumentsList))
      if (target === leaf) {
        return head
      }
      const tail = target.apply(thisArg, argumentsList)
      return parseLocation({
        pathname: joinPathnames(head.pathname || '', tail?.pathname || ''),
        query: (head.query || tail?.query) && {
          ...head.query,
          ...tail?.query,
        },
      })
    },
    get: (target, key) => {
      if (key === nestedSchemaSymbol) {
        return true
      }
      const child = schema[key as string]
      if (child) {
        return new Proxy(child, handler)
      }
      return Reflect.get(target, key)
    },
    has: (target, key) => {
      if (key === nestedSchemaSymbol) {
        return true
      }
      return Reflect.has(schema, key) || Reflect.has(target, key)
    },
    ownKeys: (target) =>
      Reflect.ownKeys(schema).concat(Reflect.ownKeys(target)),
  }

  return new Proxy(leaf, handler) as URLNestedSchemaAndLeaf<TSchema, TParams>
}

export function patternFor<TParams extends URLParams>(
  getter: (
    | ((params?: URLSchemaEmptyParams) => NavLocation)
    | ((params: TParams) => NavLocation)
  ) & {
    [nestedSchemaSymbol]?: true
  },
  options: {
    optional?: (keyof TParams)[]
  } = {},
): string {
  const { optional = [] } = options
  const { pathname } = getter(
    new Proxy(emptyObject as any, {
      get: (_target, prop) =>
        ':' +
        (typeof prop === 'string' && optional.includes(prop)
          ? prop + '?'
          : String(prop)),
    }),
  )
  const wildcard = nestedSchemaSymbol in getter ? '*' : ''
  return pathname + wildcard
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
