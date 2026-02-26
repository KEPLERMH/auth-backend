import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Plese provide all requiered fields" });
  }

  const userExiste = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (userExiste.rows.length > 0) {
    return res.status(400).json({ message: "User aldready exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await pool.query(
    "INSERT INTO users (name,email,password) values ($1, $2, $3) RETURNING id,name,email",
    [name, email, hashedPassword],
  );
  const token = generateToken(newUser.rows[0].id);
  res.cookie("token", token, cookieOptions);
  res.status(201).json({ user: newUser.rows[0] });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Plase provide all the requiered fields" });
  }

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]); //rows:[{}]
  if (user.rows.length === 0) {
    return res.status(400).json({ message: "Invalid credencials" });
  }
  const userData = user.rows[0];
  const isMatch = bcrypt.compare(password, userData.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credencials" });
  }

  const token = generateToken(userData.id);
  res.cookie("token", token, cookieOptions);
  res.json({
    user: { id: userData.id, name: userData.name, email: userData.email },
  });
};

export const userMe = (req, res) => {
  res.json(req.user);
};

export const userLogout = (req, res) => {
  res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
  res.json({ message: "Logged out successfully" });
};
