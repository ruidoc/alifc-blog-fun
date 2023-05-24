const express = require("express");
const bodyParser = require("body-parser");
const mongoInit = require("./config/mongo");
const routerInit = require("./config/router");
const app = express();
const port = 9000;

app.use(bodyParser.json());
app.use(mongoInit);

routerInit(app);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.use((err, req, res, next) => {
  // console.error(err.stack);
  let code = err.name == "ValidationError" ? 400 : 500;
  res.status(code).send({
    name: err.name,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`函数启动并监听 ${port} 端口`);
});
