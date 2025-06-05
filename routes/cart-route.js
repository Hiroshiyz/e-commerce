const { CartItem, Cart, Product } = require("../models");
const router = require("express").Router();
const { addProductValidation } = require("../validation");
router.use((req, res, next) => {
  console.log("cart正在使用此api");
  next();
});

//顯示目前該user的cart
router.get("/", async (req, res) => {
  try {
    let foundCart = await Cart.findOne({
      where: { UserId: req.user.id, inCheckOut: false },
      include: [{ model: CartItem, include: Product }],
    });
    if (!foundCart) return res.status(404).send("目前尚未有購物車");
    return res.json(foundCart);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//新增商品到cart
// 新增商品到購物車
router.post("/", async (req, res) => {
  let { error } = addProductValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { productId, quantity } = req.body;
  let userId = req.user.id;

  try {
    // 找出 or 建立 未結帳購物車
    let [shoppingCart, createdCart] = await Cart.findOrCreate({
      where: {
        UserId: userId,
        inCheckOut: false,
      },
    });

    let product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "未找到該產品" });

    // 庫存不足
    if (product.stock < quantity)
      return res.status(400).json({ message: "庫存不足，無法加入購物車" });

    // 查找或建立 CartItem
    let [item, created] = await CartItem.findOrCreate({
      where: {
        CartId: shoppingCart.id,
        ProductId: productId,
      },
      defaults: {
        quantity: Number(quantity),
      },
    });

    // 若已存在則加上數量
    if (!created) {
      item.quantity = Number(item.quantity) + Number(quantity);
      await item.save();
    }

    res.json({ message: "加入購物車成功", item });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});

//刪除購物車商品
router.delete("/remove/:productId", async (req, res) => {
  try {
    let { productId } = req.params;
    let foundCart = await Cart.findOne({
      where: { UserId: req.user.id, inCheckOut: false },
    });
    console.log(foundCart);
    if (!foundCart) {
      return res.status(404).send("不存在此購物車");
    }
    let deleted = await CartItem.destroy({
      where: { CartId: foundCart.id, ProductId: productId },
    });
    if (deleted === 0)
      return res.status(404).json({ message: "此購物車無該商品" });
    res.json({ message: "Item removed", deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//模擬結帳購物車內的商品
router.post("/checkout", async (req, res) => {
  try {
    const foundCart = await Cart.findOne({
      where: { UserId: req.user.id, inCheckOut: false },
      include: [{ model: CartItem, include: Product }],
    });
    //確認購物車內是否有商品
    if (!foundCart || foundCart.CartItems.length === 0) {
      return res
        .status(400)
        .json({ message: "購物車內暫無商品或者購物車不存在" });
    }

    // 確認庫存足夠
    for (let item of foundCart.CartItems) {
      if (item.Product.stock < item.quantity) {
        return res.status(400).json({
          message: `Product ${item.Product.name}沒有足夠的庫存.`,
        });
      }
    }

    // 扣庫存
    for (let item of foundCart.CartItems) {
      item.Product.stock = Number(item.Product.stock) - Number(item.quantity);
      await item.Product.save(); //有更動用save來更新
    }
    let totall = 0;
    for (let item of foundCart.CartItems) {
      totall += Number(item.Product.prirce);
    }
    // 設成已結帳狀態
    foundCart.inCheckOut = true;
    await foundCart.save();
    await Cart.create({ UserId: req.user.id });
    res.json({ message: "結帳成功", foundCart, totall });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
