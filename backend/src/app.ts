// backend/src/app.ts

import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./config/mongodb";
import routes from "./routes";
import { connectWebSocket } from "./services/websocket";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectToMongoDB();

app.use(routes);

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);

    // Connect to WebSocket and subscribe to initial symbols from the database
    await connectWebSocket();
});
