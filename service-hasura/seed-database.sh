hasura-cli md apply --endpoint https://localhost:$PORT/v1/graphql
hasura-cli migrate apply --database-name default --endpoint https://localhost:$PORT/v1/graphql