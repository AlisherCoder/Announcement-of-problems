import { Router } from "express";
import { create } from "../controllers/donate.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const donateRoute = Router();

donateRoute.post("/", verifyToken, create);

export default donateRoute;
