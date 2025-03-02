import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();

let jwtsecret = process.env.jwtsecret || "jwtsecret";

function verifyToken(req, res, next) {
   try {
      let header = req.header("Authorization");
      let [_, token] = header.split(" ");

      if (!token) {
         return res.status(401).json({ message: "Not found token." });
      }

      let data = jwt.verify(token, jwtsecret);
      req.user = data;
      next();
   } catch (error) {
      res.status(400).json({ message: "Invalid token." });
   }
}

export default verifyToken;
