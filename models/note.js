var mongoose = require("mongoose");

// Schema setup
var NoteSchema = new mongoose.Schema({
    Name: String,
    image: String,
    desc: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ],
    versions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Version"
        }
        ]
});

module.exports = mongoose.model("Note", NoteSchema);