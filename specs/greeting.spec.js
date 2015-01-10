var greeting = require("../source/greeting.js")

describe("A greeting", function()
{
    it("says hello world", function()
    {
        expect(greeting()).toBe("Hello World!");
    });
});
