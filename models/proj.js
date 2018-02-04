var mongoose = require('mongoose')

var projectSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date , default: Date.now}
})

var proj = mongoose.model("proj", projectSchema)

module.exports = {
  proj
}