var express = require("express");
var router = express.Router();

router.post("/info", (req, res) => {
  res.send("TEST 路由组");
});

module.exports = router;
