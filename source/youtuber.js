function youtube(ytid)
{
    var deferred = q.defer();
    
    var process = ytdl("http://www.youtube.com/watch?v=" + ytid);
    
    /*process.on("data", function(data)
    {
        console.log(data);
    });*/
    
    process.on("info", function(info)
    {
        console.log(info);
    });
    
    process.on("error", function(error)
    {
        deferred.reject(error);
    });
    
    process.on("end", function()
    {
        deferred.resolve(asset);
    });
    
    process.pipe(fs.createWriteStream("assets" + "/" + ytid + ".flv"));
    
    return deferred.promise;
}

youtube().then(function()
{
    console.log("!")
})