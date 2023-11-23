import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename))

export const homePage = async (req, res) => {
  try {
    if (req.isLoggedIn) return res.status(200).redirect("/images");

    return res.status(200).sendFile(__dirname + "/pages/index.html");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const imagesPage = async (req, res) => {
  try {
    if (!req.isLoggedIn) return res.status(200).redirect("/");

    return res.status(200).sendFile(__dirname + "/pages/images.html");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const imageEditPage = async (req, res) => {
  try {
    if (!req.isLoggedIn) return res.status(200).redirect("/");

    return res.status(200).sendFile(__dirname + "/pages/edit.html");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
