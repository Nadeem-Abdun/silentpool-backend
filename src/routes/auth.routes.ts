import express from "express";
import { generateAnonymousIdentity } from "../controllers/auth.controller.js";
import logger from "../utilities/logger.utilities.js";

const router = express.Router();

// Route to generate anonymous identity
router.get("/anonymous", (req, res, next) => {
    logger.info(`Received request for anonymous identity: ${req.method} ${req.originalUrl}`);
    next();
}, generateAnonymousIdentity);

export default router;