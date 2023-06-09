var express = require('express')
var router = express.Router()
const { Types } = require('mongoose')
var ArtsModel = require('../model/articles')
var UsersModel = require('../model/users')

router.all('/', (req, res) => {
  res.send('文章管理API')
})

// 新建文章
router.post('/create', async (req, res, next) => {
  let body = req.body
  try {
    let result = await ArtsModel.create(body)
    let { created_by } = body
    await UsersModel.findByIdAndUpdate(created_by, {
      $inc: { jue_power: 10 },
    })
    res.send(result)
  } catch (err) {
    next(err)
  }
})

// 发布文章
router.post('/publish/:id', async (req, res, next) => {
  let { id } = req.params
  try {
    let result = await ArtsModel.findByIdAndUpdate(id, { status: 1 })
    res.send(result)
  } catch (err) {
    next(err)
  }
})

// 删除文章
router.delete('/remove/:id', async (req, res, next) => {
  let { id } = req.params
  try {
    let result = await ArtsModel.findByIdAndDelete(id)
    if (result) {
      res.send({ message: '删除成功' })
    } else {
      res.status(400).send({ message: '文档未找到，删除失败' })
    }
  } catch (err) {
    next(err)
  }
})

// 修改文章
router.put('/update/:id', async (req, res, next) => {
  let body = req.body
  let { id } = req.params
  try {
    let allow_keys = ['title', 'intro', 'content', 'category', 'tags']
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
    body.updated_at = new Date()
    await ArtsModel.findByIdAndUpdate(id, body)
    res.send({ message: '更新成功' })
  } catch (err) {
    next(err)
  }
})

// 文章列表
router.get('/list', async (req, res, next) => {
  let user_id = req.auth._id
  try {
    let where = {
      status: 1,
      ...req.query,
    }
    let result = await ArtsModel.aggregate([
      {
        $match: where,
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'source_id',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'praises',
          localField: '_id',
          foreignField: 'target_id',
          as: 'praises',
        },
      },
      {
        $addFields: {
          praises: {
            $filter: {
              input: '$praises',
              as: 'arrs',
              cond: { $eq: ['$$arrs.type', 1] },
            },
          },
          comments: {
            $size: '$comments',
          },
        },
      },
      {
        $addFields: {
          is_praise: {
            $in: [ObjectId(user_id), '$praises.created_by'],
          },
          praises: {
            $size: '$praises',
          },
        },
      },
    ])
    res.send(result)
  } catch (err) {
    next(err)
  }
})

// 文章详情
router.get('/detail/:id', async (req, res, next) => {
  let { id } = req.params
  let { user_id } = req.query
  try {
    let result = await ArtsModel.aggregate([
      {
        $match: {
          _id: ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'praises',
          localField: '_id',
          foreignField: 'target_id',
          as: 'praises',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'created_by',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $addFields: {
          praises: {
            $filter: {
              input: '$praises',
              as: 'arrs',
              cond: { $eq: ['$$arrs.type', 1] },
            },
          },
          stars: {
            $filter: {
              input: '$praises',
              as: 'arrs',
              cond: { $eq: ['$$arrs.type', 2] },
            },
          },
          user: {
            $first: '$user',
          },
        },
      },
      {
        $addFields: {
          is_praise: {
            $in: [ObjectId(user_id), '$praises.created_by'],
          },
          praises: {
            $size: '$praises',
          },
          is_start: {
            $in: [ObjectId(user_id), '$stars.created_by'],
          },
          stars: {
            $size: '$stars',
          },
        },
      },
      {
        $unset: ['user.password', 'user.__v'],
      },
    ])
    res.send(result[0])
  } catch (err) {
    next(err)
  }
})

module.exports = router
