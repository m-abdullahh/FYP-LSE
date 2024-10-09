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
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

// Middleware to log the request URL
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware or route handler
});

app.use("/", require("./routes/userRoutes"));
app.use("/search", require("./routes/searchRoutes"));
app.use("/searchhistory", require("./routes/historyRoutes"));

const port = 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port: ${port}`);
});
