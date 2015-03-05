var flattener = require("../source/flattener.process.js");

describe("flattener.process.js", function()
{
    // Case #1
    it("\n" +
        "AAAA\n" +
        "----\n" +
        "AAAA", function()
    {
        var input =  [createTestClip("AAAA", 0)];
        var output = [createTestClip("AAAA", 0)];

        expect(flattener.flatten(input)).toEqual(output);
    });

    // Case #2
    it ("\n" + 
        "AAAABBBB\n" +
        "--------\n" +
        "AAAABBBB", function()
    {
        var input =  [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];
        var output = [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];

        expect(flattener.flatten(input)).toEqual(output);
    });

    // Case #3
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

    // Case #4
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

    // Case #5
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

    // Case #6
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

    // Case #7
    it ("\n" +
        "AAAA  \n" +
        "  BBBB\n" +
        "------\n" +
        "AA##BB\n" +
        "(# = [A, B])\n", function()
    {
        var inputClipA = createTestClip("AAAA", 0);
        var inputClipB = createTestClip("  BBBB", 1);
        var input =  [inputClipA, inputClipB];

        var outputClipA = cloneClip(inputClipA);
            outputClipA.trim.right += 2000;

        var outputClipAB = cloneClip(input[1]);
            outputClipAB.track = 0;
            outputClipAB.length = 2000;
            tagAsContainer(outputClipAB);

            var innerClipA = cloneClip(inputClipA);
                innerClipA.trim.left += 2000;

            var innerClipB = cloneClip(inputClipB);
                innerClipB.trim.right += 2000;

            outputClipAB.subclips = [innerClipA, innerClipB];

        var outputClipB = cloneClip(inputClipB);
        outputClipB.track = 0;
        outputClipB.trim.left += 2000;

        var output = [outputClipA, outputClipAB, outputClipB];
        expect(flattener.flatten(input)).toEqual(output);
    });
});


// Creates a clone of a clip object
function cloneClip(clip) {
    return JSON.parse(JSON.stringify(clip));
}

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
        tagAsBlackness(testClip);
    }

    return testClip;
}

function tagAsBlackness(clip)
{
    clip._id = "blackness-placeholder";
    clip.asset_id = "blackness-placeholder";
}

function tagAsContainer(clip)
{
    clip._id = "container-placeholder";
    clip.asset_id = "container-placeholder";
}
