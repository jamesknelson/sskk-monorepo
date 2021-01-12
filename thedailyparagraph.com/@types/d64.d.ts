declare module 'd64' {
  export function encode(bytes: InputBuffer): string
  export function decode(encoded: string): OutputBuffer
}
