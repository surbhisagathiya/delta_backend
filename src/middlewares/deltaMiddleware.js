import axios from "axios";
import crypto from "crypto";

export const deltaConnect = async (req, res, next) => {
  const DELTA_API_BASE = process.env.DELTA_API_BASE; // https://api.india.delta.exchange
  const DELTA_API_KEY = process.env.DELTA_API_KEY;
  const DELTA_API_SECRET = process.env.DELTA_API_SECRET;

  try {
    const method = "GET";
    const path = "/v2/profile";
    const query_string = "";
    const body = "";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    console.log(
      "Signing String:",
      method + timestamp + path + query_string + body,
    );

    const signature = crypto
      .createHmac("sha256", DELTA_API_SECRET)
      .update(method + timestamp + path + query_string + body)
      .digest("hex");

    const url = `${DELTA_API_BASE}${path}`;
    console.log("Delta Connect URL:", url);
    const response = await axios.get(url, {
      headers: {
        "api-key": DELTA_API_KEY,
        signature: signature,
        timestamp: timestamp,
        "User-Agent": "node-js-v20-client",
        "Content-Type": "application/json",
      },
    });

    console.log("Delta Connect response:", response.data);
    res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    console.error("Delta Connect Error:", err.response?.data || err.message);
    next(err);
  }
};
