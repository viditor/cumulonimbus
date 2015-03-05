var flattener = require("../source/flattener.process.js");

describe("flattener.process.js", function()
{
    it("\n" +
        "1111\n" +
        "----\n" +
        "1111", function()
    {
        var input =  [createTestClip("1111", 0)];
        var output = [createTestClip("1111", 0)];
        expect(flattener.flatten(input)).toEqual(output);
    });

    it ("\n" + 
        "11112222\n" +
        "--------\n" +
        "11112222", function()
    {
        var input =  [createTestClip("1111", 0), createTestClip("    2222", 0)];
        var output = [createTestClip("1111", 0), createTestClip("    2222", 0)];
        expect(flattener.flatten(input)).toEqual(output);
    });

    it ("\n" +
        "1111    \n" +
        "    2222\n" +
        "--------\n" +
        "11112222", function()
    {
        var input =  [createTestClip("1111", 0), createTestClip("    2222", 1)];
        var output = [createTestClip("1111", 0), createTestClip("    2222", 0)];
        expect(flattener.flatten(input)).toEqual(output);
    });

    it ("\n" +
        "1111    2222\n" +
        "------------\n" +
        "111100002222", function()
    {
        var input =
        [
            createTestClip("1111", 0),
            createTestClip("        2222", 0)
        ];
        var output = 
        [
            createTestClip("1111", 0),
            createTestClip("    0000", 0),
            createTestClip("        2222", 0)
        ];
        expect(flattener.flatten(input)).toEqual(output);
    });


    it ("\n" +
        "1111        \n" +
        "        2222\n" +
        "------------\n" +
        "111100002222", function()
    {
        var input =
        [
            createTestClip("1111", 0),
            createTestClip("        2222", 1)
        ];
        var output = 
        [
            createTestClip("1111", 0),
            createTestClip("    0000", 0),
            createTestClip("        2222", 0)
        ];

        expect(flattener.flatten(input)).toEqual(output);
    });

    it ("\n" +
        "    1111\n" +
        "--------\n" +
        "00001111", function()
    {
        var input = [createTestClip("    1111", 0)];
        var output = [createTestClip("0000", 0), createTestClip("    1111", 0)];
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
