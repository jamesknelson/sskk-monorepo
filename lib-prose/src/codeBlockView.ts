import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'

import CodeMirror from 'codemirror'
import { exitCode } from 'prosemirror-commands'
import { undo, redo } from 'prosemirror-history'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Selection, TextSelection } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'

import { Schema, schema } from './schema'

// Based on https://github.com/ProseMirror/website/blob/d9075132f4278fe3df4255cc1bcfb127da80167e/example/codemirror/index.js
export class CodeBlockView implements NodeView<Schema> {
  dom: HTMLElement

  private cm: CodeMirror.Editor
  private incomingChanges: boolean
  private updating: boolean

  constructor(
    private node: ProsemirrorNode,
    private view: EditorView,
    private getPos: () => number,
  ) {
    // Store for later
    this.node = node
    this.view = view
    this.getPos = getPos
    this.incomingChanges = false

    // Create a CodeMirror instance
    this.cm = CodeMirror(null as any, {
      value: this.node.textContent,
      lineNumbers: true,
      extraKeys: this.codeMirrorKeymap(),
    })

    // The editor's outer node is our DOM representation
    this.dom = this.cm.getWrapperElement()
    // CodeMirror needs to be in the DOM to properly initialize, so
    // schedule it to update itself
    setTimeout(() => this.cm.refresh(), 20)

    // This flag is used to avoid an update loop between the outer and
    // inner editor
    this.updating = false
    // Track whether changes are have been made but not yet propagated
    this.cm.on('beforeChange', () => {
      this.incomingChanges = true
    })
    // Propagate updates from the code editor to ProseMirror
    this.cm.on('cursorActivity', () => {
      if (!this.updating && !this.incomingChanges) this.forwardSelection()
    })
    this.cm.on('changes', () => {
      if (!this.updating) {
        this.valueChanged()
        this.forwardSelection()
      }
      this.incomingChanges = false
    })
    this.cm.on('focus', this.handleFocus)
  }

  handleFocus = () => {
    this.forwardSelection()
  }

  forwardSelection() {
    if (this.cm.hasFocus()) {
      const state = this.view.state
      const offset = this.getPos() + 1
      const anchor = this.cm.indexFromPos(this.cm.getCursor('anchor')) + offset
      const head = this.cm.indexFromPos(this.cm.getCursor('head')) + offset
      const selection = TextSelection.create(state.doc, anchor, head)
      if (!selection.eq(state.selection)) {
        this.view.dispatch(state.tr.setSelection(selection))
      }
    }
  }

  setSelection(anchor: number, head: number) {
    this.cm.focus()
    this.updating = true
    this.cm.setSelection(
      this.cm.posFromIndex(anchor),
      this.cm.posFromIndex(head),
    )
    this.updating = false
  }

  valueChanged() {
    let change = computeChange(this.node.textContent, this.cm.getValue())
    if (change) {
      let start = this.getPos() + 1
      let tr = this.view.state.tr.replaceWith(
        start + change.from,
        start + change.to,
        change.text ? schema.text(change.text) : [],
      )
      this.view.dispatch(tr)
    }
  }

  codeMirrorKeymap() {
    let view = this.view
    let mod = /Mac/.test(navigator.platform) ? 'Cmd' : 'Ctrl'
    return CodeMirror.normalizeKeyMap({
      Up: () => this.maybeEscape('line', -1),
      Left: () => this.maybeEscape('char', -1),
      Down: () => this.maybeEscape('line', 1),
      Right: () => this.maybeEscape('char', 1),
      'Ctrl-Enter': () => {
        if (exitCode(view.state, view.dispatch)) view.focus()
      },
      [`${mod}-Z`]: () => undo(view.state, view.dispatch),
      [`Shift-${mod}-Z`]: () => redo(view.state, view.dispatch),
      [`${mod}-Y`]: () => redo(view.state, view.dispatch),
    })
  }

  maybeEscape(unit: 'line' | 'char', dir: number) {
    let pos = this.cm.getCursor()
    if (
      this.cm.somethingSelected() ||
      pos.line !== (dir < 0 ? this.cm.firstLine() : this.cm.lastLine()) ||
      (unit === 'char' &&
        pos.ch !== (dir < 0 ? 0 : this.cm.getLine(pos.line).length))
    )
      return CodeMirror.Pass
    this.view.focus()
    let targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize)
    let selection = Selection.near(this.view.state.doc.resolve(targetPos), dir)
    this.view.dispatch(
      this.view.state.tr.setSelection(selection).scrollIntoView(),
    )
    this.view.focus()
  }

  update(node: ProsemirrorNode<Schema>) {
    if (node.type !== this.node.type) return false
    this.node = node
    let change = computeChange(this.cm.getValue(), node.textContent)
    if (change) {
      this.updating = true
      this.cm.replaceRange(
        change.text,
        this.cm.posFromIndex(change.from),
        this.cm.posFromIndex(change.to),
      )
      this.updating = false
    }
    return true
  }

  selectNode() {
    this.cm.focus()
  }

  stopEvent() {
    return true
  }
}

function computeChange(oldVal: string, newVal: string) {
  if (oldVal === newVal) return null
  let start = 0,
    oldEnd = oldVal.length,
    newEnd = newVal.length
  while (
    start < oldEnd &&
    oldVal.charCodeAt(start) === newVal.charCodeAt(start)
  )
    ++start
  while (
    oldEnd > start &&
    newEnd > start &&
    oldVal.charCodeAt(oldEnd - 1) === newVal.charCodeAt(newEnd - 1)
  ) {
    oldEnd--
    newEnd--
  }
  return { from: start, to: oldEnd, text: newVal.slice(start, newEnd) }
}
