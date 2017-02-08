var mongoose = require("mongoose");

var versionSchema = new mongoose.Schema({
   name: String,
   author: String
});

module.exports = mongoose.model("Version", versionSchema);