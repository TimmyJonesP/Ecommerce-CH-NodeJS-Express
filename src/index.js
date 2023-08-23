import { Server } from "socket.io";
import app from "./app.js";
import { PORT } from "./config/main.config.js";

const httpServer = app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`Client connected with id: ${socket.id}`);
});
