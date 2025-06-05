const router = require("express").Router();
const Product = require("../models").Product;
const { productValidation, productPatchValidation } = require("../validation");
router.use((req, res, next) => {
  console.log("正在使用api product");
  next();
});
const checkAuthenticate = (req, res, next) => {
  const user = req.user;

  if (!user.isAdmin) {
    return res.status(403).json({ message: "只有管理員可以操作" });
  }

  next();
};

//展示所有商品
router.get("/", async (req, res) => {
  try {
    let allProduct = await Product.findAll({});
    return res.json(allProduct);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//新增商品(管理員才可以)
router.post("/", checkAuthenticate, async (req, res) => {
  let { error } = productValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let { name, description, price, stock, imageUrl } = req.body;
    let newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
    });
    return res.send({
      message: "新增成功",
      newProduct,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//搜尋特定商品
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let foundProduct = await Product.findOne({ where: { id } });
    if (!foundProduct) return res.status(403).send("不存在此商品");
    return res.json(foundProduct);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//刪除商品 管理員
router.delete("/:id", checkAuthenticate, async (req, res) => {
  let { id } = req.params;
  try {
    let product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "找不到商品" });
    } //
    await product.destroy();
    return res.send({
      message: "刪除成功",
      product,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.patch("/:id", checkAuthenticate, async (req, res) => {
  let { error } = productPatchValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { id } = req.params;

  try {
    let product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "找不到商品" });
    }
    //確保只有更新 某些項目剩下的保存 將要更新的 key 放進 updates 過濾完再丟進model.update
    let updates = {};
    for (let key in req.body) {
      if (req.body[key] !== undefined || req.body[key] !== null) {
        updates[key] = req.body[key];
      }
      console.log(updates);
    }
    await product.update(updates);
    return res.send({
      message: "更新成功",
      product,
    });
  } catch (e) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
