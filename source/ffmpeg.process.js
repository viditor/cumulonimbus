
var Bluebird = require("bluebird");
var ffmpeg = require("fluent-ffmpeg");

module.exports.transcode = function(directory, file_handle,
                                    input_format, output_format,
                                    video_codec, audio_codec)
{
    return new Bluebird(function(resolve, reject)
    {
        var transcoding = ffmpeg();
        
        var input_file = directory + "/" + file_handle + "." + input_format;
        var output_file = directory + "/" + file_handle + "." + output_format;
        
        transcoding.input(input_file);
        transcoding.output(output_file);
        
        if(video_codec)
        {
            transcoding.videoCodec(video_codec);
        }
        if(audio_codec)
        {
            transcoding.audioCodec(audio_codec);
        }
        
        transcoding.on("error", function(error)
        {
            reject(error);
        });
        
        //transcoding.on("progress", function(progress)
        //{
        //    console.log(output, progress.frames);
        //});
        
        transcoding.on("end", function()
        {
            resolve(output_file);
        });

        transcoding.run();
    })
}

module.exports.splice = function(a, b)
{
    ffmpeg()
    .input(a)
    .on("error", function(error, stdout, stderr)
    {
      console.log(stderr);
    })
    .on("end", function()
    {
        console.log("Splicing finished!");
    })
    .mergeToFile("../assets/output.avi", "../temp/");
}

module.exports.transcode("../assets/", "kfchvCyHmsc", "flv", "mp4", "libx264").then(function()
{
    console.log("Done!")
})

//module.exports.splice("../assets/kfchvCyHmsc.flv",
//                      "../assets/UiyDmqO59QE.flv")

//require("./youtube.process").download("kfchvCyHmsc")
//require("./youtube.process").download("UiyDmqO59QE")
