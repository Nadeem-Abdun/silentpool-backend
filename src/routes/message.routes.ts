import express from "express";
import { fetchMessages } from "../controllers/message.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import logger from "../utilities/logger.utilities.js";

const router = express.Router();

// Route to fetch message history for a pool (protected by authentication middleware)
router.get("/:poolId/messages", authenticateUser, (req, res, next) => {
    logger.info(`Received request for messages in poolId: ${req.params.poolId}, ${req.method} ${req.originalUrl}`);
    next();
}, fetchMessages);

export default router;
