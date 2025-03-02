import { Router } from "express";
import {
   create,
   findAll,
   findOne,
   remove,
   update,
} from "../controllers/banner.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const bannerRoute = Router();

bannerRoute.get("/", verifyToken, findAll);
bannerRoute.post("/", verifyToken, create);
bannerRoute.get("/:id", verifyToken, findOne);
bannerRoute.patch("/:id", verifyToken, update);
bannerRoute.delete("/:id", verifyToken, remove);

export default bannerRoute;
