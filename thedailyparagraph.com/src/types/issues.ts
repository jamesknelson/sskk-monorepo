export interface Issues {
  // If `codes` exists, this should be the first code
  code?: string

  codes?: string[]
  fields?: {
    [fieldName: string]: Issues
  }
  items?: Issues[]
  message?: any // string or React Element or etc.
}
