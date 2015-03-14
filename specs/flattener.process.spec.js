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

        var outputA = cloneAndEdit(inputA, {"trim": {"left": 0, "right": 2000}});

        var outputAB = cloneAndEdit(inputB,
        {
            "track": 0,
            "length": 2000,
            "subclips":
            [
                cloneAndEdit(inputA, {"trim": {"left": 2000, "right": 0}}),
                cloneAndEdit(inputB, {"trim": {"left": 0, "right": 2000}}),
            ]
        });
        tagAsContainer(outputAB);

        var outputB = cloneAndEdit(inputB, {"track":0, "trim": {"left": 2000, "right": 0}});
        
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

        var outputB = cloneAndEdit(inputB, {"trim": {"left": 0, "right": 1000}, "track": 0});
        var outputA = cloneAndEdit(inputA, {"trim": {"left": 1000, "right": 1000}, "track": 0});
        var outputC = cloneAndEdit(inputC, {"trim": {"left": 1000, "right": 0}, "track": 0});

        var outputAB = cloneAndEdit(inputA,
        {
            "track": 0,
            "length": 1000, 
            "subclips":
            [
                cloneAndEdit(inputA, {"trim": {"left": 0, "right": 3000}}),
                cloneAndEdit(inputB, {"trim": {"left": 3000, "right": 0}})
            ]
        });
        tagAsContainer(outputAB);

        var outputAC = cloneAndEdit(inputC,
        {
            "track": 0,
            "length": 1000, 
            "subclips":
            [
                cloneAndEdit(inputA, {"trim": {"left": 3000, "right": 0}}),
                cloneAndEdit(inputC, {"trim": {"left": 0, "right": 3000}}),
            ]
        });
        tagAsContainer(outputAC);

        var input =  [inputB, inputA, inputC];
        var output = [outputB, outputAB, outputA, outputAC, outputC];
        expect(flattener.flatten(input)).toEqual(output);
    });

    // Case #9
    it ("\n" +
        "  AAAA\n" + 
        "BBBB  \n" + 
        "------\n" +
        "BB##AA\n" +
        "(# = [A, B])\n", function()
    {
        var inputB = createTestClip("BBBB", 1);
        var inputA = createTestClip("  AAAA", 0);

        var outputB = cloneAndEdit(inputB, {"trim": {"left": 0, "right": 2000}, "track": 0});
        var outputA = cloneAndEdit(inputA, {"trim": {"left": 2000, "right": 0}, "track": 0});

        var outputAB = cloneAndEdit(inputA,
        {
            "track": 0,
            "length": 2000,
            "subclips":
            [
                cloneAndEdit(inputA, {"trim": {"left": 0, "right": 2000}}),
                cloneAndEdit(inputB, {"trim": {"left": 2000, "right": 0}})
            ]
        });
        tagAsContainer(outputAB);

        var input =  [inputB, inputA];
        var output = [outputB, outputAB, outputA];
        expect(flattener.flatten(input)).toEqual(output);
    });

    // Case #10
    it ("\n" +
        "AAAA  BBBB\n" + 
        "   CCCC   \n" + 
        "----------\n" +
        "AAA#CC$BBB\n" +
        "(# = [A, C])\n" +
        "($ = [B, C])\n", function()
    {
        var inputA = createTestClip("AAAA", 0);
        var inputC = createTestClip("   CCCC", 1);
        var inputB = createTestClip("      BBBB", 0);

        var outputA = cloneAndEdit(inputA, {"trim": {"left": 0, "right": 1000}, "track": 0});
        var outputC = cloneAndEdit(inputC, {"trim": {"left": 1000, "right": 1000}, "track": 0});
        var outputB = cloneAndEdit(inputB, {"trim": {"left": 1000, "right": 0}, "track": 0});

        var outputAC = cloneAndEdit(inputC,
        {
            "track": 0,
            "length": 1000,
            "subclips":
            [
                cloneAndEdit(inputA, {"trim": {"left": 3000, "right": 0}}),
                cloneAndEdit(inputC, {"trim": {"left": 0, "right": 3000}})
            ]
        });
        tagAsContainer(outputAC);

        var outputBC = cloneAndEdit(inputB,
        {
            "track": 0,
            "length": 1000,
            "subclips":
            [
                cloneAndEdit(inputB, {"trim": {"left": 0, "right": 3000}}),
                cloneAndEdit(inputC, {"trim": {"left": 3000, "right": 0}})
            ]
        });
        tagAsContainer(outputBC);

        var input =  [inputA, inputC, inputB];
        var output = [outputA, outputAC, outputC, outputBC, outputB];
        expect(flattener.flatten(input)).toEqual(output);
    });


});

// Sets options on an existing clip object
function editClip(clip, options)
{
    for (key in options)
    {
        clip[key] = options[key];
    }

    return clip;
}

// Creates a clone of a clip object
function cloneClip(clip)
{
    return JSON.parse(JSON.stringify(clip));
}

// Configures a clone of a clip object
function cloneAndEdit(clip, options)
{
    return editClip(cloneClip(clip), options);
}

// Creates a test clip by looking at code string and track integer
function createTestClip(code, track)
{
    var name = code.replace(/^\s+/, "");
    var leftSpaceLength = code.length - name.length;

    var testClip = {
        "_id": "test-" + name,
        "asset_id": "test-" + name,
        "project_id": "test",
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
    clip._id = "[blackness]";
    clip.asset_id = "[blackness]";
}

function tagAsContainer(clip)
{
    clip._id = "[container]";
    clip.asset_id = "[container]";
}
