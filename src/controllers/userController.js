// src/controllers/userController.js
import User from "../models/User.js";

// @desc Get current user
// @route GET /api/me
export const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc Get all users (Admin only)
// @route GET /api/users
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// @desc Get all users (public or for testing)
// @route GET /api/users/all
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.status(200).json({
      total: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};