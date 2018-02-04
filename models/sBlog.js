var mongoose = require('mongoose')

var sblogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date , default: Date.now}
})

var sBlog = mongoose.model("sBlog", sblogSchema)

module.exports = {
  sBlog
}
