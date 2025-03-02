import categoryRoute from "./category.routes.js";
import commentRoute from "./comment.routes.js";
import regionRoute from "./region.routes.js";
import bannerRoute from "./banner.routes.js";
import donateRoute from "./donate.routes.js";
import upload from "../config/multer.js";
import userRoute from "./user.routes.js";
import likeRoute from "./like.routes.js";
import { Router } from "express";
import express from "express";

const mainRoute = Router();

mainRoute.use("/like", likeRoute);
mainRoute.use("/users", userRoute);
mainRoute.use("/donate", donateRoute);
mainRoute.use("/banners", bannerRoute);
mainRoute.use("/regions", regionRoute);
mainRoute.use("/comments", commentRoute);
mainRoute.use("/categories", categoryRoute);

mainRoute.use("/upload", upload.single("image"), (req, res) => {
   return res.status(201).json({ data: req.file.filename });
});

mainRoute.use("/image", express.static("uploads"));

export default mainRoute;
