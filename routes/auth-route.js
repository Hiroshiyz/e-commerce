const router = require("express").Router();
const User = require("../models").User;
const { registerValidation, loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
// 載入key
const privateKey = fs.readFileSync(path.resolve(process.env.PRIVATE_KEY_PATH));
router.use((req, res, next) => {
  console.log("正在使用auth-route");
  next();
});

router.get("/test", async (req, res) => {
  let allUser = await User.findAll({});
  return res.json(allUser);
});
//register
router.post("/register", async (req, res) => {
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let foundUser = await User.findOne({ where: { email: req.body.email } });
    if (foundUser) {
      return res.status(403).send("已經有使用者註冊過");
    }
    let { username, email, password, isAdmin } = req.body;
    let newUser = await User.create({
      username,
      email,
      password,
      isAdmin,
    });
    return res.json(newUser);
  } catch (error) {
    return res.status(403).send(error.message);
  }
});

//login
router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { email, password } = req.body;

  try {
    let foundUser = await User.findOne({ where: { email } });
    if (!foundUser) {
      return res.status(400).send("此使用者不存在請註冊");
    }

    //jwt製作
    const isMatch = await foundUser.comparePassword(password);
    if (isMatch) {
      let tokenObject = { id: foundUser.id, email: foundUser.email };
      let token = jwt.sign(tokenObject, privateKey, {
        algorithm: "RS256",
        expiresIn: "7d",
      }); //base64
      return res.send({
        message: "成功登入",
        token: "JWT " + token,
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//logout -- session
// router.post("/logout", (req, res) => {
//   req.logOut((err) => {
//     if (err) {
//       return res.send(err);
//     }
//     return res.send("成功登出");
//   });
// });

module.exports = router;
