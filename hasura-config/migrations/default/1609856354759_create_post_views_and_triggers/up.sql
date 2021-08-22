CREATE VIEW published_posts AS
SELECT
  posts.id,
  posts.profile_id,
  posts.published_at as published_at,
  post_versions.slug,
  post_versions.content,
  (case
    when post_versions.updated_at < posts.published_at
    then null
    else post_versions.updated_at
  end) as updated_at
FROM posts
INNER JOIN post_versions ON (posts.latest_version_id = post_versions.id)
WHERE
  posts.published_at is not null
  AND posts.published_at <= now()
  AND posts.deleted_at is null
ORDER BY
  posts.published_at DESC,
  posts.ranking DESC;

create function profile_published_posts_by_slug(profile_row profiles, p_slug text)
RETURNS SETOF published_posts AS $$
  SELECT published_posts.*
  FROM post_versions
  INNER JOIN published_posts ON (published_posts.id = post_versions.post_id)
  WHERE
    post_versions.slug = p_slug
    AND post_versions.locked_for_publication is true
    AND published_posts.profile_id = profile_row.id
  ORDER BY post_versions.updated_at DESC
  LIMIT 1;
$$ LANGUAGE sql STABLE;

create function profile_published_posts(profile_row profiles)
RETURNS SETOF published_posts AS $$
  SELECT published_posts.*
  FROM posts
  INNER JOIN published_posts ON (posts.id = published_posts.id)
  WHERE posts.profile_id = profile_row.id
  ORDER BY posts.published_at DESC
$$ LANGUAGE sql STABLE;

---

CREATE FUNCTION trigger_update_post_version()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.locked_for_publication IS true)
  THEN
    RAISE EXCEPTION 'cannot update post_versions if locked_for_publication';
  END IF;

  NEW.updated_at = NOW();

  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_post_version
  BEFORE UPDATE ON post_versions
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_update_post_version();

---

CREATE FUNCTION trigger_update_post()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.published_at <> NEW.published_at)
  THEN
    IF (OLD.published_at IS NOT NULL and OLD.published_at < NOW())
    THEN
      RAISE EXCEPTION 'cannot update posts.published_at after publication';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_post
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_update_post();

---

CREATE FUNCTION trigger_update_post_after_publish()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts 
  SET
    latest_version_id = NEW.id,
    latest_version_locked_for_publication = NEW.locked_for_publication,
    latest_version_slug = NEW.slug
  WHERE
    id = NEW.post_id;
  
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_post_after_publish
  AFTER INSERT OR UPDATE ON post_versions
  FOR EACH ROW
  WHEN (NEW.locked_for_publication IS true)
  EXECUTE PROCEDURE trigger_update_post_after_publish();
