const Cart = require("./cart");
const CartItem = require("./cartItem");
const Product = require("./product");
const User = require("./user");
//User 1<-->多 cart
User.hasMany(Cart, { onDelete: "CASCADE" });
Cart.belongsTo(User);

//cart 1 <==> cartitem
Cart.hasMany(CartItem, { onDelete: "CASCADE" });
CartItem.belongsTo(Cart);

//Product 1<===> cartitem
Product.hasMany(CartItem, { onDelete: "CASCADE" });
CartItem.belongsTo(Product);

module.exports = {
  User,
  Cart,
  CartItem,
  Product,
};
