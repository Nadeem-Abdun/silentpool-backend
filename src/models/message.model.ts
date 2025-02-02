import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    poolId: string; // ID of the pool the message belongs to
    senderAlias: string; // Alias of the message sender
    content: string; // Encrypted message content
    timestamp: Date; // When the message was sent
}

const MessageSchema: Schema = new Schema<IMessage>({
    poolId: {
        type: String,
        required: true,
    },
    senderAlias: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Add a TTL index to automatically delete messages after 24 hours
MessageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;