import { WebSocket, WebSocketServer } from "ws";
import Message from "../models/message.model.js";
import Pool from "../models/pool.model.js";
import { encryptMessage } from "../utilities/encryption.utilities.js";

// Extend the WebSocket type to include custom properties
interface CustomWebSocket extends WebSocket {
    poolId?: string; // Add poolId as an optional property
}

// Utility function to update `lastActiveAt`
const updateLastActiveAt = async (poolId: string) => {
    try {
        await Pool.findOneAndUpdate({ poolId: poolId }, { lastActiveAt: new Date() });
    } catch (error) {
        console.error(`Error updating lastActiveAt for pool ${poolId}:`, error);
    }
}

export const initializeWebSocketServer = (server: any) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws: CustomWebSocket) => {
        console.log("New WebSocket connection established");

        ws.on("message", async (data) => {
            try {
                const parsedData = JSON.parse(data.toString());
                const { type, poolId, senderAlias, content } = parsedData;

                if (type === "join") {
                    // Associate this WebSocket connection with a pool
                    ws.poolId = poolId;
                    await updateLastActiveAt(poolId); // Update activity time on join
                } else if (type === "typing") {
                    // Broadcast typing notification to all clients in the same pool
                    wss.clients.forEach((client) => {
                        const customClient = client as CustomWebSocket
                        if (client.readyState === ws.OPEN && customClient !== ws && customClient.poolId === poolId) {
                            customClient.send(JSON.stringify({
                                type: "typing",
                                poolId: poolId,
                                senderAlias: senderAlias,
                            }));
                        }
                    });
                    await updateLastActiveAt(poolId); // Update activity time on join
                } else if (type === "message") {
                    // Broadcast message to all clients in the same pool
                    const pool = await Pool.findOne({ poolId: poolId });
                    if (!pool || !pool.encryptionKey) {
                        throw new Error("Encryption key not found for the pool");
                    }
                    const encryptedContent = encryptMessage(content, pool.encryptionKey);

                    const message = new Message({
                        poolId: poolId,
                        senderAlias: senderAlias,
                        content: encryptedContent, // Store encrypted content
                    });
                    await message.save();

                    wss.clients.forEach((client) => {
                        const customClient = client as CustomWebSocket; // Cast to CustomWebSocket
                        if (client.readyState === ws.OPEN && customClient.poolId === poolId) {
                            customClient.send(JSON.stringify({
                                type: "message",
                                poolId,
                                senderAlias,
                                content: encryptedContent, // Send encrypted content
                                timestamp: message.timestamp,
                            }));
                        }
                    });
                    await updateLastActiveAt(poolId); // Update activity time on join
                }
            } catch (error) {
                console.error("Error handling WebSocket message:", error);
                ws.send(JSON.stringify({
                    type: "error",
                    message: "An error occurred while processing your request.",
                }));
            }
        });

        ws.on("close", () => {
            console.log("WebSocket connection closed");
        });
    });
};