var fs = require("fs");
var ytdl = require("ytdl-core");
var Bluebird = require("bluebird");

var ASSETS_DIRECTORY = __dirname + "/../assets/";

module.exports =
{
    download: function(ytid)
    {
        return new Bluebird(function(resolve, reject)
        {
            if(!fs.existsSync(ASSETS_DIRECTORY))
            {
                fs.mkdir(ASSETS_DIRECTORY);
            }

            var file = ASSETS_DIRECTORY + ytid + ".flv";
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
}

console.log(Date.now(), "Beginning Youtube Download");
module.exports.download("FD_SbJCQovU").then(function()
{
    console.log(Date.now(), "Finishing Youtube Download");
})
