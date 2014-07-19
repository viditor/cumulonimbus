router = module.exports = require("express").Router();

mongoose = require("mongoose");
mongoose.connect("localhost/viditcloud");

Asset = require("./asset.schema.js");
Asset.remove({}, function(error) {});

var ERROR = 
{
	INACCESSIBLE: "Unable to access the asset.",
	UNSUPPORTED: "Not a supported asset extension."
}

router.get("/youtube", function(request, response)
{
	Asset.find({}, function(error, assets)
	{
		if(error)
		{
			return response.send(404, {error: error});
		}
		
		return response.send(200, assets);
	});
});

router.get("/youtube/:ytid.:ext", function(request, response)
{
	var ytid = request.params.ytid;
	var ext = request.params.ext;
	
	if(ext != "mp4" && ext != "webm" && ext != "ogv" && ext != "flv")
	{
		return response.send(404, ERROR.UNSUPPORTED);
	}
	
	Asset.findOne({ytid: ytid}, function(error, asset)
	{
		//todo: ensure the asset is finished transcoding.
		
		if(error) {return response.send(404, error.message);}
		if(!asset) {return response.send(404, ERROR.INACCESSIBLE);}
		
		return response.sendfile(200, ARCHIVED_ASSETS + "/" + ytid + "." + ext);
	});
});

router.get("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	Asset.findOne({ytid: ytid}, function(error, asset)
	{
		if(error) {return response.send(404, error.message);}
		if(!asset) {return response.send(404, ERROR.INACCESSIBLE);}
		
		return response.send(200, asset);
	});
});

router.post("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	Asset.findOne({ytid: ytid}, function(error, asset)
	{
		if(error)
		{
			return response.send(404, error.message);
		}
		
		if(asset)
		{
			return response.send(200, asset);
		}
		else
		{
			Asset.create({ytid: ytid}, function(error, asset)
			{
				return response.send(200, asset);
			});
		}
	});
});

var ARCHIVED_ASSETS = __dirname + "/archived_assets";
process.env.FFMPEG_PATH = "C:/FFMPEG/bin/ffmpeg.exe";

var execute = require("child_process").exec;
var ffmpeg = require("fluent-ffmpeg");