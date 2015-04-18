var path = require("path")
var Bluebird = require("bluebird")
var Fluently = require("fluent-ffmpeg")

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
 * extensions "foo" not "foo.mp4".
 * - input_format (String)
 * The format of the video before it is
 * transcoded, like "flv" or "avi".
 * - output_format (String)
 * The format of the video after it has
 * been transcoded, like "mp4" or "ogv".
 * - video_codec (String)(Optional)
 * The name of a video codec that is
 * supported by Fluently.
 * - audio_codec (String)(Optional)
 * The name of an audio codec that is
 * supported by Fluently.
 *
 * OUTPUT
 * - A promise that will resolve when
 * the video has been transcoded, and
 * returns a filepath to the newly
 * transcoded video.
 */

module.exports.transcode = function(file_path, file_format, codecs) {
    return new Bluebird(function(resolve, reject) {
        
        var directory = path.dirname(file_path)
        var initial_file_format = path.extname(file_path).substring(1)
        var file_handle = path.basename(file_path, "." + initial_file_format)
        
        var input_file_path = path.join(directory, file_handle + "." + initial_file_format)
        var output_file_path = path.join(directory, file_handle + "." + file_format)
        
        var process = new Fluently()
        
        process.input(input_file_path)
        process.output(output_file_path)
        
        if(codecs) {
            if(codecs.forVideo) {
                process.videoCodec(codecs.video)
            }
            if(codecs.forAudio) {
                process.audioCodec(codecs.audio)
            }
        }
        
        process.on("error", function(error) {
            reject(error)
        })
        process.on("end", function() {
            resolve(output_file_path)
        })

        process.run()
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
 * extensions "foo" not "foo.mp4".
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
    ]
    
    return Bluebird.all(transcodings)
}
