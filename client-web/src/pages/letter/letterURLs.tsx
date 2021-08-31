export type LetterParams = {
  letterId: string
  letterSlug?: string
  profileNametag: string
}

export type LetterQuery = {
  /**
   * If this is set to a *known and supported* url, then the back button in
   * the mobile interface will point there, and this will also affect the
   * match on the primary navigation bar.
   */
  from?: string
}
