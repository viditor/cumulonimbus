var fs = require("fs")
var path = require("path")
var Bluebird = require("bluebird")
var YoutubeDownloader = require("ytdl-core")

module.exports.download = function(youtube_id, update_asset)
{
    return new Bluebird(function(resolve, reject)
    {
        var ASSETS_DIRECTORY = path.join(__dirname, "/../assets")
        if(!fs.existsSync(ASSETS_DIRECTORY))
        {
            fs.mkdir(ASSETS_DIRECTORY)
        }        
        
        var file_path = path.join(ASSETS_DIRECTORY, youtube_id + ".flv")
        var youtube_url = "http://www.youtube.com/watch?v=" + youtube_id
        update_asset({"youtube_id": youtube_id, "youtube_url": youtube_url})
        
        var downloading = YoutubeDownloader(youtube_url, {quality: 5})
        
        downloading.on("info", function(info, format)
        {
            if(info.title)
            {
                update_asset({"title": info.title})
            }
            if(info.length_seconds)
            {
                update_asset({"length": info.length_seconds})
            }
            if(info.thumbnail_url)
            {
                update_asset({"thumbnail": info.thumbnail_url})
            }
            
            var current_amount = 0
            var total_amount = format.size
            downloading.on("data", function(data)
            {
                current_amount += data.length
                var progress = (current_amount / total_amount) * 100
                update_asset({"progress": progress})
            })
        })
        
        downloading.on("error", function(error)
        {
            reject(error)
        })
        
        downloading.on("end", function()
        {
            update_asset({"files": {"flv": file_path}}).then(function(asset)
            {
                resolve(asset)
            })
        })
        
        downloading.pipe(fs.createWriteStream(file_path))
    })
}
