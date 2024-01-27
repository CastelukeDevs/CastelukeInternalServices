import express, { Router } from "express";
import path from "path";

const AuthRouter = Router();

const signUpPath = "/signup";

//Return static file json from static folder

AuthRouter.get("/", (req, res) => {
  res.send(`Server is running..... Root: ${__dirname}`);
});

AuthRouter.post(signUpPath, (req, res) => {
  res.send("ok");
});

export default AuthRouter;
