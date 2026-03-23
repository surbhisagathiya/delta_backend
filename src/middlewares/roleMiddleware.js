// src/middlewares/roleMiddleware.js

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin access only" });
};

export const user = (req, res, next) => {
  if (req.user) next();
  else res.status(403).json({ message: "User access only" });
};