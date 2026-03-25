// src/config/delta.js
import axios from "axios";
import crypto from "crypto";

const connectDelta = async () => {
  const BASE = process.env.DELTA_API_BASE;
  const KEY = process.env.DELTA_API_KEY;
  const SECRET = process.env.DELTA_API_SECRET;

  // 1️⃣ Fetch Delta server time
  let serverTime = null;
  try {
    const timeRes = await axios.get(`${BASE}/v2/time`);
    serverTime = parseInt(timeRes.data?.result?.server_time); // in seconds
    console.log("⏱ [Delta] Server time:", serverTime);
  } catch (err) {
    console.warn("⚠️ [Delta] Could not fetch server time:", err.message);
  }

  // 2️⃣ Local timestamp
  const localTimestamp = Math.floor(Date.now() / 1000);
  console.log("⏱ [Local]   Local timestamp:", localTimestamp);

  // 3️⃣ Check for drift if server time is available
  if (serverTime) {
    const drift = Math.abs(localTimestamp - serverTime);
    if (drift > 5) {
      console.warn(
        `⚠️ [Delta] Timestamp drift detected: ${drift} seconds! ` +
        `Your system clock may be out of sync.`
      );
    }
  }

  const method = "GET";
  const path = "/v2/profile";
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Generate signature
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(method + timestamp + path)
    .digest("hex");

  // DEBUG LOGGING
  console.log("🛠 [Delta DEBUG] Request details:");
  console.log({ BASE, method, path, timestamp, signature, apiKey: KEY });

  try {
    const response = await axios.get(`${BASE}${path}`, {
      headers: {
        "api-key": KEY,
        signature,
        timestamp,
        "User-Agent": "node-js-v20-client",
        "Content-Type": "application/json",
      },
    });

    console.log("✅ [Delta] Connected successfully");
    console.log("👤 User:", response.data?.result?.email || "N/A");

    return true;
  } catch (err) {
    console.error(
      "❌ [Delta] Connection failed:",
      err.response?.data || err.message
    );
    if (err.response?.headers) {
      console.log("📄 [Delta DEBUG] Response headers:", err.response.headers);
    }
    throw err;
  }
};

export default connectDelta;