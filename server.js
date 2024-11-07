// server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const path = require("path");

const driverRoutes = require("./routes/driver");
const loadRoutes = require("./routes/load");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect("mongodb://localhost:27017/VehicleLoadDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/drivers", driverRoutes);
app.use("/api/load", loadRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => console.log("User disconnected"));
});

server.listen(3000, () => console.log("Server running on port 3000"));
