import express from "express";
import { createPool, joinPool, leavePool } from "../controllers/pool.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to create a pool (protected by authentication middleware)
router.get("/create", authenticateUser, createPool);
router.post("/join", authenticateUser, joinPool);
router.post("/leave", authenticateUser, leavePool);

export default router;