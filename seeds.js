var mongoose = require("mongoose");
var Note = require("./models/note");
var Comment = require("./models/comment");

// pre-set datasets
var data = [
    {
      Name: "Note 1",
      image: "http://gitaarik.github.io/print-sticky-notes/scrum-note.jpg",
      desc: "Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content."
    }, 
    {
      Name: "Note 2",
      image: "https://s-media-cache-ak0.pinimg.com/originals/be/f4/30/bef43058445b8a7235ef28e1b16a7ebc.png",
      desc: "Note 2 Content. Note 2 Content. Note 2 Content. Note 2 Content. Note 2 Content."
    },
    {
      Name: "Note 3",
      image: "https://madstroelshansen.files.wordpress.com/2012/09/skrmbillede-2012-09-06-kl-22-33-43.png",
      desc: "Note 3 Content. Note 3 Content. Note 3 Content. Note 3 Content. Note 3 Content."
    },
        {
      Name: "Note 1",
      image: "http://gitaarik.github.io/print-sticky-notes/scrum-note.jpg",
      desc: "Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content. Note 1 Content."
    }, 
    {
      Name: "Note 2",
      image: "https://s-media-cache-ak0.pinimg.com/originals/be/f4/30/bef43058445b8a7235ef28e1b16a7ebc.png",
      desc: "Note 2 Content. Note 2 Content. Note 2 Content. Note 2 Content. Note 2 Content."
    },
    {
      Name: "Note 3",
      image: "https://madstroelshansen.files.wordpress.com/2012/09/skrmbillede-2012-09-06-kl-22-33-43.png",
      desc: "Note 3 Content. Note 3 Content. Note 3 Content. Note 3 Content. Note 3 Content."
    }
];

function seedDB(){
    //reset all notes
   Note.remove({}, function(err){
    if(err){
    console.log(err); 
    }
   console.log("removed notes");
   // add in the preset notes
    data.forEach(function(seed){
    Note.create(seed, function(err, note){
        if(err){
            console.log(err);
        } else {
            console.log("added a note");
            // add a few comments
            Comment.create(
                {
                    text: "This is comment 1 for the note.",
                    author: "neo"
                    }, function(err, comment){
                        if(err) {
                            console.log(err);
                        } else {
                       note.comments.push(comment);
                       note.save();
                       console.log("created new comment");
                        }
                    });
                }
    });
});
}); 
}
module.exports = seedDB;