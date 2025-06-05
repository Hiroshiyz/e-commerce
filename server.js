const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const { authRoute, productRoute, cartRoute, orderRoute } = require("./routes");

const sequelize = require("./database");
const passport = require("passport");
require("./config/passport")(passport);
// connect to database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database 以連接上 postgreSQL資料庫");
  })
  .catch((e) => console.log(e));
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.log(err);
  next();
});
//router
app.use("/api/auth", authRoute);
app.use(
  "/api/cart",
  passport.authenticate("jwt", { session: false }),
  cartRoute
);
app.use(
  "/api/product",
  passport.authenticate("jwt", { session: false }),
  productRoute
);
app.use(
  "/api/order",
  passport.authenticate("jwt", { session: false }),
  orderRoute
);
//connect to port server
app.listen(process.env.PORT, () => {
  console.log(process.env.PORT + "正在連接後端伺服器");
});
