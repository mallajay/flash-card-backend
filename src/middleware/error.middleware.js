/* eslint-disable no-unused-vars */
// 404 Handler
export const notFound = (req, res, next) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`,
  });
};

// Central Error Handler
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
