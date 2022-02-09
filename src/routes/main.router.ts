import express, { Request, Response } from "express";
import v1Router from "./v1.router";

const router = express.Router();

router.get("/check", (req: Request, res: Response) => {
    res.sendStatus(200);
});
router.use("/api/v1", v1Router);

export default router;