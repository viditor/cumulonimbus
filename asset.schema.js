var mongoose = require("mongoose");

var asset = mongoose.Schema({
	
	ytid:
	{
		type: String
	},
	time:
	{
		type: Date,
		default: Date.now
	}
	
});

module.exports = mongoose.model("assets", asset);