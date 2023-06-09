var express = require('express')
var router = express.Router()
var UsersModel = require('../model/users')
var encrypt = require('../utils/crypto')
const { genoJwt } = require('../utils/jwt')

router.all('/', (req, res) => {
  res.send('用户管理API')
})

// 用户注册
router.post('/create', async (req, res, next) => {
  let body = req.body
  try {
    if (!body.password || body.password.length < 6) {
      return res.status(400).send({ message: '密码必传且长度不小于6位' })
    }
    body.password = encrypt(body.password)
    let result = await UsersModel.create(body)
    res.send(result)
  } catch (err) {
    next(err)
  }
})

// 用户登录
router.post('/login', async (req, res, next) => {
  let body = req.body
  try {
    if (!body.phone || !body.password) {
      return res.status(400).send({ message: '请输入手机号和密码' })
    }
    let { phone, password } = body
    password = encrypt(password)
    let result = await UsersModel.findOne({ phone, password })
    if (result) {
      let { _id, username } = result
      let token = genoJwt({ _id, username })
      res.send({
        code: 200,
        data: result,
        token: token,
      })
    } else {
      res.send({
        code: 20001,
        message: '用户名或密码错误',
      })
    }
  } catch (err) {
    next(err)
  }
})

// 修改用户信息
router.put('/update/:id', async (req, res, next) => {
  let body = req.body
  let { id } = req.params
  try {
    let allow_keys = ['username', 'introduc', 'avatar', 'position', 'company']
    Object.keys(body).forEach(key => {
      if (!allow_keys.includes(key)) {
        delete body[key]
      }
    })
    if (Object.keys(body).length == 0) {
      return res.status(400).send({
        message: '请传入要更新的数据',
      })
    }
    await UsersModel.findByIdAndUpdate(id, body)
    res.send({ message: '更新成功' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
