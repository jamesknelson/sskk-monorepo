drop trigger "update_post_version" on post_versions;
drop function "trigger_update_post_version";

drop trigger "update_post_after_publish" on post_versions;
drop function "trigger_update_post_after_publish";

drop trigger "update_post" on posts;
drop function "trigger_update_post";

drop function "profile_published_posts";
drop function "profile_published_posts_by_slug";
drop view "published_posts";