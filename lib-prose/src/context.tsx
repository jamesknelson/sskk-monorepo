/**
 * Any React components that are needed to render the prose are passed in via
 * context, to facilitate decoupling between the prose library and the UI
 * library.
 */

import { ReactNode, createContext, useContext } from 'react'

export interface ProseRenderers {
  code_block: (content: string) => ReactNode
}

export interface ProseContext {
  renderers: ProseRenderers
}

export interface ContextRendererProps<T extends keyof ProseRenderers> {
  type: T
  content: string
}

export function ContextRenderer<T extends keyof ProseRenderers>({
  type,
  content,
}: ContextRendererProps<T>) {
  const context = useContext(proseContext)
  return <>{context.renderers[type](content)}</>
}

export const proseContext = createContext<ProseContext>(undefined as any)
