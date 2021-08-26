styles

external vs internal styles

external styles are things that can be applied directly to a container without
affecting its internals, other how they adjust to size. these include things
like:

- position
- flex-basis
- flex-grow
- margin
- width
- height
- etc.

internal styles are everything else, including

- padding
- colors
- fonts

external styles can be set on basically anything via standard css/sx props
they don't need special props

internal styles on non-styled components can only be adjusted via props.

some css properties don't always fit neatly into one of these two categories.
for example, setting `display` can change both the external style (e.g. width
and/or height) and internal style (can set internal elements to flex). in cases
like these where a property doesn't fit neatly into either category, the safest
approach is to treat it as internal, exposing any required functionality via
props.

when applying internal styles, instead of using a css/sx prop, you'll want to
use a styled component. ideally, the linter would emit a warning if you apply
internal styles using css/sx props on anything other than a styled component,
as only styled components can provide predictable behavior for these props,
given that they're guaranteed to only contain a single markup element.

(tricky) if components have fixed height/width, ideally these should be set on
the outermost element, so that they can be overridden using plain css/sx props

by using the `sx` prop, some plain css properties can be specified with media
queries or theme values

basically, `sx` is a prop which lets you specify vanilla CSS properties,
possibly from a scale, and possibly using media queries. non-vanilla
presentation props, and presentation props that have a css equivalent that
is not guaranteed to behave correctly on a component that may nest more than
a single dom node should use react props.

because of this, it makes sense to have a hook to handle sx props for components
instead of using a jsx pragma.

**the available properties that can be passed to an `sx` prop may differ between
  components**

you can think of the `sx` prop as a helper for easily adding the ability to
style/position a custom component.

---

- we can use the theme-ui standard for defining themes
- can even use the theme-ui `css` function
- instead of using a jsx pragma, I want to be able to easily add `sx` props
  and appropriate types to components
- i want to create a lint rule that errors if you pass internal css properties
  via `sx` prop to any components whose name doesn't start with `Styled`,
  and to ensure any `Styled` components only contain a single tag.
- i'd like to use 
- i'm going to recommend avoiding the `styled.tag` functions. They can save you
  a few lines, at the expense of vast complexity in types, and more difficulty
  in refactoring. The one reason you might want to use them is for nested
  styles, e.g. when modifying styles in response to :hover on a parent tag.

interface ButtonProps {
  sx: SxProp
}

function Button(props: ButtonProps) {
  return (
    <StyledButton css={css(props.sx)}>

    </StyledButton>
  )
}

- use a `_` in a component name to indicate that it must be nested within a
  parent component to work as expected

it's not just vanilla style properties that sometimes need to read values from
themes. react component props also need scales for props

e.g. if you have a `<Caret>` component, you'll probably want to be able to
     specify named colors for the `color` prop, even though `color` is not
     being used as a standard css prop.

variants should be able to define nested variants

e.g. a `lowProfile` variant for <Bar> should also be able to define the default
     props for button variants

a `default` variant specifies prop values for each type of component

---

this whole nested variant thing makes a lot of sense, if I can find a way to
build it

<Bar variants={['lowProfile', 'darkBackground']}>
  <Button variants={['raised', 'rounded', 'primaryBackground']}>
    <Icon glyph='globe' />
      // color should be 'icon' or 'label', whichever is available on this variant
    <Label>EN</Label>
    <Caret />
  </Button>
</Bar>

variants are basically like classes, but they allow you to set custom
presentation props along with vanilla css properties, and they allow you to
target nested custom components and *their* custom presentation props.

what advantage does this have over plain old css classes? I'm not sure it has
any really...

okay, here's what we do...

we create separate fucking styled components for each style of button and bar.

refactor later.

still use `css` props for positioning. try and stick to the "external styles
vs internal styles" idea so that we can add a lint rule later.

no variants, just props. components are variants. just create a new component
if there's no obvious/easy way to add an appropriate prop.

colors can be passed in via prop if necessary via names. that's the only place
where variants really make sense, but the color variants can be defined within
the components themselves for now. themes aren't necessary.

<Caret width />

LowProfileBar
<LowProfileBarButton caret iconWidth>

IconButtonBar
IconButton

bars are just flex boxes. you can wrap bar controls with
layout components that get them to stretch their inherent height to fit
  the bar, align the items left/right, center the inherent height within
  the bar, etc.


base layer.

initially when putting a styled component together, don't pull colors/sizes/
etc. out of the theme at all. let the base styled components be independent
of context, w/ props for everything

second layer.

combine styled components together, reading things from context and passing
props where required.

