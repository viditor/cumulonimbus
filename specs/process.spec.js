var fs = require("fs");
var ffmpeg = require("../source/ffmpeg.process.js");

describe("FFMPEG Process", function()
{
    it("can transcode videos to other formats", function(done)
    {
        ffmpeg.transcode("../assets", "kfchvCyHmsc", "flv", "mp4").then(function(asset)
        {
            expect(asset).toBe("../assets/kfchvCyHmsc.mp4");
            fs.exists("../assets/kfchvCyHmsc.mp4", function(exists)
            {
                expect(exists).toEqual(true);
                done();
            });
        });
    });
    
    it("can transcode videos to web compatible formats", function(done)
    {
        ffmpeg.webtranscode("../assets", "kfchvCyHmsc").then(function(assets)
        {
            expect(assets).toEqual([
                "../assets/kfchvCyHmsc.mp4",
                "../assets/kfchvCyHmsc.webm",
                "../assets/kfchvCyHmsc.ogv"
            ]);
            
            assets.forEach(function(asset, index)
            {
                fs.exists(asset, function(exists)
                {
                    expect(exists).toEqual(true);
                    
                    if(index == assets.length - 1)
                    {
                        done();
                    }
                });
            });
        });
    });
});
