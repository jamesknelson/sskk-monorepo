FROM hasura/graphql-engine:v2.0.7.cli-migrations-v3

RUN -v ./metadata:/hasura-metadata -v ./higrations:/hasura-migrations

CMD graphql-engine serve --server-port $PORT