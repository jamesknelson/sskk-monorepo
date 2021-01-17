import * as React from 'react'

import {
  DOMOutputSpec,
  Fragment,
  Mark,
  MarkType,
  Node as ProsemirrorNode,
  NodeType,
  Schema,
} from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

import { schema } from './prosemirrorSchema'

type Hole = (child?: React.ReactNode) => React.ReactNode

export function renderJSONToReact(initialStateJSON: any): React.ReactNode {
  const state = EditorState.fromJSON({ schema }, initialStateJSON)
  return ReactSerializer.fromSchema(schema).serializeFragment(state.doc.content)
}

export class ReactSerializer<S extends Schema = any> {
  nodes: { [name: string]: (node: ProsemirrorNode<S>) => DOMOutputSpec }
  marks: { [name: string]: (mark: Mark<S>, inline: boolean) => DOMOutputSpec }

  // Create a serializer. `nodes` should map node names to functions
  // that take a node and return a description of the corresponding
  // DOM. `marks` does the same for mark names, but also gets an
  // argument that tells it whether the mark's content is block or
  // inline content (for typical use, it'll always be inline). A mark
  // serializer may be `null` to indicate that marks of that type
  // should not be serialized.
  constructor(
    nodes: { [name: string]: (node: ProsemirrorNode<S>) => DOMOutputSpec },
    marks: {
      [name: string]: (mark: Mark<S>, inline: boolean) => DOMOutputSpec
    },
  ) {
    // The node serialization functions.
    this.nodes = nodes || {}
    // The mark serialization functions.
    this.marks = marks || {}
  }

  // Serialize the content of this fragment to a React fragment.
  serializeFragment(fragment: Fragment<S>): React.ReactNode {
    const activeMarks = [] as (readonly [
      markContainer: React.ReactNode[],
      renderMark: Hole,
      mark: Mark<S>,
    ])[]

    let currentChildren = [] as React.ReactNode[]

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
          activeMarks.push([currentChildren, markHole as Hole, add])
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

    return React.createElement(React.Fragment, null, ...currentChildren)
  }

  // :: (Node, ?Object) → dom.Node
  // Serialize this node to a DOM node. This can be useful when you
  // need to serialize a part of a document, as opposed to the whole
  // document. To serialize a whole document, use
  // [`serializeFragment`](#model.DOMSerializer.serializeFragment) on
  // its [content](#model.Node.content).
  serializeNode(node: ProsemirrorNode<S>): React.ReactNode {
    let rendered = ReactSerializer.renderSpec(this.nodes[node.type.name](node))
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
    let toDOM = this.marks[mark.type.name]
    return toDOM && ReactSerializer.renderSpec(toDOM(mark, inline))
  }

  // :: (dom.Document, DOMOutputSpec) → {dom: dom.Node, contentDOM: ?dom.Node}
  // Render an [output spec](#model.DOMOutputSpec) to a DOM node. If
  // the spec has a hole (zero) in it, `contentDOM` will point at the
  // node with the hole.
  static renderSpec(structure: DOMOutputSpec): React.ReactNode | Hole {
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
        return (child?: React.ReactNode) =>
          React.createElement(type, props, child)
      }

      const children = [] as (React.ReactNode | Hole)[]
      let hasHole = false
      for (let i = start; i < structure.length; i++) {
        const child = structure[i]
        if (child === 0) {
          throw new RangeError(
            'Content hole must be the only child of its parent node',
          )
        }

        const rendered = ReactSerializer.renderSpec(child)
        const isHole = typeof rendered === 'function'
        if (isHole && hasHole) {
          throw new RangeError('Multiple content holes')
        }
        hasHole = hasHole || isHole
        children.push(rendered)
      }
      return !hasHole
        ? React.createElement(type, props, ...children)
        : (child?: React.ReactNode) =>
            React.createElement(
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

  // :: (Schema) → DOMSerializer
  // Build a serializer using the [`toDOM`](#model.NodeSpec.toDOM)
  // properties in a schema's node and mark specs.
  static fromSchema(schema: Schema) {
    return (
      schema.cached.domSerializer ||
      (schema.cached.domSerializer = new ReactSerializer(
        this.nodesFromSchema(schema),
        this.marksFromSchema(schema),
      ))
    )
  }

  // : (Schema) → Object<(node: Node) → DOMOutputSpec>
  // Gather the serializers in a schema's node specs into an object.
  // This can be useful as a base to build a custom serializer from.
  static nodesFromSchema(schema: Schema) {
    let result = gatherToDOM(schema.nodes)
    if (!result.text) result.text = (node: ProsemirrorNode<any>) => node.text!
    return result
  }

  // : (Schema) → Object<(mark: Mark) → DOMOutputSpec>
  // Gather the serializers in a schema's mark specs into an object.
  static marksFromSchema<N extends string = any, M extends string = any>(
    schema: Schema<N, M>,
  ) {
    return gatherToDOM(schema.marks)
  }
}

function gatherToDOM<S extends Schema>(obj: {
  [key: string]: NodeType<S>
}): {
  [key: string]: (node: ProsemirrorNode<any>) => DOMOutputSpec
}
function gatherToDOM<S extends Schema>(obj: {
  [key: string]: MarkType<S>
}): {
  [key: string]: (node: Mark<any>, inline: boolean) => DOMOutputSpec
}
function gatherToDOM<S extends Schema>(obj: {
  [key: string]: NodeType<S> | MarkType<S>
}) {
  let result = {} as {
    [key: string]:
      | ((node: ProsemirrorNode<any>) => DOMOutputSpec)
      | ((node: Mark<any>, inline: boolean) => DOMOutputSpec)
  }
  for (let name in obj) {
    let toDOM = obj[name].spec.toDOM
    if (toDOM) result[name] = toDOM
  }
  return result
}
