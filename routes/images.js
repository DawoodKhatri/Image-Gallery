import { Router } from "express";
import fileHandler from "../middlewares/fileHandler.js";
import authCheck from "../middlewares/authCheck.js";
import {
  getImages,
  getImageDetails,
  streamImage,
  addImage,
  deleteImage,
  updateImage,
} from "../controllers/images.js";

const router = Router();

router.get("/", authCheck, getImages);
router.get("/:imageId", authCheck, getImageDetails);
router.get("/download/:imagePath", authCheck, streamImage);
router.post("/", authCheck, fileHandler, addImage);
router.put("/:imageId", authCheck, fileHandler, updateImage);
router.delete("/:imageId", authCheck, fileHandler, deleteImage);

export default router;
