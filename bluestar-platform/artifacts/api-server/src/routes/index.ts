import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import fleetRouter from "./fleet";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(fleetRouter);

export default router;
