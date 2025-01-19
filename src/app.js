const express = require("express");
const bodyParser = require("body-parser");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandlers");
const prisma = require("./application/database");
const { PORT } = require("./config/index");
const {
  authMiddleware,
  roleMiddleware,
} = require("./middleware/authMiddleware");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./routes/index");
const cron = require("./application/cron");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1", router);

app.use(notFoundHandler);
app.use(errorHandler);

process.on("SIGINT", async () => {
  console.log("Disconnecting Prisma...");
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
