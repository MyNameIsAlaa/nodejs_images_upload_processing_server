var Mongoose = require("mongoose");

var File = new Mongoose.Schema({
    fileName: {type:String},
    file_url: {type:String},
    uploadDate: {type: Date, default: Date.now}
});

module.exports = Mongoose.model("File", File);
