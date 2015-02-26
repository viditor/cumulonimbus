var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AssetSchema = new Schema({
    "asset_id": Number,
    "youtube_id": String,
    "title": String,
    "length": Number,
    "thumbnail": Number,
    "files": {
        "flv": String,
        "mp4": String,
        "webm": String,
        "ogv": String
    },
    "dates": {
        "created": Number,
        "touched": Number
    }
});

assetSchema.methods.touch = function(callback) {
    if(typeof callback === "undefined") {
        callback = function(error) {
            if(error) {
                console.error(error)
            }
        }
    }
    this.dates.touched = Date.now()
    this.save(callback)
}

module.exports = mongoose.model("assets", AssetSchema)
