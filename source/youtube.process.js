var fs = require("fs");
var path = require("path");

var ytdl = require("ytdl-core");
var Bluebird = require("bluebird");

module.exports.download = function(ytid)
{
    return new Bluebird(function(resolve, reject)
    {
        var ASSETS_DIRECTORY = path.join(__dirname, "/../assets");
        
        if(!fs.existsSync(ASSETS_DIRECTORY))
        {
            fs.mkdir(ASSETS_DIRECTORY);
        }

        var file = path.join(ASSETS_DIRECTORY, ytid + ".flv");
        var yturl = "http://www.youtube.com/watch?v=" + ytid;

        var process = ytdl(yturl);
        
        /*process.on("data", function(data)
        {
            console.log(data);
        });*/
        
        /*process.on("info", function(info)
        {
            console.log(info);
        });*/
        
        process.on("error", function(error)
        {
            reject(error);
        });
        
        process.on("end", function()
        {
            resolve(file);
        });
        
        process.pipe(fs.createWriteStream(file));
    });
}
