var express = require('express')
var router = express.Router()
var FollowsModel = require('../model/follows')
var MessModel = require('../model/messages')

router.all('/', (req, res) => {
  res.send('关注和粉丝API')
})

// 关注用户
router.post('/toggle', async (req, res, next) => {
  let body = req.body
  try {
    let { user_id, fans_id } = body
    if (!user_id || !fans_id) {
      return res.status(400).send({ message: '参数缺失' })
    }
    let action = 'delete'
    let result = await FollowsModel.findOneAndDelete(body)
    if (!result) {
      action = 'create'
      result = await FollowsModel.create(body)
      await MessModel.create({
        source_id: result._id,
        type: 3,
        user_id,
      })
    }
    res.send({
      action,
      message: action == 'create' ? '关注成功' : '取消关注成功',
    })
  } catch (err) {
    next(err)
  }
})

// 获取关注列表
router.get('/lists', async (req, res, next) => {
  let user_id = req.auth._id
  try {
    let result = await FollowsModel.aggregate([
      {
        $match: {
          user_id: ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'fans_id',
          foreignField: '_id',
          as: 'fans_info',
        },
      },
      {
        $lookup: {
          from: 'follows',
          let: {
            uid: '$user_id',
            fid: '$fans_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user_id', '$$fid'] },
                    { $eq: ['$fans_id', '$$uid'] },
                  ],
                },
              },
            },
          ],
          as: 'is_follow',
        },
      },
      {
        $addFields: {
          fans_info: {
            $first: '$fans_info',
          },
          is_follow: {
            $gt: [{ $size: '$is_follow' }, 0],
          },
        },
      },
      {
        $unset: [
          'fans_info.__v',
          'fans_info.password',
          'fans_info.company',
          'fans_info.good_num',
          'fans_info.jue_power',
          'fans_info.read_num',
        ],
      },
    ])
    res.send(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
