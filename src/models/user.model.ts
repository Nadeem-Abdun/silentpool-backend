import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: true,
        unique: true
    },
    sessionToken: {
        type: String,
        required: true
    },
    pools: [
        {
            type: String
        }
    ]
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;