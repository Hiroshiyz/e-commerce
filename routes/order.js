const router = require("express").Router();
const { CartItem, Cart, Product } = require("../models");

router.use((req, res, next) => {
  console.log("正在使用api order訂單");
  next();
});
//查詢該user的所有訂單
router.get("/", async (req, res) => {
  try {
    let allorder = await Cart.findAll({
      where: { UserId: req.user.id, inCheckOut: true },
      include: [{ model: CartItem, include: Product }],
    });
    if (!allorder) {
      return res.send({ message: "不存在此訂單" });
    }
    return res.json({ message: "歷史訂單", allorder });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
module.exports = router;
