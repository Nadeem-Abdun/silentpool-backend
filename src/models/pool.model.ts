import mongoose, { Schema, Document } from "mongoose";
import Message from "./message.model.js";

export interface IPool extends Document {
    poolId: string; // Unique pool identifier
    creatorAlias: string; // Alias of the pool creator
    encryptionKey: string; // Optional encryption key for the pool
    participants: string[]; // List of user aliases in the pool
    createdAt: Date; // Timestamp for when the pool was created
    lastActiveAt: Date; // Timestamp for when the pool was last active
}

const PoolSchema: Schema = new Schema<IPool>({
    poolId: {
        type: String,
        required: true,
        unique: true,
    },
    creatorAlias: {
        type: String,
        required: true,
    },
    encryptionKey: {
        type: String,
        required: true,
    },
    participants: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastActiveAt: {
        type: Date,
        default: Date.now,
    },
});

// Add a TTL index to automatically delete pools after a set period (e.g., 1 hour)
PoolSchema.index({ lastActiveAt: 1 }, { expireAfterSeconds: 3600 });

// Middleware for cascading deletion of messages when a pool is deleted
PoolSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const poolId = this.poolId;
        await Message.deleteMany({ poolId }); // Delete all messages associated with the deleted pool
        console.log(`Messages associated with pool ${poolId} have been deleted.`);
        next();
    } catch (error) {
        console.error(`Failed to delete messages for pool ${this.poolId}:`, error);
        next(error as mongoose.CallbackError);
    }
});

const Pool = mongoose.model<IPool>("Pool", PoolSchema);

export default Pool;