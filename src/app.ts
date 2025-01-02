import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { API_V1_BASEPATH } from "./utilities/constants.utilities.js";

const app = express();

const allowedClientOrigins = [process.env.CLIENT_URL_LOCAL, process.env.CLIENT_URL_IDX, process.env.CLIENT_URL_VERCEL]
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedClientOrigins.includes(origin)) { // Check if the request origin is in the allowed origins array or if no origin (server-to-server requests)
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}));

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
import userRouter from "./routes/user.routes.js";
import profileRouter from "./routes/profile.routes.js";
import experienceRouter from "./routes/experience.routes.js";
import projectRouter from "./routes/project.routes.js";
import wallOfCodeRouter from "./routes/wallOfCode.routes.js";
import contactMeRouter from "./routes/contactMe.routes.js";
import resumeRouter from "./routes/resume.routes.js";

app.use(`${API_V1_BASEPATH}/users`, userRouter);
app.use(`${API_V1_BASEPATH}/profile`, profileRouter);
app.use(`${API_V1_BASEPATH}/experience`, experienceRouter);
app.use(`${API_V1_BASEPATH}/project`, projectRouter);
app.use(`${API_V1_BASEPATH}/wallOfCode`, wallOfCodeRouter);
app.use(`${API_V1_BASEPATH}/contactMe`, contactMeRouter);
app.use(`${API_V1_BASEPATH}/resume`, resumeRouter);

export { app }