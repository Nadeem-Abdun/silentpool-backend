import express from "express";
import { generateAnonymousIdentity } from "../controllers/auth.controller.js";

const router = express.Router();

// Route to generate anonymous identity
router.get("/anonymous", generateAnonymousIdentity);

export default router;