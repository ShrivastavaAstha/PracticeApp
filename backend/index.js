const express = require("express");
const app = express();
app.use(express.json());
const { connectDatabase } = require("./connection/connect");

const PORT = 5000;
connectDatabase();
app.listen(PORT, async () => {
  await console.log(`Server is running at ${PORT}`);
});
