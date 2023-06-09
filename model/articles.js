const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const { categories } = require('../config/static')

const articlesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  intro: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: categories.map(cate => cate.key),
    required: true,
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  tags: [
    {
      type: ObjectId,
      required: true,
    },
  ],
  page_view: { type: Number, default: 0 },
  created_by: { type: ObjectId, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})
const Model = mongoose.model('articles', articlesSchema)

module.exports = Model
