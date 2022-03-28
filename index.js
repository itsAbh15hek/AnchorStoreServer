const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("successDb"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  // allow preflight
  if (req.method === "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  res.send("App is running!!");
});
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(PORT, () => console.log("Server Running"));
