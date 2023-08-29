import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import multer from "multer";
import RootRouter from "./src/Routes/Routes";
import path from "path";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.SERVICE_PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().array(""));

app.use(RootRouter);

// app.use("/static", express.static(path.join(__dirname + "/Static")));

// app.use("static", express.static(__dirname + "/Static"));

app.listen(port, () => {
  console.log(`Server is Live at http://localhost:${port}`);
  console.log(path.join(__dirname, "/Static"));
});
