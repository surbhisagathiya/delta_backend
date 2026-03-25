import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import connectDelta from "./src/config/delta.js";
import seedAdmin from "./src/utils/seedAdmin.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("[Server] MongoDB connected");

    // ✅ ADD THIS (chain Delta)
    return connectDelta();
  })
  .then(() => {
    console.log("[Server] Delta API connected");

    // ✅ keep your same logic
    seedAdmin();
    console.log("[Server] Default admin seeded");

    app.listen(PORT, () => {
      console.log(`[Server] Listening at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[Server] Startup failed:", error.message);
  });