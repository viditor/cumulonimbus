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
	},
	status:
	{
		type: String
	},
	title:
	{
		type: String
	},
	length:
	{
		type: Number
	}
	
});

module.exports = mongoose.model("assets", asset);