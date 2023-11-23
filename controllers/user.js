import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";

const client = new OAuth2Client();

export const login = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential)
      return res
        .status(400)
        .json({ success: false, message: "Incomplete Fields" });

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.CLIENT_ID,
      });
    } catch (error) {
      return res
        .status(403)
        .json({ success: false, message: "Session Expired" });
    }

    const payload = ticket.getPayload();
    const { sub: userId, name, email, picture, exp } = payload;

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, picture });

    return res
      .status(200)
      .cookie("token", credential, { expires: new Date(exp * 1000) })
      .end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token").end();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getDetails = async (req, res) => {
  try {
    if (!req.isLoggedIn)
      return res
        .status(400)
        .json({ success: false, message: "Please Login First" });

    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
