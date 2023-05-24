const mongoose = require("mongoose");

const connect = (req, res, next) => {
  mongoose
    .connect("mongodb://112.126.64.221:11027/juejin_blogs", {
      user: "ruidoc",
      pass: "z7h47suy5h8e",
    })
    .then(() => {
      console.log("数据库连接成功");
      next();
    })
    .catch((err) => {
      console.log("数据库连接失败：", err);
      res.status(500).send({
        message: "数据库连接失败",
      });
    });
};

module.exports = connect;
