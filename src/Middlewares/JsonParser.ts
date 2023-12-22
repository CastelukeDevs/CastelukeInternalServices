import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  const reqBody = req.body;
  //   console.log("==> before parse", reqBody);

  for (const key in reqBody) {
    if (Array.isArray(reqBody[key])) {
      for (let i = 0; i < reqBody[key].length; i++) {
        const element = reqBody[key][i];

        reqBody[key][i] = JSON.parse(element);
      }
    }
  }
  next();
};
