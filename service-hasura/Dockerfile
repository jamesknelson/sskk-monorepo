FROM hasura/graphql-engine:v2.0.7.cli-migrations-v3

RUN mkdir -p /hasura-metadata
RUN mkdir -p /hasura-migrations

ADD metadata/* /hasura-metadata/
ADD migrations/* /hasura-migrations/

CMD graphql-engine serve --server-port $PORT