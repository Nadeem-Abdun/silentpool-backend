import mongoose from "mongoose";
import { DATABASE_NAME } from "../utilities/constants.utilities.js";

const connectToDatabase = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI_ATLAS}/${DATABASE_NAME}`);
        console.info("Connected to MongoDB hosted @ " + connectionInstance.connection.host);
        connectionInstance.connection.on("error", (error) => {
            console.error("Error in connecting to MongoDB: " + error);
        });
        connectionInstance.connection.on("disconnected", () => {
            console.info("Disconnected from MongoDB hosted @ " + connectionInstance.connection.host);
        });
    } catch (error) {
        console.error("Error in connecting to MongoDB: " + error);
    }
}

export default connectToDatabase;