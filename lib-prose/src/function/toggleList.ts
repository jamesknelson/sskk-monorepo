import { Fragment, Node, NodeType, Schema } from 'prosemirror-model'
import { TextSelection, Transaction } from 'prosemirror-state'
import { findParentNodeOfType } from 'prosemirror-utils'

import { HEADING, LIST_ITEM, PARAGRAPH } from '~/nodeNames'

import { consolidateListNodes } from './consolidateListNodes'
import { isListNode } from './isListNode'
import { transformAndPreserveTextSelection } from './transformAndPreserveTextSelection'

import type { SelectionMemo } from './transformAndPreserveTextSelection'

export function toggleList(
  tr: Transaction,
  schema: Schema,
  listNodeType: NodeType,
): Transaction {
  const { selection, doc } = tr
  if (!selection || !doc) {
    return tr
  }

  const { from } = selection

  const fromSelection = TextSelection.create(doc, from, from)
  const paragraph = schema.nodes[PARAGRAPH]
  const heading = schema.nodes[HEADING]
  const result = findParentNodeOfType(listNodeType)(fromSelection)
  if (result) {
    tr = unwrapNodesFromList(tr, schema, result.pos)
  } else if (paragraph && findParentNodeOfType(paragraph)(fromSelection)) {
    tr = wrapNodesWithList(tr, schema, listNodeType)
  } else if (heading && findParentNodeOfType(heading)(fromSelection)) {
    tr = wrapNodesWithList(tr, schema, listNodeType)
  }
  return tr
}

export function unwrapNodesFromList(
  tr: Transaction,
  schema: Schema,
  listNodePos: number,
  unwrapParagraphNode?: null | ((node: Node) => Node),
): Transaction {
  return transformAndPreserveTextSelection(tr, schema, (memo) => {
    return consolidateListNodes(
      unwrapNodesFromListInternal(memo, listNodePos, unwrapParagraphNode),
    )
  })
}

function wrapNodesWithList(
  tr: Transaction,
  schema: Schema,
  listNodeType: NodeType,
): Transaction {
  return transformAndPreserveTextSelection(tr, schema, (memo) => {
    return consolidateListNodes(wrapNodesWithListInternal(memo, listNodeType))
  })
}

function wrapNodesWithListInternal(
  memo: SelectionMemo,
  listNodeType: NodeType,
): Transaction {
  const { schema } = memo
  let { tr } = memo
  const { doc, selection } = tr
  if (!tr || !selection) {
    return tr
  }
  const { from, to } = selection

  const paragraph = schema.nodes[PARAGRAPH]
  const heading = schema.nodes[HEADING]

  let items = null as null | { node: Node; pos: number }[]
  let lists = []
  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type
    const nodeName = nodeType.name
    if (isListNode(node)) {
      if (node.type !== listNodeType) {
        const listNodeAttrs = {
          ...node.attrs,
          listNodeType: null,
        }
        tr = tr.setNodeMarkup(pos, listNodeType, listNodeAttrs, node.marks)
      }
      items && lists.push(items)
      items = null
      return false
    }

    if (/table/.test(nodeName)) {
      items && lists.push(items)
      items = null
      return true
    }

    if (nodeType === heading || nodeType === paragraph) {
      items = items || []
      items.push({ node, pos })
    } else {
      items && items.length && lists.push(items)
      items = null
    }
    return true
  })
  items && items.length && lists.push(items)

  lists = lists.filter((items) => items.length > 0)
  if (!lists.length) {
    return tr
  }

  lists = lists.sort((a, b) => {
    const pa = a[0]!.pos
    const pb = b[0]!.pos
    return pa >= pb ? 1 : -1
  })

  lists.reverse()

  lists.forEach((items) => {
    tr = wrapItemsWithListInternal(tr, schema, listNodeType, items)
  })

  return tr
}

