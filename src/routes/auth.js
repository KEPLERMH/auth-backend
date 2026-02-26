import { Router } from "express";
import { protec } from "../middleware/auth.js";
import {
  userLogin,
  userLogout,
  userMe,
  userRegister,
} from "../controllers/auth.controllers.js";

const router = Router();

//Register
router.post("/register", userRegister);

//login
router.post("/login", userLogin);

//Me
router.get("/me", protec, userMe);

//Logout
router.post("/logout", userLogout);

export default router;
