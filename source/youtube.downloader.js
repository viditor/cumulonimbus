var ytdl = require('ytdl-core');
var fs = require('fs');
var db = require("mongojs").connect("mongodb://localhost", ['assets']);

module.exports =
{
    download: function(ytid)
    {
        ytdl("http://www.youtube.com/watch?v=" + ytid)
            .pipe(fs.createWriteStream(ytid + ".flv"));

        db.assets.save
        ({
            "ytid": ytid,
            "downloadTime": Date.now()
        });
    }
}
