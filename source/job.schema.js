var mongoose = require("mongoose");

var job = mongoose.Schema({
    operation: {type: String},
    status: {type: String},
    ytid: {type: Number}
});

module.exports = mongoose.model("jobs", job);
