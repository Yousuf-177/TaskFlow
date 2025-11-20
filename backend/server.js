require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/authRoutes.js")
const userRoutes = require("./routes/userRoutes.js")
const taskRoutes = require("./routes/taskRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");


const app = express();

// Middlewares to handle cors (Enables your server to accept requests from other origins (domains/ports).)

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DB

connectDB();

// Middlewares

app.use(express.json());



// Routes
app.use("/api/auth",authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/report", reportRoutes);



const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running on https://localhost:${PORT}`)
);
