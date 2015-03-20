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

        expectEqual_JSONFormat(flattener.flatten(input), output);
    });

    // Case #2
    it ("\n" + 
        "AAAABBBB\n" +
        "--------\n" +
        "AAAABBBB", function()
    {
        var input =  [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];
        var output = [createTestClip("AAAA", 0), createTestClip("    BBBB", 0)];

        expectEqual_JSONFormat(flattener.flatten(input), output);
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

        expectEqual_JSONFormat(flattener.flatten(input), output);
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

        expectEqual_JSONFormat(flattener.flatten(input), output);
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

        expectEqual_JSONFormat(flattener.flatten(input), output);
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

        expectEqual_JSONFormat(flattener.flatten(input), output);
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
        expectEqual_JSONFormat(flattener.flatten(input), output);
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
        expectEqual_JSONFormat(flattener.flatten(input), output);
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
        expectEqual_JSONFormat(flattener.flatten(input), output);
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
        expectEqual_JSONFormat(flattener.flatten(input), output);
    });


    // Case #11
    it ("\n" +
        "AA  BB  \n" + 
        "  CCCCCC\n" + 
        "--------\n" +
        "AACC##CC\n" +
        "(# = [B, C])\n", function()
    {
        var inputA = createTestClip("AA", 0);
        var inputC = createTestClip("  CCCCCC", 1);
        var inputB = createTestClip("    BB", 0);

        var outputA = cloneClip(inputA);
        var outputC_1 = cloneAndEdit(inputC, {"trim": {"left": 0, "right": 4000}, "track": 0});
        var outputC_2 = cloneAndEdit(inputC, {"trim": {"left": 4000, "right": 0}, "track": 0});

        var outputBC = cloneAndEdit(inputB,
        {
            "track": 0,
            "length": 2000,
            "subclips":
            [
                cloneAndEdit(inputB, {"trim": {"left": 0, "right": 0}}),
                cloneAndEdit(inputC, {"trim": {"left": 2000, "right": 2000}})
            ]
        });
        tagAsContainer(outputBC);

        var input =  [inputA, inputC, inputB];
        var output = [outputA, outputC_1, outputBC, outputC_2];
        expectEqual_JSONFormat(flattener.flatten(input), output);
    });

    // Case #12
    it ("\n" +
        "AAAA\n" + 
        " BB \n" + 
        "----\n" +
        "A##A\n" +
        "(# = [A, B])\n", function()
    {
        var inputA = createTestClip("AAAA", 0);
        var inputB = createTestClip(" BB", 1);

        var outputA_1 = cloneAndEdit(inputA, {"trim": {"left": 0, "right": 3000}});
        var outputA_2 = cloneAndEdit(inputA, {"trim": {"left": 3000, "right": 0}});

        var outputAB = cloneAndEdit(inputB,
        {
            "track": 0,
            "length": 2000,
            "subclips":
            [
                cloneAndEdit(inputA, {"trim": {"left": 1000, "right": 1000}}),
                cloneAndEdit(inputB, {"trim": {"left": 0, "right": 0}})
            ]
        });
        tagAsContainer(outputAB);

        var input =  [inputA, inputB];
        var output = [outputA_1, outputAB, outputA_2];
        expectEqual_JSONFormat(flattener.flatten(input),output);
    });

    // Case #13
    it ("\n" +
        "AAAABBBB\n" + 
        "  CCCC  \n" + 
        "--------\n" +
        "AA##$$BB\n" +
        "(# = [A, C])\n" +
        "($ = [B, C])\n", function()
    {
        var inputA = createTestClip("AAAA", 0);
        var inputC = createTestClip("  CCCC", 1);
        var inputB = createTestClip("    BBBB", 0);

        var outputA = cloneAndEdit(inputA, {"trim": {"left": 0, "right": 2000}});
        var outputB = cloneAndEdit(inputB, {"trim": {"left": 2000, "right": 0}});

        var outputAC = cloneAndEdit(inputC,
        {
            "track": 0,
            "length": 2000,
            "subclips":
            [
                cloneAndEdit(inputA, {"trim": {"left": 2000, "right": 0}}),
                cloneAndEdit(inputC, {"trim": {"left": 0, "right": 2000}})
            ]
        });
        tagAsContainer(outputAC);

        var outputBC = cloneAndEdit(inputB,
        {
            "track": 0,
            "length": 2000,
            "subclips":
            [
                cloneAndEdit(inputB, {"trim": {"left": 0, "right": 2000}}),
                cloneAndEdit(inputC, {"trim": {"left": 2000, "right": 0}})
            ]
        });
        tagAsContainer(outputBC);

        var input =  [inputA, inputC, inputB];
        var output = [outputA, outputAC, outputBC, outputB];
        expectEqual_JSONFormat(flattener.flatten(input), output);
    });



    // Case #14
    it ("\n" +
        "AAaa  \n" + 
        "  BBBB\n" + 
        "------\n" +
        "AABBBB\n", function()
    {
        var inputA = createTestClip("AAaa", 0);
        var inputB = createTestClip("  BBBB", 1);

        var outputA = cloneClip(inputA);
        var outputB = cloneAndEdit(inputB, {"track": 0});

        var input =  [inputA, inputB];
        var output = [outputA, outputB];

        expectEqual_JSONFormat(flattener.flatten(input), output);
        // expectEqual_JSONFormat(flattener.flatten(input), output);
    });


});


// Prettifies JSON objects before testing equality
function expectEqual_JSONFormat(a, b)
{
    var aStr = JSON.stringify(a, null,'    ')
    var bStr = JSON.stringify(b, null,'    ')
    expect(aStr).toEqual(bStr);
}


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
    var name = leftTrim(code);
    var leftSpaceLength = code.length - name.length;
    
    // Determine left and right trim from code
    var trim = {
        "left": 0,
        "right": 0
    };
    var onLeftSide = true;
    for (var i = 0, len = name.length; i < len; i++)
    {
        if (isLowerCaseLetter(name[i]))
        {
            trim[onLeftSide ? 'left' : 'right'] += 1000;
        }
        else
        {
            onLeftSide = false;
        }

    }

    var testClip = {
        "_id": "test-" + name,
        "asset_id": "test-" + name,
        "project_id": "test",
        "trim": trim,
        "tick": leftSpaceLength * 1000,
        "length": name.length * 1000,
        "track": track
    };

    if (name.indexOf("0") > -1)
    {
        tagAsBlackness(testClip);
    }

    return testClip;
}

function leftTrim(str)
{
    return str.replace(/^\s+/, "");
}

function isLowerCaseLetter(character)
{
    return character.match(/[A-Za-z]/) &&
        character == character.toLowerCase();
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
