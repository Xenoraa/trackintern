import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Student from "../models/student.js";
import InstitutionSupervisor from "../models/institutionSupervisor.js";
import IndustrySupervisor from "../models/industrySupervisor.js";
import HOD from "../models/hod.js";
import SIWESCoordinator from "../models/siwesCoordinator.js";
import VerificationCode from "../models/VerificationCode.js";


// -----------------------------------
// 🔐 Generate JWT Token
// -----------------------------------
const generateToken = (user, role) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


// -----------------------------------
// 🧑‍🎓 Student Signup
// -----------------------------------
const studentSignup = async (req, res) => {
  try {
    const { fullName, email, verificationCode, password } = req.body;

    if (!fullName || !email || !verificationCode || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const codeExists = await VerificationCode.findOne({
      where: { email, code: verificationCode },
    });

    if (!codeExists) {
      return res.status(400).json({ error: "Invalid or expired verification code" });
    }

    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ error: "Student already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(student, "student");

    res.status(201).json({
      message: "Student registered successfully",
      token,
      user: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        role: "student",
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Student signup failed" });
  }
};


// -----------------------------------
// 🔐 Login for supervisors, HOD, SIWES, etc.
// -----------------------------------
const roleLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Email, password & role required" });
    }

    let UserModel;

    switch (role) {
      case "institutionSupervisor":
        UserModel = InstitutionSupervisor;
        break;
      case "industrySupervisor":
        UserModel = IndustrySupervisor;
        break;
      case "hod":
        UserModel = HOD;
        break;
      case "siwesCoordinator":
        UserModel = SIWESCoordinator;
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Incorrect password" });

    const token = generateToken(user, role);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};


// -----------------------------------
// 🧑‍🎓 Student Login (Separate Endpoint)
// -----------------------------------
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const student = await Student.findOne({ where: { email } });
    if (!student) return res.status(400).json({ error: "Student not found" });

    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword)
      return res.status(401).json({ error: "Incorrect password" });

    const token = generateToken(student, "student");

    res.json({
      message: "Login successful",
      token,
      user: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        role: "student",
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Student login failed" });
  }
};


// -----------------------------------
// 📩 Verify Student Email (Code Check)
// -----------------------------------
const verifyStudentEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const record = await VerificationCode.findOne({ where: { email, code } });

    if (!record) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    res.json({ message: "Verification successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
};


// -----------------------------------
// 🔎 Verify Token
// -----------------------------------
const verifyToken = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ error: "No user data found" });

    const { id, role } = req.user;

    let userData;

    switch (role) {
      case "student":
        userData = await Student.findByPk(id, { attributes: { exclude: ["password"] } });
        break;
      case "institutionSupervisor":
        userData = await InstitutionSupervisor.findByPk(id, { attributes: { exclude: ["password"] } });
        break;
      case "industrySupervisor":
        userData = await IndustrySupervisor.findByPk(id, { attributes: { exclude: ["password"] } });
        break;
      case "hod":
        userData = await HOD.findByPk(id, { attributes: { exclude: ["password"] } });
        break;
      case "siwesCoordinator":
        userData = await SIWESCoordinator.findByPk(id, { attributes: { exclude: ["password"] } });
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    if (!userData)
      return res.status(404).json({ error: "User not found" });

    res.json({
      message: "Token is valid",
      user: { ...userData.toJSON(), role },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Token verification failed" });
  }
};


// -----------------------------------
// 🧑‍💼 Register any supervisor role
// -----------------------------------
const registerRole = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role)
      return res.status(400).json({ error: "All fields required" });

    let UserModel;

    switch (role) {
      case "institutionSupervisor":
        UserModel = InstitutionSupervisor;
        break;
      case "industrySupervisor":
        UserModel = IndustrySupervisor;
        break;
      case "hod":
        UserModel = HOD;
        break;
      case "siwesCoordinator":
        UserModel = SIWESCoordinator;
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "User already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user, role);

    res.status(201).json({
      message: `${role} registered successfully`,
      token,
      user: {
        id: user.id,
        email: user.email,
        role,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};


// -----------------------------------
// 📤 Export ALL Controllers Cleanly
// -----------------------------------
export {
  studentSignup,
  studentLogin,
  roleLogin,
  verifyStudentEmail,
  verifyToken,
  registerRole,
};
