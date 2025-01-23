import { createServer } from "http";
import { app } from "./app.js";
import dotenv from "dotenv";
import connectToDatabase from "./database_connections/index.database_connections.js";
import { initializeWebSocketServer } from "./services/websocket.server.js";

dotenv.config({ path: ".env" });

const server = createServer(app); // Create an HTTP server for Express
initializeWebSocketServer(server); 

connectToDatabase()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port http://localhost:${process.env.PORT} & DB Connection Successful`);
        });
    })
    .catch((error) => {
        console.error("Error in connecting to database and starting the server" + error);
        process.exit(1);
    });