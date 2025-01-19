const app = require("./src/app");
const { PORT } = require("./src/config/index");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
