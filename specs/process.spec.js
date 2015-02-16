var Bluebird = require("bluebird");
var fs = Bluebird.promisifyAll(require("fs"));
var ffmpeg = require("../source/ffmpeg.process.js");

describe("FFMPEG Process", function()
{
    it("can transcode videos to other formats", function(done)
    {
        ffmpeg.transcode("./assets", "kfchvCyHmsc", "flv", "mp4").then(function(asset)
        {
            expect(asset).toBe("./assets/kfchvCyHmsc.mp4");
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
    });
    
    it("can transcode videos to web compatible formats", function(done)
    {
        ffmpeg.webtranscode("./assets", "kfchvCyHmsc").then(function(assets)
        {
            expect(assets).toEqual([
                "./assets/kfchvCyHmsc.mp4",
                "./assets/kfchvCyHmsc.webm",
                "./assets/kfchvCyHmsc.ogv"
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
    });
});
