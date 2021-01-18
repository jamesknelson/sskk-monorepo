todo

o create a "post" component which is used on the front page and dashboard
o put a poem on the "legal" page
o individual post pages
o show a warning before hitting delete
- meta description tag for home page
- switch hasura-prod to a paid dyno

- rename the "editor" directory to "prose"

- profile pages
- move to render hosting
  * https://community.render.com/t/migrating-postgresql-from-heroku-to-render/386

- figure out how to make the front page card look decent on mobile
- check how extra space at the end of a story is rendered
- Attempting to close while there are unsaved changes should show a warning

- daily pages and links from the front page to daily pages

- figure out why the fallback router is catching all top-level routes

- why does clicking a link scroll to top of page?
- move date conversion for published_at into apollo
- add a user dropdown with logout button, and use a button-styled link for "login"
- when there are changes, should automatically save a draft after x seconds of
  no typing, or after x seconds -- whichever comes first
- add an editor card at the top of the dashboard, and make it so clicking
  anything on the dashboard brings up an editor around it
- reimplement editor menu as React component
- fix navigation to 404; it should display a 404 message
- improved layout
- redirect to onboarding screen for users without a profile or username (usernames are free initially)
- edit profile page, with profile photo
- account settings (edit password, email)

- rename "post" to "story" within db, etc.
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
