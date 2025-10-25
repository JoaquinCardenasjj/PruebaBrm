const logger = require("../../utils/logger");

const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`, err.stack);
    logger.error(`Error general ${err.message}`);
    res.status(err.status || 500).json({
      message: err.message || "Error interno del servidor",
    });
  };
  
  module.exports = errorHandler;
  