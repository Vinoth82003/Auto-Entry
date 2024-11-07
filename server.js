// server.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require("path");

const driverRoutes = require("./routes/driver");
const loadRoutes = require("./routes/load");

const app = express();
const server = http.createServer(app);

mongoose.connect("mongodb+srv://vinothg0618:vinoth112003@cluster0.fiy26nf.mongodb.net/VehicleLoadDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/drivers", driverRoutes);
app.use("/api/load", loadRoutes);

server.listen(3000, () => console.log("Server running on port 3000"));
