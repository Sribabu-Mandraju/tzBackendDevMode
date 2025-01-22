import rateLimit from 'express-rate-limit';

export const ipRateLimiter = (allowedIp) => {
  // Rate limiting setup: Limit to 20 requests per IP address for 1 hour
  return rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
    max: 30, // Limit each IP to 20 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    handler: (req, res) => {
      if (req.ip !== allowedIp) {
        return res.status(403).json({ message: "Forbidden: Invalid IP address" });
      }
      res.status(429).json({ message: "Too many requests, try again later" });
    }
  });
};
