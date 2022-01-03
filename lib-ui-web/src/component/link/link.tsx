import { forwardRef } from 'react'
import { AnchorSurface, LinkSurface, LinkSurfaceProps } from 'retil-interaction'
import { isExternalAction, createHref } from 'retil-nav'

export const Link = forwardRef<
  HTMLAnchorElement,
  Omit<LinkSurfaceProps, 'ref'>
>(function Link(props, ref) {
  return !props.href || isExternalAction(props.href) ? (
    <AnchorSurface
      href={
        typeof props.href === 'string'
          ? props.href
          : props.href
          ? createHref(props.href)
          : undefined
      }
      ref={ref}
      target={props.target}
      title={props.title}>
      {props.children}
    </AnchorSurface>
  ) : (
    <LinkSurface
      {...props}
      children={props.children!}
      href={props.href!}
      ref={ref}
    />
  )
})
