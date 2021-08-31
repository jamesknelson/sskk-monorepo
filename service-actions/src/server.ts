import express from "express";

async function main() {
  const app = express();
  const PORT = process.env.PORT || 8000;
  app.use(
    "/actions",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );
  app.listen(PORT, () => {
    console.log(`⚡️[sskk-actions]: Server is running on port ${PORT}`);
  });
}

main();
