import { Router } from "express";
import {
   create,
   findAll,
   findOne,
   remove,
   update,
} from "../controllers/region.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const regionRoute = Router();

regionRoute.get("/", findAll);
regionRoute.get("/:id", findOne);
regionRoute.post("/", verifyToken, create);
regionRoute.patch("/:id", verifyToken, update);
regionRoute.delete("/:id", verifyToken, remove);

export default regionRoute;
