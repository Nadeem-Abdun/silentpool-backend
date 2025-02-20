import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utilities/logger.utilities.js";

const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        logger.info("Authenticating user...");

        const jwtSecret = process.env.JWT_SECRET as string;
        if (!jwtSecret) {
            logger.error("JWT_SECRET is not defined in the environment variables");
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        // Extract the Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.sessionToken;

        if (!token) {
            logger.warn("Unauthorized access attempt: Missing or invalid token");
            res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
            return;
        }

        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || typeof decoded !== "object") {
            logger.warn("Unauthorized access attempt: Invalid token");
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return;
        }

        // Attach user information to the request object
        (req as any).user = decoded;
        logger.info(`User authenticated successfully. User alias: ${(decoded as any).alias}`);

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        logger.error(`Error in authenticateUser middleware: ${error}`);
        res.status(401).json({ message: "Unauthorized: Token verification failed", error });
    }
};

export default authenticateUser;