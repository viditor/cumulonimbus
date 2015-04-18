var fs = require("fs")
var path = require("path")
var ytdl = require("ytdl-core")
var shortid = require("shortid")
var Bluebird = require("bluebird")

module.exports.download = function(youtube_id) {
    return new Bluebird(function(resolve, reject) {
        var video = {
            "youtube_id": youtube_id,
            "youtube_url": "http://www.youtube.com/watch?v=" + youtube_id
        }
        var process = ytdl(video.youtube_url, {"quality": 5})
        process.on("info", function(info, format) {
            if(info.title) {
                video.title = info.title
            }
            if(info.length_seconds) {
                video.duration = info.length_seconds
            }
            if(info.thumbnail_url) {
                video.thumbnail = info.thumbnail_url
            }
        })
        process.on("error", function(error) {
            reject(error)
        })
        process.on("end", function() {
            resolve(video)
        })
        var assets_directory = path.join(__dirname, "/../assets")
        if(!fs.existsSync(assets_directory)) {
            fs.mkdir(assets_directory)
        }
        video.file_path = path.join(assets_directory, youtube_id + ".flv")
        process.pipe(fs.createWriteStream(video.file_path))
    })
}

//todo: handle invalid youtube_urls
//todo: select any quality, not just 5