function wrapItemsWithListInternal(
  tr: Transaction,
  schema: Schema,
  listNodeType: NodeType,
  items: Array<{ node: Node; pos: number }>,
): Transaction {
  const initialTr = tr
  const paragraph = schema.nodes[PARAGRAPH]
  const listItem = schema.nodes[LIST_ITEM]

  if (!paragraph || !listItem) {
    return tr
  }

  const paragraphNodes = [] as (null | undefined | Node)[]
  items.forEach((item) => {
    const { node, pos } = item
    // Temporarily annotate each node with an unique ID.
    const uniqueID = {}
    const nodeAttrs = { ...node.attrs, id: uniqueID }
    // Replace the original node with the node annotated by the uniqueID.
    tr = tr.setNodeMarkup(pos, paragraph, nodeAttrs, node.marks)
    paragraphNodes.push(tr.doc.nodeAt(pos))
  })

  const firstNode = paragraphNodes[0]
  const lastNode = paragraphNodes[paragraphNodes.length - 1]
  if (!firstNode || !lastNode) {
    return initialTr
  }

  const firstNodeID = firstNode.attrs.id
  const lastNodeID = lastNode.attrs.id
  if (!firstNodeID || !lastNodeID) {
    return initialTr
  }

  let fromPos = null as null | number
  let toPos = null as null | number
  tr.doc.descendants((node, pos) => {
    const nodeID = node.attrs.id
    if (nodeID === firstNodeID) {
      fromPos = pos
    }
    if (nodeID === lastNodeID) {
      toPos = pos + node.nodeSize
    }
    return fromPos === null || toPos === null
  })

  if (fromPos === null || toPos === null) {
    return initialTr
  }

  const listItemNodes = [] as Node[]
  items.forEach((item) => {
    const { node } = item
    // Restore the annotated nodes with the copy of the original ones.
    const paragraphNode = paragraph.create(node.attrs, node.content, node.marks)
    const listItemNode = listItem.create(
      node.attrs,
      Fragment.from(paragraphNode),
    )
    listItemNodes.push(listItemNode)
  })

  const listNodeAttrs = { indent: 0, start: 1 }
  const $fromPos = tr.doc.resolve(fromPos)
  const $toPos = tr.doc.resolve(toPos)

  const hasSameListNodeBefore =
    $fromPos.nodeBefore &&
    $fromPos.nodeBefore.type === listNodeType &&
    $fromPos.nodeBefore.attrs.indent === 0

  const hasSameListNodeAfter =
    $toPos.nodeAfter &&
    $toPos.nodeAfter.type === listNodeType &&
    $toPos.nodeAfter.attrs.indent === 0

  if (hasSameListNodeBefore) {
    tr = tr.delete(fromPos, toPos)
    tr = tr.insert(fromPos - 1, Fragment.from(listItemNodes))
    if (hasSameListNodeAfter) {
      tr = tr.delete(toPos + 1, toPos + 3)
    }
  } else if (hasSameListNodeAfter) {
    tr = tr.delete(fromPos, toPos)
    tr = tr.insert(fromPos + 1, Fragment.from(listItemNodes))
  } else {
    const listNode = listNodeType.create(
      listNodeAttrs,
      Fragment.from(listItemNodes),
    )
    tr = tr.delete(fromPos, toPos)
    tr = tr.insert(fromPos, Fragment.from(listNode))
  }

  return tr
}

interface ContentBlock {
  node: Node
  pos: number
  parentNode: Node
  index: number
}

function unwrapNodesFromListInternal(
  memo: SelectionMemo,
  listNodePos: number,
  unwrapParagraphNode?: null | ((node: Node) => Node),
): Transaction {
  const { schema } = memo
  let { tr } = memo

  if (!tr.doc || !tr.selection) {
    return tr
  }

  const { nodes } = schema
  const paragraph = nodes[PARAGRAPH]
  const listItem = nodes[LIST_ITEM]

  if (!listItem || !paragraph) {
    return tr
  }

  const listNode = tr.doc.nodeAt(listNodePos) as Node
  if (!isListNode(listNode)) {
    return tr
  }

  const initialSelection = tr.selection
  const { from, to } = initialSelection

  if (from === to && from < 1) {
    return tr
  }
  const contentBlocksBefore = [] as ContentBlock[]
  const contentBlocksSelected = [] as ContentBlock[]
  const contentBlocksAfter = [] as ContentBlock[]

  tr.doc.nodesBetween(
    listNodePos,
    listNodePos + listNode.nodeSize,
    (node, pos, parentNode, index) => {
      if (node.type !== paragraph) {
        return true
      }
      const block: ContentBlock = {
        node,
        pos,
        parentNode,
        index,
      }

      if (pos + node.nodeSize <= from) {
        contentBlocksBefore.push(block)
      } else if (pos > to) {
        contentBlocksAfter.push(block)
      } else {
        contentBlocksSelected.push(block)
      }
      return false
    },
  )

  if (!contentBlocksSelected.length) {
    return tr
  }

  tr = tr.delete(listNodePos, listNodePos + listNode.nodeSize)

  const listNodeType = listNode.type
  const attrs = { indent: listNode.attrs.indent, start: 1 }

  if (contentBlocksAfter.length) {
    const nodes = contentBlocksAfter.map((block) => {
      return listItem.create({}, Fragment.from(block.node))
    })
    const frag = Fragment.from(listNodeType.create(attrs, Fragment.from(nodes)))
    tr = tr.insert(listNodePos, frag)
  }

  if (contentBlocksSelected.length) {
    const nodes = contentBlocksSelected.map((block) => {
      if (unwrapParagraphNode) {
        return unwrapParagraphNode(block.node)
      } else {
        return block.node
      }
    })
    const frag = Fragment.from(nodes)
    tr = tr.insert(listNodePos, frag)
  }

  if (contentBlocksBefore.length) {
    const nodes = contentBlocksBefore.map((block) => {
      return listItem.create({}, Fragment.from(block.node))
    })
    const frag = Fragment.from(listNodeType.create(attrs, Fragment.from(nodes)))
    tr = tr.insert(listNodePos, frag)
  }
  return tr
}
