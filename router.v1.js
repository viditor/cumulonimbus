router = module.exports = require("express").Router();

var execute = require("child_process").exec;
var database = {/*not actually the database*/};

router.get("/youtube", function(request, response)
{
	response.send(database);
});

router.get("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	if(database[ytid])
	{
		response.send(200, database[ytid]);
	}
	else
	{
		response.send(404, "Invalid Youtube ID");
	}
});

router.post("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	if(!database[ytid])
	{
		execute("ytdl.bat " + ytid, function(error, stdout, stderr)
		{
			if(!stderr)
			{
				database[ytid] = "./archived_files/" + ytid + ".flv";
				response.send(200);
			}
			else
			{
				response.send(404, stderr);
			}
		});
	}
	else
	{
		response.send(404, "Video already downloaded");
	}
});