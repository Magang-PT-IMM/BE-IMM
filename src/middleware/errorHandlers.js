const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Resource not found",
      statusCode: 404,
    },
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
