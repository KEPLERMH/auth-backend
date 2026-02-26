import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protec = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "not authorized, no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //{id:5}
    const user = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [decoded.id],
    );
    if (user.rows.length === 0) {
      res.status(401).json({ message: "Not autorized, token failed" });
    }
    req.user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: "Not autorized, Token filed" });
  }
};
