import { Request, Response } from "express";
import Pool from "../models/pool.model.js";
import crypto from "crypto";
import { generateEncryptionKey } from "../utilities/encryption.utilities.js";

const createPool = async (req: Request, res: Response) => {
    try {
        // Extract the alias of the creator from the JWT payload
        const creatorAlias = (req as any).user.alias;

        // Generate a unique Pool ID
        const poolId = `pool_${crypto.randomBytes(6).toString("hex")}`;

        // Generate a unique encryption key
        const encryptionKey = generateEncryptionKey();

        // Create and save the pool in the database
        const newPool = new Pool({
            poolId: poolId,
            creatorAlias: creatorAlias,
            encryptionKey: encryptionKey,
            participants: [creatorAlias],
        })
        await newPool.save();

        // Return the pool ID and other details to the client
        res.status(201).json({ message: "Pool created successfully", poolId, creatorAlias, encryptionKey });
    } catch (error) {
        console.error("Error in createPool:", error);
        res.status(500).json({ message: "Failed to create pool", error });
    }
};

const joinPool = async (req: Request, res: Response) => {
    try {
        const { poolId } = req.body; // Extract alias from payload
        const userAlias = (req as any).user.alias; // Extract alias from authenticated user

        // Check if pool exists
        const pool = await Pool.findById(poolId);
        if (!pool) {
            res.status(404).json({ message: "Pool not found" });
            return;
        }

        // Check if user is already part of the pool
        if (pool.participants.includes(userAlias)) {
            res.status(400).json({ message: "You are already a participant in this pool" });
            return;
        }

        // Add user to the pool
        pool.participants.push(userAlias);
        // Update activity time to the pool
        pool.lastActiveAt = new Date();
        await pool.save();

        res.status(200).json({
            message: "Successfully joined the pool",
            pool: {
                id: pool._id,
                participants: pool.participants,
            },
        });
    } catch (error) {
        console.error("Error in joinPool:", error);
        res.status(500).json({ message: "Failed to join the pool", error });
    }
}

const leavePool = async (req: Request, res: Response) => {
    try {
        const { poolId } = req.body;
        const userAlias = (req as any).user.alias;

        const pool = await Pool.findOne({ poolId });
        if (!pool) {
            res.status(404).json({ message: "Pool not found" });
            return;
        }

        pool.participants = pool.participants.filter((alias) => alias !== userAlias);

        if (pool.participants.length === 0) {
            await Pool.deleteOne({ poolId }); // Delete the pool if no participants exist
        } else {
            pool.lastActiveAt = new Date(); // Update the activity time
            await pool.save();
        }

        res.status(200).json({ message: "Successfully left the pool" });
    } catch (error) {
        console.error("Error in leavePool:", error);
        res.status(500).json({ message: "Error leaving the pool", error });
    }
}

export { createPool, joinPool, leavePool };