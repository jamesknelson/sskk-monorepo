import { ReactNode, Fragment as ReactFragment, createElement } from 'react'

import {
  DOMOutputSpec,
  Fragment as ProsemirrorFragment,
  Mark,
  Node as ProsemirrorNode,
} from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

import {
  AppMarkType,
  AppNodeType,
  AppSchema,
  ReactHole,
  schema,
} from './schema'

export function renderJSONToReact(initialStateJSON: any): ReactNode {
  const state = EditorState.fromJSON({ schema }, initialStateJSON)
  return ReactSerializer.fromSchema(schema).serializeFragment(state.doc.content)
}

export class ReactSerializer<S extends AppSchema = any> {
  nodes: { [name: string]: (node: ProsemirrorNode<S>) => ReactHole | ReactNode }
  marks: { [name: string]: (mark: Mark<S>, inline: boolean) => ReactHole }

  constructor(
    nodes: {
      [name: string]: (node: ProsemirrorNode<S>) => ReactHole | ReactNode
    },
    marks: {
      [name: string]: (mark: Mark<S>, inline: boolean) => ReactHole
    },
  ) {
    this.nodes = nodes || {}
    this.marks = marks || {}
  }

  // Serialize the content of this fragment to a React fragment.
  serializeFragment(fragment: ProsemirrorFragment<S>): ReactNode {
    const activeMarks = [] as (readonly [
      markContainer: ReactNode[],
      renderMark: ReactHole,
      mark: Mark<S>,
    ])[]

    let currentChildren = [] as ReactNode[]

    fragment.forEach((node) => {
      let keep = 0
      let rendered = 0
      while (keep < activeMarks.length && rendered < node.marks.length) {
        const next = node.marks[rendered]
        if (!this.marks[next.type.name]) {
          rendered++
          continue
        }
        if (!next.eq(activeMarks[keep][2]) || next.type.spec.spanning === false)
          break
        keep += 1
        rendered++
      }
      while (keep < activeMarks.length) {
        const triplet = activeMarks.pop()!
        const markChildren = currentChildren
        currentChildren = triplet[0]
        currentChildren.push(triplet[1](markChildren))
      }
      while (rendered < node.marks.length) {
        const add = node.marks[rendered++]
        const markHole = this.serializeMark(add, node.isInline)
        if (typeof markHole === 'function') {
          activeMarks.push([currentChildren, markHole as ReactHole, add])
          currentChildren = []
        } else {
          currentChildren.push(markHole)
        }
      }
      currentChildren.push(this.serializeNode(node))
    })

    while (activeMarks.length) {
      const triplet = activeMarks.pop()!
      const markChildren = currentChildren
      currentChildren = triplet[0]
      currentChildren.push(triplet[1](markChildren))
    }

    return createElement(ReactFragment, null, ...currentChildren)
  }

  serializeNode(node: ProsemirrorNode<S>): ReactNode {
    let rendered = this.nodes[node.type.name](node)
    if (typeof rendered === 'function') {
      if (node.isLeaf)
        throw new RangeError('Content hole not allowed in a leaf node spec')
      return rendered(this.serializeFragment(node.content))
    }
    return rendered
  }

  serializeNodeAndMarks(node: ProsemirrorNode<S>) {
    let reactNode = this.serializeNode(node)
    for (let i = node.marks.length - 1; i >= 0; i--) {
      let wrap = this.serializeMark(node.marks[i], node.isInline)
      if (wrap) {
        if (typeof wrap !== 'function') {
          throw new RangeError('Marks must have a content hole')
        }
        reactNode = wrap(reactNode)
      }
    }
    return reactNode
  }

  serializeMark(mark: Mark<S>, inline: boolean) {
    let toReact = this.marks[mark.type.name]
    return toReact && toReact(mark, inline)
  }

  static fromSchema(schema: AppSchema) {
    return (
      schema.cached.reactSerializer ||
      (schema.cached.reactSerializer = new ReactSerializer(
        this.nodesFromSchema(schema),
        this.marksFromSchema(schema),
      ))
    )
  }

  static nodesFromSchema<N extends string = any, M extends string = any>(
    schema: AppSchema<N, M>,
  ) {
    let result = gatherToReact(schema.nodes)
    if (!result.text) result.text = (node: ProsemirrorNode<any>) => node.text!
    return result
  }

  static marksFromSchema<N extends string = any, M extends string = any>(
    schema: AppSchema<N, M>,
  ) {
    return gatherToReact(schema.marks)
  }
}

type ToReact =
  | ((node: ProsemirrorNode<any>, inline?: never) => ReactHole | ReactNode)
  | ((node: Mark<any>, inline: boolean) => ReactHole)

function gatherToReact<S extends AppSchema>(obj: {
  [key: string]: AppNodeType<S>
}): {
  [key: string]: (node: ProsemirrorNode<any>) => ReactHole | ReactNode
}
function gatherToReact<S extends AppSchema>(obj: {
  [key: string]: AppMarkType<S>
}): {
  [key: string]: (node: Mark<any>, inline: boolean) => ReactHole
}
function gatherToReact<S extends AppSchema>(obj: {
  [key: string]: AppNodeType<S> | AppMarkType<S>
}) {
  let result = {} as {
    [key: string]: ToReact
  }
  for (let name in obj) {
    const { toDOM, toReact } = obj[name].spec
    if (toReact) {
      result[name] = toReact
    } else if (toDOM) {
      result[name] = (node: any, mark: any) =>
        convertDOMOutputSpecToReact(toDOM(node, mark))
    }
  }
  return result
}

function convertDOMOutputSpecToReact(
  structure: DOMOutputSpec,
): ReactNode | ReactHole {
  if (typeof structure === 'string') {
    return structure
  } else if (Array.isArray(structure)) {
    const type = structure[0]
    const maybeProps = structure[1]
    const hasProps =
      typeof maybeProps === 'object' && !Array.isArray(maybeProps)
    const props = hasProps ? maybeProps : null
    const start = hasProps ? 2 : 1

    if (structure[start] === 0 && structure.length === start + 1) {
      return (child?: ReactNode) => createElement(type, props, child)
    }

    const children = [] as (ReactNode | ReactHole)[]
    let hasHole = false
    for (let i = start; i < structure.length; i++) {
      const child = structure[i]
      if (child === 0) {
        throw new RangeError(
          'Content hole must be the only child of its parent node',
        )
      }

      const rendered = convertDOMOutputSpecToReact(child)
      const isHole = typeof rendered === 'function'
      if (isHole && hasHole) {
        throw new RangeError('Multiple content holes')
      }
      hasHole = hasHole || isHole
      children.push(rendered)
    }
    return !hasHole
      ? createElement(type, props, ...children)
      : (child?: ReactNode) =>
          createElement(
            type,
            props,
            ...children.map((rendered) =>
              typeof rendered === 'function' ? rendered(child) : rendered,
            ),
          )
  } else if (structure) {
    // TODO: this is a DOM node. Pass it to a wrapper component.
    return null
  }
}
