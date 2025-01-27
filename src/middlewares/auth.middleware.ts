import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const jwtSecret = process.env.JWT_SECRET as string;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        // Extract the Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.sessionToken;

        if (!token) {
            res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
            return;
        }

        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || typeof decoded !== "object") {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
            return;
        }

        // Attach user information to the request object
        (req as any).user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in authenticateUser middleware:", error);
        res.status(401).json({ message: "Unauthorized: Token verification failed", error });
    }
}

export default authenticateUser;