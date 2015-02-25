var flattener = require("../source/flattener.process.js");

describe("flattener.process.js", function()
{
    it("\n" +
        "AAAA\n" +
        "----\n" +
        "AAAA", function()
    {
        var input =  [createTestClip("AAAA", 0)];
        var output = [createTestClip("AAAA", 0)];

        expect(flattener.flatten(input)).toEqual(output);
    });

    it ("\n" + 
        "AAAABBBB\n" +
        "--------\n" +
        "AAAABBBB", function()
    {
        var input =  [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];
        var output = [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];

        expect(flattener.flatten(input)).toEqual(output);
    });

    it ("\n" +
        "AAAA    \n" +
        "    BBBB\n" +
        "--------\n" +
        "AAAABBBB", function()
    {
        var input =  [createTestClip("AAAA", 0), createTestClip("    BBBB", 1)];
        var output = [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];

        expect(flattener.flatten(input)).toEqual(output);
    });

    it ("\n" +
        "AAAA    BBBB\n" +
        "------------\n" +
        "AAAA0000BBBB", function()
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

        expect(flattener.flatten(input)).toEqual(output);
    });


    it ("\n" +
        "AAAA        \n" +
        "        BBBB\n" +
        "------------\n" +
        "AAAA0000BBBB", function()
    {
        var input =
        [
            createTestClip("AAAA", 0),
            createTestClip("        BBBB", 1)
        ];
        var output = 
        [
            createTestClip("AAAA", 0),
            createTestClip("    0000", 0),
            createTestClip("        BBBB", 0)
        ];

        expect(flattener.flatten(input)).toEqual(output);
    });

    it ("\n" +
        "    AAAA\n" +
        "--------\n" +
        "0000AAAA", function()
    {
        var input = [createTestClip("    AAAA", 0)];
        var output = 
        [
            createTestClip("0000", 0),
            createTestClip("    AAAA", 0),
        ];

        expect(flattener.flatten(input)).toEqual(output);
    });
});


// Creates a test clip by looking at code string and track integer
function createTestClip(code, track)
{
    var name = code.replace(/^\s+/, "");
    var leftSpaceLength = code.length - name.length;

    var testClip = {
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

    if (name.indexOf("0") > -1)
    {
        testClip._id = "blackness-placeholder";
        testClip.asset_id = "blackness-placeholder";
    }

    return testClip;
}
