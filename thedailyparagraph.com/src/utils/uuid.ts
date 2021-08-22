import { parse as parseUUID, stringify as stringifyUUID } from 'uuid'

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
