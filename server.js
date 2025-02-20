const app = require("./src/app");
const { PORT } = require("./src/config/index");
const { logger } = require("./src/models/logger");

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server is running on http://0.0.0.0:${PORT}`);
});
