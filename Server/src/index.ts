import type { Application, Request, Response } from "express";
import { createLink, getLink } from "./controllers/allControllers";
import connectDB from "./config/dbConnect";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";

dotenv.config();
connectDB();

const app: Application = express();
const port: number = parseInt(process.env.PORT || "5000");

app.use(cors());
app.use(express.json());

// Define the routes and their calls
app.post('/create', createLink);
app.get('/:path', getLink);
app.get('/', (req: Request, res: Response): void => {
    res.send("API Working correctly");
});

app.listen(port, () => {
    console.log("Server Running on port:", port);
});