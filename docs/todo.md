todo

o stop storing content as HTML, start storing it as a strict subset of the editor json

o ensure failed publishes don't jam the tab, or in production, actually show up in the UI
o fix publishing updates
o can add a `toReact` function to schema to use if available, instead of `toDOM`
o add codemirror editor to the editor
o add code highlighter react component
o hide slug field - autogenerate slug from title (if it exists) for now

- add editor styles to make it look like a card, with your name and publish date
  (or "draft" marker) above the editor, and the menu floating above it. move
  the save draft and publish button inside the menu
- auto-fill the date field with the next available date for publication

- if no draft exists, first save a draft when hitting "publish update"
- button to cancel things queued for publish

- show "updated at" on card if it has been updated

- add some basic styles on login form, dashboard

- profile pages
- individual post pages

- move to hosting with no startup time

- ensure <meta> tags work well

- daily pages and links from the front page to daily pages

- reimplement editor menu as React component

- put a poem on the "legal" page
- fix navigation to 404; it should display a 404 message
- improved layout
- redirect to onboarding screen for users without a profile or username (usernames are free initially)
- edit profile page
- account settings (edit password, email)

- get images working, with image upload, drag and drop
- youtube embed
- allow selection of editor language
- allow highlight of individual editor lines
- hashtags + footer block
- mentions

- invite a friend page (each user has x invites)

- clear cache on logout

- make it so any edits to a post count as a new post, and basically republish
  the updated post. they also show version history, and let you comment on
  why it is you've published an update.

- add a trigger to find slug collisions 
- for find-by-slug, check the posts table first, as it's possible for a
  published article to have a newer draft with a conflicting slug

- server side auth
