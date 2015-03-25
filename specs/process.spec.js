var Bluebird = require("bluebird");

var path = require("path");
var fs = Bluebird.promisifyAll(require("fs"));

var ffmpeg = require("../source/ffmpeg.process.js");
var youtube = require("../source/youtube.process.js");

describe("youtube.process.js", function()
{
    it("can download videos from youtube", function(done)
    {
        youtube.download("UiyDmqO59QE", "66770728-6095-4476-af0f-cd121605ec21", function(asset)
        {
            return new Bluebird(function(resolve)
            {
                resolve(asset)
            })
        })
        .then(function(asset)
        {
            expect(asset.files["flv"]).toEqual(path.join(__dirname, "../assets/66770728-6095-4476-af0f-cd121605ec21.flv"));
        })
        .finally(function()
        {
            done();
        });
    });
});

describe("ffmpeg.process.js", function()
{
    it("can transcode videos to other formats", function(done)
    {
        ffmpeg.transcode("./assets", "UiyDmqO59QE", "flv", "mp4").then(function(asset)
        {
            expect(asset).toBe("./assets/UiyDmqO59QE.mp4");
            return asset;
        })
        .then(function(asset)
        {
            return fs.readFileAsync(asset).then(function(file)
            {
                expect(file).toNotEqual(null);
                return file;
            })
        })
        .finally(function()
        {
            done();
        });
    }, 10000);
    
    it("can transcode videos to web compatible formats", function(done)
    {
        ffmpeg.webtranscode("./assets", "UiyDmqO59QE").then(function(assets)
        {
            expect(assets).toEqual([
                "./assets/UiyDmqO59QE.mp4",
                "./assets/UiyDmqO59QE.webm",
                "./assets/UiyDmqO59QE.ogv"
            ]);
            return assets;
        })
        .each(function(asset)
        {
            return fs.readFileAsync(asset).then(function(file)
            {
                expect(file != null).toEqual(true);
                return file;
            })
        })
        .finally(function()
        {
            done();
        });
    }, 50000);
});
