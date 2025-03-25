function sendErrorDev(err, req, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, req, res) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;

  if (process.env.NODE_ENV == "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV == "production") {
    sendErrorProd(err, req, res);
  }
  next();
};
