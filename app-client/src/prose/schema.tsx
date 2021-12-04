import OrderedMap from 'orderedmap'
import {
  DOMOutputSpec,
  Mark,
  MarkSpec,
  MarkType,
  Node as ProsemirrorNode,
  NodeSpec,
  NodeType,
  Schema as ProsemirrorSchema,
  SchemaSpec,
} from 'prosemirror-model'
import { ReactNode } from 'react'

import { CodeBlock } from 'src/components/web/block/codeBlock'

export type ReactHole = (content?: ReactNode) => ReactNode

export interface AppNodeSpec extends NodeSpec {
  toDOM?: ((node: ProsemirrorNode) => DOMOutputSpec) | null
  toReact?: ((node: ProsemirrorNode) => ReactHole | ReactNode) | null
}
export interface AppMarkSpec extends MarkSpec {
  toDOM?: ((mark: Mark, inline: boolean) => DOMOutputSpec) | null
  toReact?: ((mark: Mark, inline: boolean) => ReactHole) | null
}

export interface AppSchemaSpec<N extends string = any, M extends string = any>
  extends SchemaSpec<N, M> {
  /**
   * The node types in this schema. Maps names to
   * [`NodeSpec`](#model.NodeSpec) objects that describe the node type
   * associated with that name. Their order is significant—it
   * determines which [parse rules](#model.NodeSpec.parseDOM) take
   * precedence by default, and which nodes come first in a given
   * [group](#model.NodeSpec.group).
   */
  nodes: { [name in N]: AppNodeSpec } | OrderedMap<NodeSpec>
  /**
   * The mark types that exist in this schema. The order in which they
   * are provided determines the order in which [mark
   * sets](#model.Mark.addToSet) are sorted and in which [parse
   * rules](#model.MarkSpec.parseDOM) are tried.
   */
  marks?: { [name in M]: AppMarkSpec } | OrderedMap<MarkSpec> | null
}

export interface AppNodeType<S extends AppSchema = any> extends NodeType<S> {
  schema: S
  spec: AppNodeSpec
}

export interface AppMarkType<S extends AppSchema = any> extends MarkType<S> {
  schema: S
  spec: AppMarkSpec
}

export interface AppSchema<N extends string = any, M extends string = any>
  extends ProsemirrorSchema<N, M> {
  /**
   * The [spec](#model.SchemaSpec) on which the schema is based,
   * with the added guarantee that its `nodes` and `marks`
   * properties are
   * [`OrderedMap`](https://github.com/marijnh/orderedmap) instances
   * (not raw objects).
   */
  spec: AppSchemaSpec<N, M>
  /**
   * An object mapping the schema's node names to node type objects.
   */
  nodes: { [name in N]: AppNodeType<AppSchema<N, M>> } & {
    [key: string]: AppNodeType<AppSchema<N, M>>
  }
  /**
   * A map from mark names to mark type objects.
   */
  marks: { [name in M]: AppMarkType<AppSchema<N, M>> } & {
    [key: string]: AppMarkType<AppSchema<N, M>>
  }
}

function createAppSchema<N extends string = any, M extends string = any>(
  spec: AppSchemaSpec<N, M>,
): AppSchema<N, M> {
  return new ProsemirrorSchema(spec) as AppSchema<N, M>
}

const pDOM = ['p', 0] as const,
  blockquoteDOM = ['blockquote', 0] as const,
  hrDOM = ['hr'] as const,
  codeBlockDOM = ['pre', ['code', 0]] as const,
  brDOM = ['br'] as const,
  olDOM = ['ol', 0] as const,
  ulDOM = ['ul', 0] as const,
  liDOM = ['li', 0] as const,
  emDOM = ['em', 0] as const,
  strongDOM = ['strong', 0] as const,
  codeDOM = ['code', 0] as const

