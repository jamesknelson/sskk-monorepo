todo

o stop storing content as HTML, start storing it as a strict subset of the editor json

o ensure failed publishes don't jam the tab, or in production, actually show up in the UI
o fix publishing updates

- add codemirror editor to the editor
- can add a `toReact` function to schema to use if available, instead of `toDOM`, use
  it to render highlighted code

- auto-fill the date field with the next available date for publication

- save a draft on publish
- button to cancel things queued for publish
- delete button

- add some basic styles on login form, dashboard

- profile pages
- daily pages and links from the front page to daily pages
- individual post pages

- move to hosting with no startup time

- ensure <meta> tags work well

- put a poem on the "legal" page
- fix navigation to 404; it should display a 404 message
- improved layout

- can make it possible to automatically add `toDOM` functions to a schema that
  render the `toReact` content using a React component
- redirect to onboarding screen for users without a profile or username (usernames are free initially)
- edit profile page
- account settings
- invite a friend page (each user has x invites)

- clear cache on logout

- add a trigger to find slug collisions 
- for find-by-slug, check the posts table first, as it's possible for a
  published article to have a newer draft with a conflicting slug

- server side auth
