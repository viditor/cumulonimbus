console.log("Welcome to the cloud!");

var mongohq = process.env.MONGOHQ_CLOUD_URL;
var oplog = require("mongo-oplog")(mongohq, "viditor.assets")

oplog.tail(function()
{
	console.log("We are tailing the database!!");
});

oplog.on("insert", function(data)
{
	console.log(data.o);
});