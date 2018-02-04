var mongoose = require('mongoose')

var cblogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date , default: Date.now}
})

var cBlog = mongoose.model("cBlog", cblogSchema)

module.exports = {
  cBlog
}