const Cart = require("./cart");
const CartItem = require("./cartItem");
const Product = require("./product");
const User = require("./user");
//User 1<-->1 cart
User.hasOne(Cart);
Cart.belongsTo(User);

//cart 1 <==> cartitem
Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

//Product 1<===> cartitem
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

module.exports = {
  User,
  Cart,
  CartItem,
  Product,
};
