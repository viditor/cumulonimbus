/*server = require("express")();
server.use(require("morgan")({format: "dev"}));
server.use("/v1", require("./router.v1.js"));

var port = process.env.PORT || 8080;
console.log("Listening on " + port);
server.listen(port);*/

process.env.ASSET_ARCHIVE = "./archived_assets";
process.env.FFMPEG_PATH = "C:/FFMPEG/bin/ffmpeg.exe";

var youtuber = require("./youtuber.js");
var ffmpeger = require("./ffmpeger.js");

console.log("now downloading the asset");
youtuber.download("61q5Q4SIbcI")

.then(function(ytid)
{
	console.log("now transcoding the asset");
	return ffmpeger.transcode(ytid);
})

.then(function(ytid)
{
	console.log("finished with the asset!");
},
function(reason)
{
	console.log(reason);
});