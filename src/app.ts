import express, { Request, Response } from 'express';
import { registerRoutes } from './routes';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("🔥 User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

registerRoutes(app);

app.get('/', (req: Request, res: Response) => {
    res.send("APIs running");
});

// ✅ IMPORTANT FIX
server.listen(3000, "0.0.0.0", () => {
    console.log("Server running on port 3000");
});