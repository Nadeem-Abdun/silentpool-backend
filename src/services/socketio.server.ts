import { Server } from "socket.io";
import Message from "../models/message.model.js";
import Pool from "../models/pool.model.js";
import { encryptMessage } from "../utilities/encryption.utilities.js";
import logger from "../utilities/logger.utilities.js";

const updateLastActiveAt = async (poolId: string) => {
    try {
        await Pool.findOneAndUpdate({ poolId: poolId }, { lastActiveAt: new Date() });
        logger.info(`Updated lastActiveAt for pool: ${poolId}`);
    } catch (error) {
        logger.error(`Error updating lastActiveAt for pool ${poolId}: ${error}`);
    }
};

export const initializeSocketIOServer = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    logger.info("Socket.io server initialized");

    io.on("connection", (socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        socket.on("join", async ({ poolId, senderAlias }) => {
            socket.join(poolId); // Join the room
            await updateLastActiveAt(poolId);
            logger.info(`User ${senderAlias} joined pool: ${poolId}`);
            io.to(poolId).emit("notification", `${senderAlias} has joined the pool.`);
        });

        socket.on("typing", ({ poolId, senderAlias }) => {
            socket.to(poolId).emit("typing", { senderAlias });
            logger.info(`Typing notification sent in pool: ${poolId} by ${senderAlias}`);
        });

        socket.on("message", async ({ poolId, senderAlias, content }) => {
            try {
                const pool = await Pool.findOne({ poolId: poolId });
                if (!pool || !pool.encryptionKey) {
                    throw new Error("Encryption key not found for the pool");
                }

                const encryptedContent = encryptMessage(content, pool.encryptionKey);
                const message = new Message({
                    poolId: poolId,
                    senderAlias: senderAlias,
                    content: encryptedContent,
                });
                await message.save();

                io.to(poolId).emit("message", {
                    senderAlias,
                    content: encryptedContent,
                    timestamp: message.timestamp,
                });
                await updateLastActiveAt(poolId);
                logger.info(`Message sent in pool: ${poolId} by ${senderAlias}`);
            } catch (error) {
                logger.error("Error handling message event: ", error);
                socket.emit("error", "Failed to process your message.");
            }
        });

        socket.on("disconnect", () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });
};
