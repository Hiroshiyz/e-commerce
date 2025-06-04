const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Cart = sequelize.define("Cart", {
  inCheckOut: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Cart;
