import { Router } from "express";

import { signup } from "./signup.controller.js";
import { login } from "./login.controller.js";
import { logout } from "./logout.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { me } from "./me.controller.js";

const router = Router();

// set cookie
router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, me);

router.get("/logout",protect,logout)

export default router;
