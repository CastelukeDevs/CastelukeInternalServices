import express, { Router } from "express";
import path from "path";
import MonstRootRouter from "./MoneyStory/MonstRootRouter";
import AuthRouter from "./Auth/AuthRouter";

const RootRouter = Router();

const staticPath = "/static";
const moneyStoryPath = "/money-story";
const authenticationPath = "/auth/v1";

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

RootRouter.use(authenticationPath, AuthRouter);
RootRouter.use(moneyStoryPath, MonstRootRouter);

export default RootRouter;
