import VerificationCode from "../models/VerificationCode.js";

// Generate a new verification code
export const generateCode = async (req, res) => {
  try {
    const { code } = req.body;

    const newCode = await VerificationCode.create({
      code,
      isUsed: false,
    });

    res.status(201).json({
      message: "Verification code generated",
      newCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate verification code" });
  }
};

// Verify a student's code
export const verifyCode = async (req, res) => {
  try {
    const { code } = req.body;

    const exist = await VerificationCode.findOne({ where: { code } });

    if (!exist)
      return res.status(404).json({ error: "Invalid verification code" });

    if (exist.isUsed)
      return res.status(400).json({ error: "Code already used" });

    exist.isUsed = true;
    await exist.save();

    res.json({ message: "Verification successful", exist });
  } catch (err) {
    res.status(500).json({ error: "Verification failed" });
  }
};

// Get all codes
export const getCodes = async (req, res) => {
  try {
    const codes = await VerificationCode.findAll();
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch verification codes" });
  }
};
