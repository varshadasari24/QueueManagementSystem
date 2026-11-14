export const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Queue Management System API is running',
    timestamp: new Date().toISOString(),
  });
};
