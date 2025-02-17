import { Request, Response } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import logger from "../utilities/logger.utilities.js";

const generateAnonymousIdentity = async (req: Request, res: Response) => {
    try {
        logger.info("Request received to generate anonymous identity");

        // Generate a unique alias
        const alias = `user_${Math.random().toString(36).substring(2, 10)}`;
        logger.debug(`Generated alias: ${alias}`);

        // Check if JWT_SECRET is defined
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger.error("JWT_SECRET is not defined in the environment variables");
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        logger.debug("JWT_SECRET is available");

        // Generate a JWT session token
        const sessionToken = jwt.sign(
            { alias },
            jwtSecret,
            { expiresIn: "1h" }
        );
        logger.debug("JWT session token generated");

        // Save user to the database
        const user = new User({
            alias: alias,
            sessionToken: sessionToken,
        });
        await user.save();
        logger.info(`New user saved to database with alias: ${alias}`);

        // Returning the alias and sessionToken
        res.status(201).json({ alias, sessionToken });
        logger.info(`Successfully generated anonymous identity for alias: ${alias}`);
    } catch (error) {
        logger.error(`Error in generateAnonymousIdentity: ${error}`);
        res.status(500).json({ message: "Failed to generate anonymous identity", error });
    }
};

export { generateAnonymousIdentity };