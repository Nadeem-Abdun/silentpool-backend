import { Request, Response } from "express";
import Message from "../models/message.model.js";
import logger from "../utilities/logger.utilities.js";

const fetchMessages = async (req: Request, res: Response) => {
    try {
        const { poolId } = req.params;

        logger.info(`Fetching messages for poolId: ${poolId}`);

        // Fetch messages for the given pool ID, sorted by timestamp
        const messages = await Message.find({ poolId }).sort({ timestamp: 1 });

        if (messages.length === 0) {
            logger.warn(`No messages found for poolId: ${poolId}`);
        } else {
            logger.debug(`Fetched ${messages.length} messages for poolId: ${poolId}`);
        }

        res.status(200).json(messages);
    } catch (error) {
        logger.error(`Error fetching messages for poolId: ${req.params.poolId}`, error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export { fetchMessages };