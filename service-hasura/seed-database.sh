curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
hasura migrate apply --endpoint https://localhost:$PORT/v1/graphql
hasura md apply --endpoint https://localhost:$PORT/v1/graphql