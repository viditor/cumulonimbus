var flattener = require("../source/flattener.process.js");

describe("flattener.process.js", function()
{
    it("\n" +
        "AAAA\n" +
        "----\n" +
        "AAAA", function(done)
    {
        var input =  [createTestClip("AAAA", 0)];
        var output = [createTestClip("AAAA", 0)];

        flattener.flatten(input).then(function(result)
        {
            expect(result).toEqual(output);
        })
        .finally(function()
        {
            done();
        });
    });

    it ("\n" + 
        "AAAABBBB\n" +
        "--------\n" +
        "AAAABBBB", function(done)
    {
        var input =  [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];
        var output = [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];

        flattener.flatten(input).then(function(result)
        {
            expect(result).toEqual(output);
        })
        .finally(function()
        {
            done();
        });
    });

    it ("\n" +
        "AAAA    \n" +
        "    BBBB\n" +
        "--------\n" +
        "AAAABBBB", function(done)
    {
        var input =  [createTestClip("AAAA", 0), createTestClip("    BBBB", 1)];
        var output = [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];

        flattener.flatten(input).then(function(result)
        {
            expect(result).toEqual(output);
        })
        .finally(function()
        {
            done();
        });
    });

    it ("\n" +
        "AAAA    BBBB\n" +
        "------------\n" +
        "AAAA0000BBBB", function(done)
    {
        var input =
        [
            createTestClip("AAAA", 0),
            createTestClip("        BBBB", 0)
        ];
        var output = 
        [
            createTestClip("AAAA", 0),
            createTestClip("    0000", 0),
            createTestClip("        BBBB", 0)
        ];

        flattener.flatten(input).then(function(result)
        {
            expect(result).toEqual(output);
        })
        .finally(function()
        {
            done();
        });
    });
});


// Creates a test clip by looking at code string and track integer
function createTestClip(code, track)
{
    var name = code.replace(/^\s+/, "");
    var leftSpaceLength = code.length - name.length;

    return {
        "_id": "test-clip-" + name,
        "asset_id": "test-asset-" + name,
        "project_id": "test-project",
        "trim":
        {
            "left": 0,
            "right": 0
        },
        "length": name.length * 1000,
        "tick": leftSpaceLength * 1000,
        "track": track
    };
}
