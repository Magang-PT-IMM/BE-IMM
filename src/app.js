const express = require("express");
const bodyParser = require("body-parser");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandlers");
const prisma = require("./application/database");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(notFoundHandler);
app.use(errorHandler);

process.on("SIGINT", async () => {
  console.log("Disconnecting Prisma...");
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
