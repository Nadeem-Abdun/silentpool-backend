import express from "express";
import { createPool, joinPool, leavePool } from "../controllers/pool.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import logger from "../utilities/logger.utilities.js";

const router = express.Router();

router.get("/create", authenticateUser, (req, res, next) => {
    logger.info(`Request to create pool, ${req.method} ${req.originalUrl}`);
    next();
}, createPool);

router.post("/join", authenticateUser, (req, res, next) => {
    logger.info(`Request to join pool, poolId: ${req.body.poolId}, ${req.method} ${req.originalUrl}`);
    next();
}, joinPool);

router.post("/leave", authenticateUser, (req, res, next) => {
    logger.info(`Request to leave pool, poolId: ${req.body.poolId}, ${req.method} ${req.originalUrl}`);
    next();
}, leavePool);

export default router;