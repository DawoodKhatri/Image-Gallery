import User from "../models/user.js";
import Image from "../models/image.js";
import { deleteFile, getFileStream, upload } from "../utils/storage.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

export const getImages = async (req, res) => {
  try {
    if (!req.isLoggedIn)
      return res
        .status(400)
        .json({ success: false, message: "Please Login First" });

    const user = await User.findOne({ email: req.user.email }).populate(
      "images"
    );
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Please Login Again" });

    return res.status(200).json({ success: true, images: user.images });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getImageDetails = async (req, res) => {
  try {
    if (!req.isLoggedIn)
      return res
        .status(400)
        .json({ success: false, message: "Please Login First" });

    const user = await User.findOne({ email: req.user.email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Please Login Again" });

    const { imageId } = req.params;

    const image = await Image.findById(imageId);
    if (!image)
      return res
        .status(404)
        .json({ success: false, message: "Image not Found" });

    return res.status(200).json({ success: true, image });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const streamImage = async (req, res) => {
  try {
    if (!req.isLoggedIn)
      return res
        .status(400)
        .json({ success: false, message: "Please Login First" });

    const user = await User.findOne({ email: req.user.email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Please Login Again" });

    const { imagePath } = req.params;

    const image = await Image.findOne({ path: imagePath });
    if (!image)
      return res
        .status(404)
        .json({ success: false, message: "Image not Found" });

    if (!user.images.includes(image._id))
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Access" });

    const { name, path } = image;

    let fileStream;
    if (process.env.NODE_ENV === "development") {
      fileStream = fs.createReadStream(`${__dirname}/images/${path}`);
    } else {
      fileStream = getFileStream("Images/" + path);
    }

    return fileStream.pipe(
      res
        .status(200)
        .setHeader("Content-disposition", `attachment; filename=${name}`)
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const addImage = async (req, res) => {
  try {
    if (!req.isLoggedIn)
      return res
        .status(400)
        .json({ success: false, message: "Please Login First" });

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Image not Selected" });

    const { originalname: name, mimetype: mimeType, size } = req.file;

    const user = await User.findOne({ email: req.user.email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Please Login Again" });

    const image = await Image.create({ name, mimeType, size });

    const uniqueFileName =
      image._id + Date.now() + "." + name.split(".").slice(-1)[0];

    if (process.env.NODE_ENV === "development") {
      fs.writeFileSync(
        `${__dirname}/images/${uniqueFileName}`,
        req.file.buffer
      );
    } else {
      await upload("Images", uniqueFileName, req.file.buffer, mimeType);
    }

    image.path = uniqueFileName;
    user.images.push(image._id);
    await image.save();
    await user.save();

    return res.status(200).json({ success: true, message: "Image Added" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateImage = async (req, res) => {
  try {
    if (!req.isLoggedIn)
      return res
        .status(400)
        .json({ success: false, message: "Please Login First" });

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "Image not Selected" });

    const { originalname: name, mimetype: mimeType, size } = req.file;

    const user = await User.findOne({ email: req.user.email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Please Login Again" });

    const { imageId } = req.params;

    const image = await Image.findById(imageId);
    if (!image)
      return res
        .status(404)
        .json({ success: false, message: "Image not Found" });

    const uniqueFileName =
      image._id + Date.now() + "." + name.split(".").slice(-1)[0];

    if (process.env.NODE_ENV === "development") {
      fs.rmSync(`${__dirname}/images/${image.path}`);

      fs.writeFileSync(
        `${__dirname}/images/${uniqueFileName}`,
        req.file.buffer
      );
    } else {
      await deleteFile(
        image.path.includes("Images/") ? image.path : "Images/" + image.path
      );

      await upload("Images", uniqueFileName, req.file.buffer, mimeType);
    }

    image.path = uniqueFileName;
    image.name = name;
    image.mimeType = mimeType;
    image.size = size;

    await image.save();

    return res.status(200).json({ success: true, message: "Image Updated" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteImage = async (req, res) => {
  try {
    if (!req.isLoggedIn)
      return res
        .status(400)
        .json({ success: false, message: "Please Login First" });

    const user = await User.findOne({ email: req.user.email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Please Login Again" });

    const { imageId } = req.params;

    const image = await Image.findByIdAndDelete(imageId);
    if (!image)
      return res
        .status(404)
        .json({ success: false, message: "Image not Found" });

    if (process.env.NODE_ENV === "development") {
      fs.rmSync(`${__dirname}/images/${image.path}`);
    } else {
      await deleteFile(
        image.path.includes("Images/") ? image.path : "Images/" + image.path
      );
    }

    user.images.splice(user.images.indexOf(imageId), 1);
    await user.save();

    return res.status(200).json({ success: true, message: "Image Deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
