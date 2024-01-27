import express, { Router } from "express";
import path from "path";

const TemplateRouter = Router();

const staticPath = "/static";
const moneyStoryPath = "/money-story";
const authenticationPath = "/auth/v1";

//Return static file json from static folder

TemplateRouter.get("/", (req, res) => {
  res.send(`Server is running..... Root: ${__dirname}`);
});

export default TemplateRouter;
