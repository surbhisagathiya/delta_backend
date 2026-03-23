import app from "./app.js";
import connectDB from "./config/db.js";
import seedAdmin from "./utils/seedAdmin.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("[Server] MongoDB connected");
    seedAdmin();
    console.log("[Server] Default admin seeded");

    app.listen(PORT, () => {
      console.log(`[Server] Listening at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[Server] MongoDB connection failed:", error.message);
  });