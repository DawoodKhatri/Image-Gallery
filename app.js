import Express from "express";
import pageRoutes from "./routes/page.js";
import userRoutes from "./routes/user.js";
import imagesRoutes from "./routes/images.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(Express.static("styles"))

app.use("/", pageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/images", imagesRoutes);

export default app;
