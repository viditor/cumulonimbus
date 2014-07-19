router = module.exports = require("express").Router();

var ARCHIVED_ASSETS = __dirname + "/archived_assets";
process.env.FFMPEG_PATH = "C:/FFMPEG/bin/ffmpeg.exe";

var execute = require("child_process").exec;
var database = require("mongojs")("viditorcloud", ["assets"]);
var ffmpeg = require("fluent-ffmpeg");

database.assets.remove({});

router.get("/youtube", function(request, response)
{
	database.assets.find({}).sort({}, function(error, assets)
	{
		response.send(assets);
	});
});

router.get("/youtube/:ytid.:ext", function(request, response)
{
	var ytid = request.params.ytid;
	var ext = request.params.ext;
	
	if(ext != "mp4" && ext != "webm" && ext != "ogv" && ext != "flv")
	{
		return response.send(404, {error: "Not a supported video extension."});
	}
	
	database.assets.findOne({ytid: ytid}, function(error, asset)
	{
		if(asset)
		{
			return response.sendfile(ARCHIVED_ASSETS + "/" + ytid + "." + ext);
		}
		else
		{
			return response.send(404, {error: "Unable to access the asset."});
		}
		
		//todo: handle errors in connecting to the database.
	});
});

router.get("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	database.assets.findOne({ytid: ytid}, function(error, asset)
	{
		if(asset)
		{
			return response.send(200, asset);
		}
		else
		{
			return response.send(404, {error: "Unable to access the asset."});
		}
		
		//todo: handle errors in connecting to the database.
	});
});

router.post("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	database.assets.findOne({ytid: ytid}, function(error, asset)
	{
		if(asset)
		{
			return response.send(200, asset);
		}
		else
		{
			var asset = {ytid: ytid, status: "downloading"};
			database.assets.insert(asset, {}, function(error, asset)
			{
				var yturl = "http://www.youtube.com/watch?v=" + ytid;
				var filepath = ARCHIVED_ASSETS + "/" + ytid + ".flv";
				execute("ytdl " + yturl + " > " + filepath, function()
				{
					database.assets.update({ytid: ytid}, {$set: {status: "transcoding"}});
					
					var transcoding = ffmpeg(filepath);
					
					transcoding.on("error", function(error)
					{
						console.log({error: error.message});
					});

					transcoding.on("end", function()
					{
						database.assets.update({ytid: ytid}, {$set: {status: "archived"}});
					});

					transcoding.save(ARCHIVED_ASSETS + "/" + ytid + ".webm");
				});
				
				return response.send(200, asset); //asset?!
			})
		}
		
		//todo: handle errors in connecting to the database.
	});
});