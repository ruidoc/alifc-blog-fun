var express = require("express");
var router = express.Router();
var UsersModel = require("../model/users");
var encrypt = require("../utils/crypto");

router.all("/", (req, res) => {
  res.send("用户管理API");
});

router.post("/create", async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.password || body.password.length < 6) {
      return res.status(400).send({ message: "密码必传且长度不小于6位" });
    }
    body.password = encrypt(body.password);
    let instan = new UsersModel(body);
    let result = await instan.save();
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  let body = req.body;
  try {
    if (!body.phone || !body.password) {
      return res.status(400).send({ message: "请输入手机号和密码" });
    }
    let { phone, password } = body;
    password = encrypt(password);
    let result = await UsersModel.findOne({ phone, password });
    if (result) {
      res.send({
        code: 200,
        data: result,
      });
    } else {
      res.send({
        code: 20001,
        message: "用户名或密码错误",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
