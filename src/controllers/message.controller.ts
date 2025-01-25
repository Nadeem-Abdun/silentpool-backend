import { Request, Response } from "express";
import Message from "../models/message.model.js";

const fetchMessages = async (req: Request, res: Response) => {
    try {
        const { poolId } = req.params;

        // Fetch messages for the given pool ID, sorted by timestamp
        const messages = await Message.find({ poolId }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export { fetchMessages };