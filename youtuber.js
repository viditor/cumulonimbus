var ytdl = require("ytdl-core");
var fs = require("fs");
var q = require("q");

module.exports.download = function(asset)
{
	var deferred = q.defer();
	
	var downloading = ytdl("http://www.youtube.com/watch?v=" + asset.ytid);
	
	downloading.on("error", function(error) {deferred.reject(error);});
	
	/*downloading.on("data", function(data)
	{
		console.log(data);
	});*/
	
	downloading.on("info", function(info)
	{
		asset.length = info.length_seconds;
		asset.title = info.title;
		asset.save();
	});
	
	downloading.on("end", function() {deferred.resolve(asset);});
	
	downloading.pipe(fs.createWriteStream(process.env.ASSET_ARCHIVE + "/" + asset.ytid + ".flv"));
	
	return deferred.promise;
}