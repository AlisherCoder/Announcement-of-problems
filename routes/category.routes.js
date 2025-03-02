import { Router } from "express";
import {
   create,
   findAll,
   findOne,
   remove,
   update,
} from "../controllers/category.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const categoryRoute = Router();

categoryRoute.get("/", findAll);
categoryRoute.post("/", verifyToken, create);
categoryRoute.get("/:id", findOne);
categoryRoute.patch("/:id", verifyToken, update);
categoryRoute.delete("/:id", verifyToken, remove);

export default categoryRoute;
