// import MonstRouter from "@Projects/Monst/Router/MonstRoute";
import MonstRouter from "@Projects/Monst/Router/MonstRoute";
import express, { Router } from "express";
import path from "path";
// import MonstRouter from "@Projects/Monst/Router/MonstRoute";

const RootRouter = Router();

const staticPath = "/static";
const moneyStoryPath = "/money-story";

//Return static file json from static folder
RootRouter.use(
  staticPath,
  express.static(path.join(__dirname, "/Static"), {
    index: false,
    extensions: ["json"],
  })
);

RootRouter.get("/", (req, res) => {
  res.send(`Server is running..... Root: ${__dirname}`);
});

RootRouter.use(moneyStoryPath, MonstRouter);

export default RootRouter;
