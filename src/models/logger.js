const morgan = require("morgan");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const morganMiddleware = morgan(
  (tokens, req, res) => {
    const user = res.user ? res.user.name : "Guest";
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      "- User:",
      user,
      "- Response Time:",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  },
  { stream: { write: (message) => logger.info(message.trim()) } }
);

module.exports = { logger, morganMiddleware };
