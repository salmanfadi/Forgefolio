import { Router, type IRouter } from "express";
import healthRouter from "./health";
import forgefolioRouter from "./forgefolio";

const router: IRouter = Router();

router.use(healthRouter);
router.use(forgefolioRouter);

export default router;
