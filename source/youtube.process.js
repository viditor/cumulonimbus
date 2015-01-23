var fs = require("fs");
var ytdl = require("ytdl-core");
var Bluebird = require("bluebird");

module.exports =
{
    download: function(ytid)
    {
        return new Bluebird(function(resolve, reject)
        {
            var filename = ytid + ".flv";
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
                resolve(filename);
            });
            
            process.pipe(fs.createWriteStream(filename));
        });
    }
}
