import express, { Router } from "express";
import path from "path";

const RootRouter = Router();

RootRouter.use("/static", express.static(path.join(__dirname, "/Static")));

RootRouter.get("/", (req, res) => {
  res.send(__dirname);
});
export default RootRouter;
