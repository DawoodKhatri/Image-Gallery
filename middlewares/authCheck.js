import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

const authCheck = async (req, res, next) => {
  try {
    const credential = req.cookies["token"];
    if (!credential) {
      req.isLoggedIn = false;
      return next();
    }

    client
      .verifyIdToken({
        idToken: credential,
        audience: process.env.CLIENT_ID,
      })
      .then((ticket) => {
        const { name, email, picture } = ticket.getPayload();
        req.isLoggedIn = true;
        req.user = { name, email, picture };
        return next();
      })
      .catch(() => {
        req.isLoggedIn = false;
        return next();
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default authCheck;
