const app = require("./src/app");
const { PORT } = require("./src/config/index");
const { logger } = require("./src/models/logger");

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
