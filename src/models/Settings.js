import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    leverage: {
      type: Number,
      required: true,
      default: 15,
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;