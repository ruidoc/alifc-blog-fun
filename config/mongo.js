const mongoose = require('mongoose')

const connect = (req, res, next) => {
  mongoose
    .connect('mongodb://123.57.41.105:27017/juejin_blogs', {
      user: 'ruidoc',
      pass: 'z7h47suy5h8e',
    })
    .then(() => {
      next()
    })
    .catch(err => {
      console.log('数据库连接失败：', err)
      res.status(500).send({
        message: '数据库连接失败',
      })
    })
}

module.exports = connect
