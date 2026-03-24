// src/controllers/userController.js
import User from "../models/User.js";
import { hashPassword } from "../utils/common.js";
import jwt from "jsonwebtoken";

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

//add user and edit user
export const upsertUser = async (req, res, next) => {
  try {
    const { id, name, email, password, role } = req.body;

    if (!name || !email || (!id && !password)) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    let user;

    if (id) {
      // Update existing user
      user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.name = name;
      user.email = email;
      if (password) {
        user.password = await hashPassword(password);
      }

      await user.save();
    } else {
      // Create new user
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const payload = {
        name,
        email,
        password: await hashPassword(password),
        role,
      };
      user = await User.create(payload);
    }

    res.status(id ? 200 : 201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const assignUser = async (req, res, next) => {
  try {
    const { userId, adminId } = req.body;

    if (!userId || !adminId) {
      return res
        .status(400)
        .json({ message: "Please provide userId and adminId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.adminId = adminId;
    await user.save();

    res.status(200).json({ message: "User assigned to admin", user });
  } catch (err) {
    next(err);
  }
};

//get all admin user data & case handle
export const getUsersData = async (req, res, next) => {
  try {
    console.log("Fetching admin data...");
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find({ role: "user" }).select("-password");

    res.status(200).json({
      total: users.length,
      data: users,
    });

  } catch (err) {
    next(err);
  }
};
