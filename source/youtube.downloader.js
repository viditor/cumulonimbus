var ytdl = require('ytdl-core');
var fs = require('fs');

module.exports =
{
    download: function(ytid)
    {
        ytdl("http://www.youtube.com/watch?v=" + ytid)
            .pipe(fs.createWriteStream(ytid + ".flv"));
    }
}
