import {
  wrapItem,
  blockTypeItem,
  Dropdown,
  DropdownSubmenu,
  MenuItemSpec,
  joinUpItem,
  liftItem,
  selectParentNodeItem,
  undoItem,
  redoItem,
  icons,
  MenuItem,
} from 'prosemirror-menu'
import { EditorState, NodeSelection } from 'prosemirror-state'
import { Command, toggleMark } from 'prosemirror-commands'
import { wrapInList } from 'prosemirror-schema-list'

import { TextField, openPrompt } from './prompt'
import { Schema, AppMarkType, AppNodeType } from './schema'

// Helpers to create specific types of items

function canInsert(state: EditorState, nodeType: AppNodeType) {
  let $from = state.selection.$from
  for (let d = $from.depth; d >= 0; d--) {
    let index = $from.index(d)
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true
  }
  return false
}

function insertImageItem(nodeType: AppNodeType) {
  return new MenuItem({
    title: 'Insert image',
    label: 'Image',
    enable(state) {
      return canInsert(state, nodeType)
    },
    run(state, _, view) {
      let { from, to } = state.selection,
        attrs = null
      if (
        state.selection instanceof NodeSelection &&
        state.selection.node.type == nodeType
      )
        attrs = state.selection.node.attrs
      openPrompt({
        title: 'Insert image',
        fields: {
          src: new TextField({
            label: 'Location',
            required: true,
            value: attrs && attrs.src,
          }),
          title: new TextField({ label: 'Title', value: attrs && attrs.title }),
          alt: new TextField({
            label: 'Description',
            value: attrs ? attrs.alt : state.doc.textBetween(from, to, ' '),
          }),
        },
        callback(attrs) {
          view.dispatch(
            view.state.tr.replaceSelectionWith(nodeType.createAndFill(attrs)!),
          )
          view.focus()
        },
      })
    },
  })
}

type CommandItemOptions = Omit<MenuItemSpec, 'enable'> & {
  enable?: boolean | MenuItemSpec['enable']
}

function cmdItem(cmd: Command, options: CommandItemOptions) {
  let passedOptions: MenuItemSpec = {
    label: options.title as any,
    run: cmd,
  }
  for (let prop in options)
    passedOptions[prop as keyof MenuItemSpec] = options[
      prop as keyof MenuItemSpec
    ] as any
  if ((!options.enable || (options as any).enable === true) && !options.select)
    passedOptions[options.enable ? 'enable' : 'select'] = (state: any) =>
      cmd(state)

  return new MenuItem(passedOptions)
}

function markActive(state: EditorState, type: AppMarkType): boolean {
  let { from, $from, to, empty } = state.selection
  if (empty) return !!type.isInSet(state.storedMarks || $from.marks())
  else return state.doc.rangeHasMark(from, to, type)
}

function markItem(markType: AppMarkType, options: Omit<MenuItemSpec, 'run'>) {
  let passedOptions = {
    active(state: EditorState) {
      return markActive(state, markType)
    },
    enable: true,
  } as CommandItemOptions
  // @ts-ignore
  for (let prop in options) passedOptions[prop] = options[prop]
  return cmdItem(toggleMark(markType), passedOptions)
}

function linkItem(markType: AppMarkType) {
  return new MenuItem({
    title: 'Add or remove link',
    icon: icons.link,
    active(state) {
      return markActive(state, markType)
    },
    enable(state) {
      return !state.selection.empty
    },
    run(state, dispatch, view) {
      if (markActive(state, markType)) {
        toggleMark(markType)(state, dispatch)
        return true
      }
      openPrompt({
        title: 'Create a link',
        fields: {
          href: new TextField({
            label: 'Link target',
            required: true,
          }),
          title: new TextField({ label: 'Title' }),
        },
        callback(attrs) {
          toggleMark(markType, attrs)(view.state, view.dispatch)
          view.focus()
        },
      })
    },
  })
}

interface WrapListItemOptions extends Omit<CommandItemOptions, 'run'> {
  attrs?: any
}

function wrapListItem(nodeType: AppNodeType, options: WrapListItemOptions) {
  return cmdItem(wrapInList(nodeType, options.attrs), options as any)
}

export function buildMenuItems(schema: Schema) {
  const inlineMenu = [
    [
      markItem(schema.marks.strong, {
        title: 'Toggle strong style',
        icon: icons.strong,
      }),
      markItem(schema.marks.em, { title: 'Toggle emphasis', icon: icons.em }),
      markItem(schema.marks.code, {
        title: 'Toggle code font',
        icon: icons.code,
      }),
      linkItem(schema.marks.link),
    ],
  ]

  const insertMenu = new Dropdown(
    [
      insertImageItem(schema.nodes.image),
      new MenuItem({
        title: 'Insert horizontal rule',
        label: 'Horizontal rule',
        enable(state) {
          return canInsert(state, schema.nodes.horizontal_rule)
        },
        run(state, dispatch) {
          dispatch(
            state.tr.replaceSelectionWith(
              schema.nodes.horizontal_rule.create(),
            ),
          )
        },
      }),
    ],
    {
      label: 'Insert',
    },
  )

  const createHeadingItem = (i: number) =>
    blockTypeItem(schema.nodes.heading, {
      title: 'Change to heading ' + i,
      label: 'Level ' + i,
      attrs: { level: i },
    })

  const typeMenu = new Dropdown(
    [
      blockTypeItem(schema.nodes.title, {
        title: 'Change to title',
        label: 'Title',
      }),
      blockTypeItem(schema.nodes.paragraph, {
        title: 'Change to paragraph',
        label: 'Plain',
      }),
      blockTypeItem(schema.nodes.code_block, {
        title: 'Change to code block',
        label: 'Code',
      }),
      new DropdownSubmenu(
        [
          createHeadingItem(2),
          createHeadingItem(3),
          createHeadingItem(4),
          createHeadingItem(5),
          createHeadingItem(6),
        ],
        { label: 'Heading' },
      ),
    ],
    { label: 'Type...' },
  )

  const blockMenu = [
    [
      wrapListItem(schema.nodes.bullet_list, {
        title: 'Wrap in bullet list',
        icon: icons.bulletList,
      }),
      wrapListItem(schema.nodes.ordered_list, {
        title: 'Wrap in ordered list',
        icon: icons.orderedList,
      }),
      wrapItem(schema.nodes.blockquote, {
        title: 'Wrap in block quote',
        icon: icons.blockquote,
      }),
      joinUpItem,
      liftItem,
      selectParentNodeItem,
    ],
  ]

  return (inlineMenu as any).concat(
    [[insertMenu, typeMenu]],
    [[undoItem, redoItem]],
    blockMenu,
  )
}
