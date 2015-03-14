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
        var inputA = createTestClip("AAAA", 0);
        var inputB = createTestClip("  BBBB", 1);

        var outputA = configureClip(cloneClip(inputA), {"trim": {"left": 0, "right": 2000}});

        var outputAB = configureClip(cloneClip(inputB), 
        {
            "track": 0,
            "length": 2000,
            "subclips":
            [
                configureClip(cloneClip(inputA), {"trim": {"left": 2000, "right": 0}}),
                configureClip(cloneClip(inputB), {"trim": {"left": 0, "right": 2000}}),
            ]
        });
        tagAsContainer(outputAB);

        var outputB = configureClip(cloneClip(inputB), {"track":0, "trim": {"left": 2000, "right": 0}});
        
        var input =  [inputA, inputB];
        var output = [outputA, outputAB, outputB];
        expect(flattener.flatten(input)).toEqual(output);
    });

    // Case #8
    it ("\n" +
        "   AAAA   \n" + 
        "BBBB  CCCC\n" + 
        "----------\n" +
        "BBB#AA$CCC\n" +
        "(# = [A, B])\n" +
        "($ = [A, C])\n", function()
    {
        var inputB = createTestClip("BBBB", 1);
        var inputA = createTestClip("   AAAA", 0);
        var inputC = createTestClip("      CCCC", 1);

        var outputB = configureClip(cloneClip(inputB), {"trim": {"left": 0, "right": 1000 }, "track": 0});
        var outputA = configureClip(cloneClip(inputA), {"trim": {"left": 1000, "right": 1000}, "track": 0});
        var outputC = configureClip(cloneClip(inputC), {"trim": {"left": 1000, "right": 0}, "track":0});

        var outputAB = configureClip(cloneClip(inputA),
        {
            "track": 0,
            "length": 1000, 
            "subclips":
            [
                configureClip(cloneClip(inputA), {"trim": {"left": 0, "right": 3000}}),
                configureClip(cloneClip(inputB), {"trim": {"left": 3000, "right": 0}, "track": 0})
            ]
        });
        tagAsContainer(outputAB);

        var outputAC = configureClip(cloneClip(inputC),
        {
            "track": 0,
            "length": 1000, 
            "subclips":
            [
                configureClip(cloneClip(inputA), {"trim":{"left":3000, "right":0}}),
                configureClip(cloneClip(inputC), {"trim":{"left":0, "right":3000}}),
            ]
        });
        tagAsContainer(outputAC);

        var input =  [inputB, inputA, inputC];
        var output = [outputB, outputAB, outputA, outputAC, outputC];
        expect(flattener.flatten(input)).toEqual(output);
    });

});

// Set options on an existing clip object
function configureClip(clip, options)
{
    for (key in options)
    {
        clip[key] = options[key];
    }

    return clip;
}

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
