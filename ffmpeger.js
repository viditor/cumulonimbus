var ffmpeg = require("fluent-ffmpeg");
var q = require("q");

module.exports.transcode = function(ytid)
{
	return q.all([
		transcode(ytid, "flv", "mp4", "libx264"),
		transcode(ytid, "flv", "webm", "libvpx", "libvorbis"),
		transcode(ytid, "flv", "ogv", "libtheora", "libvorbis")
	]);
}

function transcode(ytid, input, output, vcodec, acodec)
{
	var deferred = q.defer();
	
	var transcoding = ffmpeg();
	
	transcoding.input(process.env.ASSET_ARCHIVE + "/" + ytid + "." + input);
	transcoding.output(process.env.ASSET_ARCHIVE + "/" + ytid + "." + output);
	
	if(vcodec) {transcoding.videoCodec(vcodec);}
	if(acodec) {transcoding.audioCodec(acodec);}
	
	transcoding.on("error", function(error) {deferred.reject(error);});
	//transcoding.on("progress", function(progress) {console.log(output, progress.frames);});
	transcoding.on("end", function() {deferred.resolve(output);});

	transcoding.run();
	
	return deferred.promise;
}

function merge()
{
	//https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#mergetofilefilename-tmpdir-concatenate-multiple-inputs
}

function trim()
{
	//https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#seektime-seek-output
	//https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#durationtime-set-output-duration
}