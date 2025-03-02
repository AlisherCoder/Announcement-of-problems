import { Router } from "express";
import {
   activate,
   login,
   register,
   resetPassword,
   sendOTP,
} from "../controllers/auth.controller.js";
import {
   findAll,
   findOne,
   mydata,
   remove,
   update,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import rolePolice from "../middlewares/rolePolice.js";
import selfPolice from "../middlewares/selfPolice.js";

const userRoute = Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/activate", activate);
userRoute.post("/send-otp", sendOTP);
userRoute.post("/reset-password", resetPassword);

userRoute.get("/mydata", verifyToken, mydata);
userRoute.get("/", verifyToken, rolePolice(["ADMIN"]), findAll);
userRoute.get("/:id", verifyToken, rolePolice(["ADMIN"]), findOne);
userRoute.patch("/:id", verifyToken, selfPolice(["ADMIN"]), update);
userRoute.delete("/:id", verifyToken, selfPolice(["ADMIN"]), remove);

export default userRoute;
