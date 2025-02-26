import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { API_V1_BASEPATH } from "./utilities/constants.utilities.js";

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb",
}));

app.use(express.static("public"));

app.use(cookieParser());

// Sample Route
app.get("/", (req, res) => {
    res.send("Your are on the server sample test link");
});

// Server Routes
import authRouter from "./routes/auth.routes.js";
import poolRouter from "./routes/pool.routes.js";
import messageRoutes from "./routes/message.routes.js";

app.use(`${API_V1_BASEPATH}/auth`, authRouter);
app.use(`${API_V1_BASEPATH}/pools`, poolRouter);
app.use(`${API_V1_BASEPATH}/messages`, messageRoutes);

export { app }