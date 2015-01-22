var q = require("q");
var fs = require("fs");
var ytdl = require("ytdl-core");

function youtube(ytid)
{
    var deferred = q.defer();
    
    var file = ytid + ".flv";
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
        deferred.reject(error);
    });
    
    process.on("end", function()
    {
        deferred.resolve(file);
    });
    
    process.pipe(fs.createWriteStream(file));
    
    return deferred.promise;
}
