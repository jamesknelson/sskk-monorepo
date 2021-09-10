FROM hasura/graphql-engine:v2.0.7.cli-migrations-v3

ADD ./metadata /hasura-metadata
ADD ./migrations /hasura-migrations

CMD graphql-engine serve --server-port $PORT