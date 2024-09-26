const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { mongoose } = require("mongoose");
const cookieparser = require("cookie-parser");
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// MIDDLEWARES
app.use(express.json());
app.use(cookieparser());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/userRoutes"));

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