export const schema = createAppSchema({
  nodes: {
    // :: NodeSpec The top level document node.
    doc: {
      content: '(block|title) block*',
    },

    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return pDOM
      },
    },

    // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
    blockquote: {
      content: 'block+',
      group: 'block',
      defining: true,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM() {
        return blockquoteDOM
      },
    },

    // :: NodeSpec A horizontal rule (`<hr>`).
    horizontal_rule: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM() {
        return hrDOM
      },
    },

    title: {
      content: 'text*',
      defining: true,
      parseDOM: [{ tag: 'h1' }],
      toDOM() {
        return ['h1', 0]
      },
    },

    // :: NodeSpec A heading textblock, with a `level` attribute that
    // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    // `<h6>` elements.
    heading: {
      attrs: { level: { default: 2 } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } },
      ],
      toDOM(node) {
        return ['h' + node.attrs.level, 0]
      },
    },

    // :: NodeSpec A code listing. Disallows marks or non-text inline
    // nodes by default.
    code_block: {
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      isolating: true,
      parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
      toDOM() {
        return codeBlockDOM
      },
      toReact() {
        return (content: string) => <CodeBlock children={content} />
      },
    },

    // :: NodeSpec The text node.
    text: {
      group: 'inline',
    },

    // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
    // `alt`, and `href` attributes. The latter two default to the empty
    // string.
    image: {
      inline: true,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom) {
            const element = dom as Element
            return {
              src: element.getAttribute('src'),
              title: element.getAttribute('title'),
              alt: element.getAttribute('alt'),
            }
          },
        },
      ],
      toDOM(node) {
        let { src, alt, title } = node.attrs
        return ['img', { src, alt, title }]
      },
    },

    // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM() {
        return brDOM
      },
    },

    ordered_list: {
      attrs: { order: { default: 1 } },
      parseDOM: [
        {
          tag: 'ol',
          getAttrs(dom) {
            const element = dom as Element
            return {
              order: element.hasAttribute('start')
                ? parseInt(element.getAttribute('start')!, 10)
                : 1,
            }
          },
        },
      ],
      toDOM(node) {
        return node.attrs.order === 1
          ? olDOM
          : ['ol', { start: node.attrs.order }, 0]
      },
      content: 'list_item+',
      group: 'block',
    },

    bullet_list: {
      parseDOM: [{ tag: 'ul' }],
      toDOM() {
        return ulDOM
      },
      content: 'list_item+',
      group: 'block',
    },

    list_item: {
      parseDOM: [{ tag: 'li' }],
      toDOM() {
        return liDOM
      },
      defining: true,
      content: 'paragraph block*',
    },
  },
  marks: {
    // :: MarkSpec A link. Has `href` and `title` attributes. `title`
    // defaults to the empty string. Rendered and parsed as an `<a>`
    // element.
    link: {
      attrs: {
        href: {},
        title: { default: null },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom) {
            const element = dom as Element
            return {
              href: element.getAttribute('href'),
              title: element.getAttribute('title'),
            }
          },
        },
      ],
      toDOM(node) {
        let { href, title } = node.attrs
        return ['a', { href, title }, 0]
      },
    },

    // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
    // Has parse rules that also match `<i>` and `font-style: italic`.
    em: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() {
        return emDOM
      },
    },

    // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
    // also match `<b>` and `font-weight: bold`.
    strong: {
      parseDOM: [
        { tag: 'strong' },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        {
          tag: 'b',
          getAttrs: (node: any) => node.style.fontWeight !== 'normal' && null,
        },
        {
          style: 'font-weight',
          getAttrs: (value: any) =>
            /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
        },
      ],
      toDOM() {
        return strongDOM
      },
    },

    // :: MarkSpec Code font mark. Represented as a `<code>` element.
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM() {
        return codeDOM
      },
    },

    subscript: {
      excludes: 'superscript',
      parseDOM: [{ tag: 'sub' }, { style: 'vertical-align=sub' }],
      toDOM: () => ['sub'],
    },

    superscript: {
      excludes: 'subscript',
      parseDOM: [{ tag: 'sup' }, { style: 'vertical-align=super' }],
      toDOM: () => ['sup'],
    },

    strikethrough: {
      parseDOM: [
        { tag: 'strike' },
        { style: 'text-decoration=line-through' },
        { style: 'text-decoration-line=line-through' },
      ],
      toDOM: () => [
        'span',
        {
          style: 'text-decoration-line:line-through',
        },
      ],
    },
  },
})

export type Schema = typeof schema
