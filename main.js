import { PrismaClient } from "@prisma/client";
import mainRoute from "./routes/index.js";
import express from "express";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.use("/api", mainRoute);

app.listen(3000, () => console.log("Server started on port 3000"));

export default prisma;