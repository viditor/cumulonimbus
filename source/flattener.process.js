var Bluebird = require("bluebird");

/**
 * flatten: Handles edge cases in a clip list to prepare it for rendering. Flattens multiple tracks into a single track and replaces spaces with seconds of blackness.
 *
 * INPUT
 * - ticSortedClips (JSON)
 * A JSON array of clip metadata. Should be sorted by tic in ascending order. 
 *
 * OUTPUT
 * - A promise that will resolve when the flattened array of clips has been completed, and will return  the flattened array.
 * 
 */

module.exports.flatten = function(JSON ticSortedClips)
{
    return new Bluebird(function(resolve, reject)
    {        
        // transcoding.on("error", function(error)
        // {
        //     reject(error);
        // });
        
        // transcoding.on("end", function()
        // {
        //     resolve(output_file);
        // });

    })
}
