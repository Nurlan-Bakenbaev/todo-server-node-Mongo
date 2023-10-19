const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const todoRouter = require("./routes/todo.route");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors({}));
app.use("/api/auth", authRouter);
app.use("/api/todo", todoRouter);

async function start() {
  try {
    await mongoose.connect(MONGO_DB);
    console.log("mongo DB is working");
    app.listen(PORT, () => {
      console.log(`Server on ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}
start();
