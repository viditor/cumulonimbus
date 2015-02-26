var fs = require("fs")
var path = require("path")
var ytdl = require("ytdl-core")
var Bluebird = require("bluebird")
var AssetStore = require("./asset.store.js")

module.exports.download = function(asset_id, youtube_id)
{
    return new Bluebird(function(resolve, reject)
    {
        var ASSETS_DIRECTORY = path.join(__dirname, "/../assets")
        if(!fs.existsSync(ASSETS_DIRECTORY)) {
            fs.mkdir(ASSETS_DIRECTORY)
        }        

        var file_path = path.join(ASSETS_DIRECTORY, youtube_id + ".flv")
        var youtube_url = "http://www.youtube.com/watch?v=" + youtube_id

        AssetStore.updateAsset(asset_id, {"youtube_id": youtube_id})

        var downloading = ytdl(youtube_url, {quality: 5})
        
        downloading.on("info", function(info, format)
        {
            if(info.title)
            {
                AssetStore.updateAsset(asset_id, {"title": info.title})
            }
            if(info.length_seconds)
            {
                AssetStore.updateAsset(asset_id, {"length": info.length_seconds})
            }
            if(info.thumbnail_url)
            {
                AssetStore.updateAsset(asset_id, {"thumbnail": info.thumbnail_url})
            }

            var current_amount = 0
            var total_amount = format.size
            downloading.on("data", function(data)
            {
                current_amount += data.length
                var progress = (current_amount / total_amount) * 100
                AssetStore.updateAsset(asset_id, {"progress": progress})
            })
        })
        
        downloading.on("error", function(error)
        {
            reject(error)
        })
        
        downloading.on("end", function()
        {
            AssetStore.updateAsset(asset_id, {"files": {"flv": file_path}})
            resolve(asset_id)
        })
        
        downloading.pipe(fs.createWriteStream(file_path))
    })
}
