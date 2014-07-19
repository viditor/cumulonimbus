router = module.exports = require("express").Router();

process.env.ASSET_ARCHIVE = ARCHIVE = __dirname + "/archived_assets";
process.env.FFMPEG_PATH = "C:/FFMPEG/bin/ffmpeg.exe";

var ERROR = 
{
	INACCESSIBLE: "Unable to access the asset.",
	UNSUPPORTED: "Not a supported asset extension."
}

mongoose = require("mongoose");
mongoose.connect("localhost/viditcloud");
Asset = require("./asset.schema.js");
Asset.remove({}, function(error) {});

var q = require("q");

var youtuber = require("./youtuber.js");
var ffmpeger = require("./ffmpeger.js");

router.get("/youtube", function(request, response)
{
	Asset.find({}).exec().then(function(assets)
	{
		response.send(200, assets);
	},
	function(error)
	{
		response.send(404, error);
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
			response.sendfile(200, ARCHIVE + "/" + ytid + "." + ext);
		}
		else
		{
			response.send(404, ERROR.INACCESSIBLE);
		}
	},
	function(error)
	{
		response.send(404, error);
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
	function(error)
	{
		response.send(404, error);
	});
});

router.post("/youtube/:ytid", function(request, response)
{
	var ytid = request.params.ytid;
	
	Asset.findOne({ytid: ytid}).exec()
	
	.then(function(asset)
	{
		if(asset)
		{
			return asset;
		}
		else
		{
			return Asset.create({ytid: ytid})
			.then(function(asset)
			{
				q.fcall(function()
				{
					asset.set("status", "downloading").save();
					return youtuber.download(asset.ytid);
				})
				.then(function()
				{
					asset.set("status", "transcoding").save();
					return ffmpeger.transcode(asset.ytid);
				})
				.then(function()
				{
					asset.set("status", "archived").save();
				});
				
				return asset;
			});
		}
	})
	.then(function(asset)
	{
		response.send(200, asset);
	},
	function(error)
	{
		response.send(404, error);
	})
	
	.end();
});