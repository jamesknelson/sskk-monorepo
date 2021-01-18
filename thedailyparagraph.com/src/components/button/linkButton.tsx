import { useLink } from 'retil-router'

import { Button, ButtonProps } from './button'

export interface LinkButtonProps extends ButtonProps {
  to: string
}

export const LinkButton = ({
  color,
  glyph,
  glyphColor,
  inline = false,
  outline,
  to,
  ...rest
}: LinkButtonProps) => {
  const anchorProps = useLink(to, {})
  Object.assign(anchorProps, {
    as: 'a',
  })
  return (
    <Button
      {...(anchorProps as any)}
      glyph={glyph}
      glyphColor={glyphColor}
      inline={inline}
      outline={outline}
      {...rest}
    />
  )
}
