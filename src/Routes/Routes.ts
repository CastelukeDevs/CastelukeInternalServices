import express, { Router } from "express";
import path from "path";

const RootRouter = Router();

//Return static file json from static folder
RootRouter.use(
  "/static",
  express.static(path.join(__dirname, "/Static"), {
    index: false,
    extensions: ["json"],
  })
);

RootRouter.get("/", (req, res) => {
  res.send(`Server is running..... Root: ${__dirname}`);
});

export default RootRouter;
