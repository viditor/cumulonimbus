
var Bluebird = require("bluebird");
var ffmpeg = require("fluent-ffmpeg");

/**
 * TRANSCODE: decodes and encodes a
 * video in a different format.
 *
 * INPUT
 * - directory (String)
 * Where the video is pulled, and where
 * the transcoded file will be pushed.
 * - file_handle (String)
 * The name of the video *without* any
 * extensions; "foo" not "foo.mp4".
 * - input_format (String)
 * The format of the video before it is
 * transcoded, like "flv" or "avi".
 * - output_format (String)
 * The format of the video after it has
 * been transcoded, like "mp4" or "ogv".
 * - video_codec (String)(Optional)
 * The name of a video codec that is
 * supported by FFMPEG.
 * - audio_codec (String)(Optional)
 * The name of an audio codec that is
 * supported by FFMPEG.
 *
 * OUTPUT
 * - A promise that will resolve when
 * the video has been transcoded, and
 * returns a filepath to the newly
 * transcoded video.
 */
 
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
        
        transcoding.on("end", function()
        {
            resolve(output_file);
        });

        transcoding.run();
    })
}

/**
 * WEBTRANSCODE: decodes and encodes
 * video into the different formats
 * needed for the web.
 *
 * INPUT
 * - directory (String)
 * Where the video is pulled, and where
 * the transcoded file will be pushed.
 * - file_handle (String)
 * The name of the video *without* any
 * extensions; "foo" not "foo.mp4".
 * - input_format (String)
 * The format of the video before it is
 * transcoded, like "flv" or "avi".
 * - output_format (String)
 * The format of the video after it has
 * been transcoded, like "mp4" or "ogv".
 * - video_codec (String)(Optional)
 * The name of a video codec that is
 * supported by FFMPEG.
 * - audio_codec (String)(Optional)
 * The name of an audio codec that is
 * supported by FFMPEG.
 *
 * OUTPUT
 * - A promise that will resolve when
 * the video has been transcoded into
 * three different formats, including
 * WEBM, OGV and MP4, and returns an
 * array of filepaths to the newly
 * transcoded videos.
 */
 
module.exports.webtranscode = function(directory, file_handle)
{
    var transcodings = [
        module.exports.transcode(directory, file_handle, "flv", "mp4", "libx264"),
        module.exports.transcode(directory, file_handle, "flv", "webm", "libvpx", "libvorbis"),
        module.exports.transcode(directory, file_handle, "flv", "ogv", "libtheora", "libvorbis")
    ];
    
    return Bluebird.all(transcodings);
}
