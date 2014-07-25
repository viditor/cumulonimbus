router = module.exports = require("express").Router();

process.env.ASSET_ARCHIVE = ARCHIVE = __dirname + "/archived_assets";
process.env.FFMPEG_PATH = "C:/FFMPEG/bin/ffmpeg.exe";

var ERROR = 
{
	INACCESSIBLE: "Unable to access the asset.",
	UNSUPPORTED: "Not a supported asset extension.",
	INVALID_YTID: "Received an invalid youtube id."
}

Asset = require("./asset.schema.js");
Asset.remove({}, function(error) {});

var q = require("q");

var youtuber = require("./youtuber.js");
var ffmpeger = require("./ffmpeger.js");

router.use(function(request, response, next)
{
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

router.get("/", function(request, response)
{
	response.sendfile("docs.v1.txt");
});

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
	
	if(!/^.{11}$/.test(ytid))
	{
		return response.send(404, ERROR.INVALID_YTID);
	}
	
	if(ext != "mp4" && ext != "webm" && ext != "ogv" && ext != "flv")
	{
		return response.send(404, ERROR.UNSUPPORTED);
	}
	
	Asset.findOne({ytid: ytid, status: "archived"}).exec().then(function(asset)
	{
		if(asset)
		{
			response.sendfile(ARCHIVE + "/" + ytid + "." + ext);
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
	
	if(!/^.{11}$/.test(ytid))
	{
		return response.send(404, ERROR.INVALID_YTID);
	}
	
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
	
	if(!/^.{11}$/.test(ytid))
	{
		return response.send(404, ERROR.INVALID_YTID);
	}
	
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

router.post("/compile", function(request, response)
{
	console.log(request.body);
	
	response.send(200);
});