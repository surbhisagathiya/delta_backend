// src/controllers/deltaController.js
import axios from "axios";
import crypto from "crypto";

const getProductId = async (symbol, DELTA_API_BASE) => {
  // Fetch all tickers to map symbol -> numeric product_id
  const response = await axios.get(`${DELTA_API_BASE}/v2/tickers`);
  const product = response.data.result.find((t) => t.symbol === symbol);
  if (!product) throw new Error(`Symbol ${symbol} not found`);
  return product.product_id;
};

export const getTicker = async (req, res, next) => {
  const { symbol } = req.params; // e.g., "ETHUSD"

  const DELTA_API_BASE = process.env.DELTA_API_BASE;

  try {
    const url = `${DELTA_API_BASE}/v2/tickers`;

    // Request all tickers
    const response = await axios.get(url);

    // Filter only ETHUSD, BTCUSD, PAXGUSD
    const filteredSymbols = ["ETHUSD", "BTCUSD", "PAXGUSD"];
    const tickers = response?.data?.result?.filter((t) =>
      filteredSymbols.includes(t.symbol),
    );

    if (!tickers || tickers.length === 0) {
      return res.status(404).json({ message: "Ticker not found" });
    }

    // Map to the format you need: Ticker, Last, Chg%, Mark
    const mapped = tickers.map((ticker) => ({
      symbol: ticker.symbol,
      last: ticker.close,
      changePercent:
        ticker.open && ticker.close
          ? `${(((ticker.close - ticker.open) / ticker.open) * 100).toFixed(2)}`
          : "+0.00",
      mark: Number(ticker.mark_price).toFixed(2),
      bid: ticker.quotes?.best_bid,
      ask: ticker.quotes?.best_ask,
      leverage: ticker.leverage,
      product_id: ticker.product_id,
    }));

    res.status(200).json({ success: true, data: mapped }); // ✅ send mapped data
  } catch (err) {
    console.error("getTicker Error:", err.message);
    next(err);
  }
};

export const getPositions = async (req, res, next) => {
  const { symbol } = req.params;
  console.log("getPositions called with symbol:", symbol);
  if (!symbol) {
    return res.status(400).json({ message: "symbol query param is required" });
  }

  const DELTA_API_BASE = process.env.DELTA_API_BASE;
  const DELTA_API_KEY = process.env.DELTA_API_KEY;
  const DELTA_API_SECRET = process.env.DELTA_API_SECRET;

  const product_id = await getProductId(symbol, DELTA_API_BASE);

  if (!product_id) {
    return res
      .status(400)
      .json({ message: "product_id query param is required" });
  }

  try {
    // Define required variables for signature
    const method = "GET";
    const path = "/v2/positions";
    const query = `?product_id=${product_id}`;
    const body = "";
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const signaturePayload = method + timestamp + path + query + body;

    // Generate HMAC-SHA256 signature
    const signature = crypto
      .createHmac("sha256", DELTA_API_SECRET)
      .update(signaturePayload)
      .digest("hex");

    const url = `${DELTA_API_BASE}/v2/positions`;

    const response = await axios.get(url, {
      headers: {
        "api-key": DELTA_API_KEY,
        signature,
        timestamp,
        Accept: "application/json",
      },
      params: { product_id },
    });

    const result = response.data.result;
    console.log("Positions response:", result);

    // Normalize to array
    const positions = Array.isArray(result) ? result : [result];
    const mapped = positions.map((pos) => ({
      symbol: pos.symbol,
      size: pos.size,
      entry: pos.entry_price,
      upnl: pos.unrealized_pnl,
    }));

    res.status(200).json({
      success: true,
      total: mapped.length,
      data: mapped,
    });
  } catch (err) {
    console.error("getPositions Error:", err.message);
    next(err);
  }
};

export const getOpenOrders = async (req, res, next) => {
  const { symbol } = req.params;
  // console.log("getOpenOrders called with symbol:", symbol);
  if (!symbol) {
    return res.status(400).json({ message: "symbol query param is required" });
  }

  const DELTA_API_BASE = process.env.DELTA_API_BASE;
  const DELTA_API_KEY = process.env.DELTA_API_KEY;
  const DELTA_API_SECRET = process.env.DELTA_API_SECRET;

  const product_id = await getProductId(symbol, DELTA_API_BASE);

  if (!symbol) {
    return res.status(400).json({ message: "symbol query param is required" });
  }

  if (!DELTA_API_KEY || !DELTA_API_SECRET) {
    return res
      .status(500)
      .json({ message: "API Key or Secret not configured" });
  }

  try {
    const method = "GET";
    const path = "/v2/orders";
    const body = "";
    const query = `?product_id=${symbol}&status=open&page_size=50`;
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const signaturePayload = method + timestamp + path + query + body;
    const signature = crypto
      .createHmac("sha256", DELTA_API_SECRET)
      .update(signaturePayload)
      .digest("hex");

    const url = `${DELTA_API_BASE}/v2/orders`;

    const response = await axios.get(url, {
      headers: {
        "api-key": DELTA_API_KEY,
        signature,
        timestamp,
        Accept: "application/json",
      },
      params: { product_id: symbol, status: "open", page_size: 50 },
    });

    console.log("Open Orders response:", response.data);

    const mapped = response.data.result.map((order) => ({
      id: order.id,
      symbol: order.symbol,
      size: order.size,
      price: order.price,
      side: order.side,
      type: order.order_type,
      status: order.status,
      createdAt: order.created_at,
    }));

    res.status(200).json({
      success: true,
      total: mapped.length,
      data: mapped,
    });
  } catch (err) {
    console.error("getOpenOrders Error:", err.message);
    next(err);
  }
};
