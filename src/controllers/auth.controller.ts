import { Request, Response } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAnonymousIdentity = async (req: Request, res: Response) => {
    try {
        // Generate a unique alias
        const alias = `user_${Math.random().toString(36).substring(2, 10)}`;

        // Check if JWT_SECRET is defined
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        // Generate a JWT session token
        const sessionToken = jwt.sign(
            { alias },
            jwtSecret,
            { expiresIn: "1h" }
        );

        // Save user to the database
        const user = new User({
            alias: alias,
            sessionToken: sessionToken,
        });
        await user.save();

        // Returning the alias and sessionToken
        res.status(201).json({ alias, sessionToken });
    } catch (error) {
        console.error("Error in generateAnonymousIdentity:", error);
        res.status(500).json({ message: "Failed to generate anonymous identity", error });
    }
}

export { generateAnonymousIdentity }