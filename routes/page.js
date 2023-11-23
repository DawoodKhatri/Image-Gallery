import { Router } from "express";
import { homePage, imageEditPage, imagesPage } from "../controllers/page.js";
import authCheck from "../middlewares/authCheck.js";

const router = Router();

router.get("/", authCheck, homePage);
router.get("/images", authCheck, imagesPage);
router.get("/images/:imageId", authCheck, imageEditPage);

export default router;
