import { Router } from "express";
import { create, remove } from "../controllers/like.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const likeRoute = Router();

likeRoute.post("/", verifyToken, create);
likeRoute.delete("/:id", verifyToken, remove);

export default likeRoute;
