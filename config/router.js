const userRouter = require("../router/users.js");

const router = (app) => {
  app.use("/users", userRouter);
};

module.exports = router;
