import app from './app'

async function main() {
  const PORT = process.env.PORT || 8000;
  
  app.listen(PORT, () => {
    console.log(`⚡️[sskk-actions]: Server is running on port ${PORT}`);
  });
}

main();
