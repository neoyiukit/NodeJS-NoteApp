var mongoose = require("mongoose");

// Schema setup
var campgroundSchema = new mongoose.Schema({
    Name: String,
    image: String,
    desc: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ]
});

module.exports = mongoose.model("Campground", campgroundSchema);