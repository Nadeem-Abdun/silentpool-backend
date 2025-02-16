import { createLogger, format, transports } from "winston";

// Define logging levels and formats
const logger = createLogger({
    levels: {
        error: 0, // Most severe
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6, // Least severe
    },
    level: "silly", // Set to the lowest level to allow all levels to log
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // Log to console
        // new transports.File({ filename: "combined.log" }), // Log to file
    ],
});

// Optional: Add a file transport for errors in production
// if (process.env.NODE_ENV === "production") {
//     logger.add(new transports.File({ filename: "error.log", level: "error" }));
// }

export default logger;
