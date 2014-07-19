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
	Asset.find({}).exec().then(function(assets)
	{
		response.send(200, assets);
	},
	function(reason)
	{
		response.send(404, reason);
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
	
	Asset.findOne({ytid: ytid}).exec().then(function(asset)
	{
		//todo: ensure the asset is finished transcoding.
		
		if(asset)
		{
			response.sendfile(200, ARCHIVED_ASSETS + "/" + ytid + "." + ext);
		}
		else
		{
			response.send(404, ERROR.INACCESSIBLE);
		}
	},
	function(reason)
	{
		response.send(404, reason);
	});
});

router.get("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	Asset.findOne({ytid: ytid}).exec().then(function(asset)
	{
		if(asset)
		{
			response.send(200, asset);
		}
		else
		{
			response.send(404, ERROR.INACCESSIBLE);
		}
	},
	function(reason)
	{
		response.send(404, reason);
	});
});

router.post("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	Asset.findOne({ytid: ytid}).exec().then(function(asset)
	{
		if(asset)
		{
			return asset;
		}
		else
		{
			return Asset.create({ytid: ytid});
		}
	})
	.then(function(asset)
	{
		response.send(200, asset);
	},
	function(reason)
	{
		response.send(404, reason);
	});
});

var ARCHIVED_ASSETS = __dirname + "/archived_assets";
process.env.FFMPEG_PATH = "C:/FFMPEG/bin/ffmpeg.exe";

var execute = require("child_process").exec;
var ffmpeg = require("fluent-ffmpeg");