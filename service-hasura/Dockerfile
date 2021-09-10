FROM hasura/graphql-engine:v2.0.7.cli-migrations-v3

VOLUME ./metadata /hasura-metadata
VOLUME ./migrations /hasura-migrations

CMD graphql-engine serve --server-port $PORT