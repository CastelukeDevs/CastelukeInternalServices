import dotenv from "dotenv";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import firebaseConfig from "./src/Config/Firebase/firebaseConfig";

//For env File
dotenv.config();

//FIREBASE Global early initialization
const serviceAccount = firebaseConfig as ServiceAccount;

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${process.env.FIRE_PROJECT_ID}.appspot.com`,
});

import express, { Application } from "express";
// import RootRouter from "./src/Routes/Routes";
import path from "path";
import mongoose from "mongoose";
import MulterProvider from "./src/Config/Multer/MulterProvider";
import RootRouter from "@Routes/Routes";

const app: Application = express();
const port = process.env.SERVICE_PORT || 8000;
const mongoUri = process.env.URL_MONGODB || "";

//DB CONNECT
main().catch((err) => console.log("mongodb connection error:", err));

async function main() {
  await mongoose.connect(mongoUri);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(MulterProvider);

app.use(RootRouter);

// app.use("/static", express.static(path.join(__dirname + "/Static")));
// app.use("static", express.static(__dirname + "/Static"));

app.listen(port, () => {
  console.log(`Server is Live at http://localhost:${port}`);
  console.log(path.join(__dirname, "/Static"));
});
