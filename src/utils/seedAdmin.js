// src/utils/seedAdmin.js
import Settings from "../models/Settings.js";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@yopmail.com" });
    if (!adminExists) {
      const admin = await User.create({
        name: "Admin",
        email: "admin@yopmail.com",
        password: "Admin@123",
        role: "admin",
      });
      console.log("Default admin created:", admin.email);
    }

    const settingsExists = await Settings.findOne();
    if (!settingsExists) {
      const defaultSettings = await Settings.create({
        leverage: 15,
      });
      console.log(
        "Default settings created with leverage:",
        defaultSettings.leverage,
      );
    }
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
};

export default seedAdmin;