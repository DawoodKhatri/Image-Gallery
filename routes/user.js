import { Router } from "express";
import { getDetails, login, logout } from "../controllers/user.js";
import authCheck from "../middlewares/authCheck.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/",authCheck, getDetails);

export default router;
