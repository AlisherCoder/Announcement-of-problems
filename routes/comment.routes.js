import { Router } from "express";
import { create, remove, update } from "../controllers/comment.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const commentRoute = Router();

commentRoute.post("/", verifyToken, create);
commentRoute.patch("/:id", verifyToken, update);
commentRoute.delete("/:id", verifyToken, remove);

export default commentRoute;
