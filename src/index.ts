import { createServer } from "http";
import { app } from "./app.js";
import dotenv from "dotenv";
import connectToDatabase from "./database_connections/index.database_connections.js";
import { initializeSocketIOServer } from "./services/socketio.server.js";
import logger from "./utilities/logger.utilities.js";

dotenv.config({ path: ".env" });

const server = createServer(app);
initializeSocketIOServer(server);

connectToDatabase()
    .then(() => {
        server.listen(process.env.PORT, () => {
            logger.info(`Server is running on port http://localhost:${process.env.PORT} & DB Connection Successful`);
        });
    })
    .catch((error) => {
        logger.error("Error in connecting to database and starting the server" + error);
        process.exit(1);
    });