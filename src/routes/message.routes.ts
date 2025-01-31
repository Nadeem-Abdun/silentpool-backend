import { Router } from "express";
import { fetchMessages } from "../controllers/message.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

// Route to fetch message history for a pool (protected by authentication middleware)
router.get("/:poolId/messages", authenticateUser, fetchMessages);

export default router;