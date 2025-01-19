const cron = require("node-cron");

cron.schedule("* * * * *", () => {
  console.log(`Cron job running at ${new Date().toISOString()}`);
});

console.log("Cron job scheduled to run every minute.");

module.exports = cron;
