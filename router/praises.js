var express = require('express')
var router = express.Router()
var PraisModel = require('../model/praises')
var MessModel = require('../model/messages')
var UsersModel = require('../model/users')

router.all('/', (req, res) => {
  res.send('赞和收藏API')
})

// 添加/取消点赞或收藏
router.post('/toggle', async (req, res, next) => {
  let created_by = req.auth._id
  let body = req.body
  try {
    let { target_user, target_id, target_type } = body
    if (!target_id || !target_type || !target_user) {
      return res.status(400).send({ message: '参数缺失' })
    }
    body.created_by = created_by
    let action = 'delete'
    let result = await PraisModel.findOneAndDelete(body)
    if (!result) {
      action = 'create'
      result = await PraisModel.create(body)
      await MessModel.create({
        source_id: result._id,
        type: 2,
        user_id: target_user,
      })
    }
    await UsersModel.findByIdAndUpdate(target_user, {
      $inc: { jue_power: action == 'create' ? 1 : -1 },
    })
    res.send({
      action,
      message: action == 'create' ? '创建成功' : '取消成功',
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
