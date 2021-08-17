import {
  parse as parseUUID,
  stringify as stringifyUUID,
  v4 as generateRandomUUID,
} from 'uuid'
import { encode, decode } from 'd64'

export function encodeUUID(uuid: string): string {
  const bytes = parseUUID(uuid)
  return encode(bytes)
}

export function decodeUUID(maybeEncodedUUID: string): string {
  if (maybeEncodedUUID.length === 36) {
    return maybeEncodedUUID
  }

  const bytes = decode(maybeEncodedUUID)
  return stringifyUUID(bytes)
}

export function maybeDecodeUUID(maybeEncodedUUID: string): string | null {
  try {
    return decodeUUID(maybeEncodedUUID)
  } catch (error) {
    return null
  }
}

export { generateRandomUUID }
