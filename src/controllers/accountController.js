// src/controllers/accountController.js
import axios from "axios";
import Account from "../models/Account.js";
import User from "../models/User.js";
import crypto from "crypto";

export const getAdminAccounts = async (req, res, next) => {
  try {
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const accountList = await Account.find({
      assignedTo: admin._id,
    }).populate("assignedTo", "name email");

    console.log("accountList", accountList);

    const DELTA_API_BASE = process.env.DELTA_API_BASE;

    const accountsWithBalance = await Promise.all(
      accountList.map(async (account) => {
        let balance = 0;

        try {
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const method = "GET";
          const path = "/v2/orders";

          const signaturePayload = method + timestamp + path;

          // Use the account's apiSecret here
          const signature = crypto
            .createHmac("sha256", process.env.DELTA_API_SECRET)
            .update(signaturePayload)
            .digest("hex");

          const response = await axios.get(`${DELTA_API_BASE}${path}`, {
            headers: {
              "api-key": process.env.DELTA_API_KEY,
              signature,
              timestamp,
              Accept: "application/json",
            },
          });

          if (response.data.success && Array.isArray(response.data.result)) {
            balance = response.data.result.reduce(
              (sum, asset) => sum + parseFloat(asset.balance),
              0,
            );
          }
        } catch (err) {
          console.error(
            `Error fetching Delta balance for account ${account.name}:`,
            err.message,
          );
        }

        return {
          _id: account._id,
          name: account.name,
          apiKey: account.apiKey,
          balance, // live balance from Delta
          assignedTo: account.assignedTo,
          createdBy: account.createdBy,
          status: account.status,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
        };
      }),
    );

    console.log("\nAll accounts processed. Sending response.");

    res.status(200).json({
      success: true,
      total: accountsWithBalance.length,
      data: accountsWithBalance,
    });
  } catch (err) {
    console.error("getAccounts Error:", err.message);
    next(err);
  }
};

export const upsertAccount = async (req, res, next) => {
  try {
    const { id, name, apiKey, assignedTo } = req.body;

    const adminid = req.user._id;
    console.log("Admin ID:", adminid);

    if (!name || !apiKey) {
      return res.status(400).json({ message: "Name and API Key are required" });
    }

    let account;
    if (id) {
      account = await Account.findByIdAndUpdate(
        id,
        {
          name,
          apiKey,
          assignedTo: assignedTo || adminid,
          balance: 0,
        },
        { new: true },
      );
    } else {
      account = await Account.create({
        name,
        apiKey,
        assignedTo: assignedTo || adminid,
        balance: 0,
        createdBy: adminid,
      });
    }

    res.status(200).json({ success: true, data: account });
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.params;

    const account = await Account.findByIdAndDelete(id);

    if (!account) return res.status(404).json({ message: "Account not found" });

    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};

//assign account to user
export const assignAccount = async (req, res) => {
  try {
    const { accountId, userId } = req.body;
    console.log("acc", accountId, userId);

    if (!accountId || !userId) {
      return res
        .status(400)
        .json({ message: "accountId and userId are required" });
    }

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.assignedTo = userId;
    await account.save();

    res.status(200).json({ success: true, data: account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//un assign account to user
export const unAssignAccount = async (req, res) => {
  try {
    const { accountId } = req.body;
    console.log("acc", accountId);
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const adminId = admin?._id;

    if (!accountId) {
      return res.status(400).json({ message: "accountId are required" });
    }

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.assignedTo = adminId;
    await account.save();

    res
      .status(200)
      .json({ success: true, data:account, message: "user assign to admin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
