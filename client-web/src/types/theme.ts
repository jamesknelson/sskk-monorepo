export interface ColorScheme {
  // The background of the app, as applied to the root element.
  background: string
  // "on" colors indicate the darkest color of text, glyphs, and over content
  // displayed over a color. They can be tinted via applying sub-1 opacities.
  onBackground: string

  // Primary color, used in situations where we want to draw attention in a
  // subtle and tasteful way. Think blue-black ink amongst black ink.
  // This is often used for the primary content on a page – in particular, it
  // is used for letter text.
  primary: string
  onPrimary: string
  // "wash" colors indicate a washed-out version of a color which can be used
  // when we want to draw less attention. Washed out colors can also be used
  // as a container around the parent color.
  primaryWash: string
  onPrimaryWash: string

  // The secondary color is intended for drawing attention in a more impactful
  // way. Think blue ink amongst black ink. It is often used for indicators,
  // including progress, and activity indicators.
  secondary: string
  onSecondary: string
  secondaryWash: string
  onSecondaryWash: string

  // The tertiary color is used for drawing immediate attention. It is primary
  // intended for use in focus indicators.
  tertiary: string
  onTertiary: string
  tertiaryWash: string
  onTertiaryWash: string

  // The issue color is used for calling attention to things that might (or
  // definitely) are not right.
  issue: string
  onIssue: string
  issueWash: string
  onIssueWash: string

  // A surface is a card, modal, menu, or other area of the UI which contains
  // an area containing some content or behavior.
  surface: string
  // Used between surface and backgorund
  surfaceBorder: string
  // Used as divider, between surface and wash, or as outline
  surfaceLine: string
  onSurface: string
  surfaceWash: string
  onSurfaceWash: string

  // An alternative surface, shaded with the primary color, so as to be able to
  // layer surfaces, providing contrast between them. Typically used for modals,
  // toolbars, etc.
  altSurface: string
  altSurfaceBorder: string
  altSurfaceLine: string
  onAltSurface: string
  altSurfaceWash: string
  onAltSurfaceWash: string

  // An inverse surface, typically used for toasts.
  inverseSurface: string
  inverseSurfaceBorder: string
  inverseSurfaceLine: string
  onInverseSurface: string

  // For use on inverse surface
  inversePrimary: string
}

export interface OpacityScheme {
  /**
   * Provider a slightly dimmed version of text, useful For providing contrast
   * between different grouping of the primary content.
   */
  alt: number

  /**
   * Used for text and glyphs that should stand out less than similar text.
   * For example, this can be used for displaying dates and other metadata.
   */
  peripheral: number

  /**
   * Used for placeholders within input fields.
   */
  placeholder: number
}

export interface Theme {
  color: ColorScheme
  opacity: OpacityScheme
}
