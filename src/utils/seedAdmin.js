// src/utils/seedAdmin.js
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
  } catch (err) {
    console.error("Error seeding admin:", err);
  }
};

export default seedAdmin;