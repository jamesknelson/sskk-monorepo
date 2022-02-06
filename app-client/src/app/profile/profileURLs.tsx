import { urlSchema } from 'src/util/urls'

export type ProfileParams = {
  nametag: string
}

const urls = urlSchema({
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

export default urls
