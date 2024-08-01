// backend/src/app.ts

import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./config/mongodb";
import routes from "./routes";
import morganMiddleware from "./middlewares/morganMiddleware"; // Import the Morgan middleware

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use the Morgan middleware
app.use(morganMiddleware);

// Connect to MongoDB
connectToMongoDB();

// Use your API routes
app.use(routes);

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
});
