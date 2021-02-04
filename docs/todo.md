todo

- user sidebar
- notetaking-style editor layout

- add a loading bar

- mark unpublished changes on the story card header, and the editor footer
- add minimum character counter: you need at least 140 characters to publish
  (but not to save draft)

- add a drop-down switch to set post to private/unlisted/listed (i.e. on member page)/discoverable (i.e. on front page),
  by default is private, and publishing sets to discoverable
- allow viewing of unlisted urls when you have the link -- urls are unlisted by default (not private)
- don't add links to private urls

- create links for front page to different days

- move date conversion for published_at into apollo

- allow language selection in editor
- use word wrap by default in the editor
- don't allow code as last block in document
- try to disable headings at the top of the document schema - only allow title or non-heading
- fix copy/paste from notes into the editor
  * paragraph break get broken up
  * turn ``` ``` blocks into markdown
  * turn `-` or `--` or etc. paragraphs into horizontal rules

- change password
- set display name
- set profile photo
- recover account
- join page

- update the registration handler to create a profile w/ avatar url
  generated from email, and display name taken from part of email
  before the "@" sign

- "writing prompts" area, where you can quickly just add a title or idea

- figure out messaging
- figure out quote tweeting

- refactor "profile" name to "persona"

- "read more" pagination button

- sticky the editor toolbar to top

- profile page redesign
- GitHub-style graph of when you've posted

- attempting to close while there are unsaved changes should show a warning
- when there are changes, should automatically save a draft after x seconds of
  no typing, or after x seconds -- whichever comes first
- add dropdown to publish button that allows you to choose the date
- add a toggle switch to the dashboard that allows you to show/hide drafts
- daily pages and links from the front page to daily pages
- only show 31 stories at a time on profile page; add pagination for now
  (eventually we'll want to use an archive)

- move hasura instance to render
  * https://community.render.com/t/migrating-postgresql-from-heroku-to-render/386
- add cache headers to public pages

- add a link next to "legal" called "join in", with a poem and a form that
  asks you for your name, your email, your desired handle, and your first story.

- figure out why the fallback router is catching all top-level routes

- add an editor card at the top of the dashboard, and make it so clicking
  anything on the dashboard brings up an editor around it
- reimplement editor menu as React component
- fix navigation to 404; it should display a 404 message
- redirect to onboarding screen for users without a profile or username (usernames are free initially)
- edit profile page, with profile photo
- account settings (edit password, email)

- rename "post" to "story" within db, etc.
- rename "profile" to "persona" within db, etc.
- figure out why React.HTMLAttributes can't be assigned to <div> props

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
