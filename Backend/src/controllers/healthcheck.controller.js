import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import os from "os"; // For system insights

const healthcheck = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, {
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage(),
      loadAverage: os.loadavg(), // System load (1, 5, 15 min avg)
      message: "Server is healthy and running",
    }, "Health check successful")
  );
});

export { healthcheck };
