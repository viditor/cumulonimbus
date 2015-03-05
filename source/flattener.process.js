/**
 * flatten: Handles edge cases in a clip list to prepare it for rendering. Flattens multiple tracks into a single track and replaces spaces with seconds of blackness.
 *
 * INPUT
 * - tickSortedClips (JSON)
 * A JSON array of clip metadata. Should be sorted by tic in ascending order. 
 *
 * OUTPUT
 * - A promise that will resolve when the flattened array of clips has been completed, and will return the flattened array.
 * 
 */
module.exports.flatten = function(tickSortedClips)
{
    var previousEndTick = 0;
    for (var i = 0; i < tickSortedClips.length; i++)
    {
        var clip = tickSortedClips[i];
        
        // If there is space between the beginning of this clip and the end of previous clip
        var timeBetweenPrevious = clip.tick - previousEndTick;
        if (timeBetweenPrevious > 0)
        {
            // Insert blackness for the duration of the space between clips
            tickSortedClips.splice(i, 0, createBlackness(previousEndTick, timeBetweenPrevious, clip.project_id));
            i++;
        }
        // If the previous clip overlaps with this clip
        // TODO: Handle the case where > 2 clips overlap
        else if (timeBetweenPrevious < 0)
        {
            // timeBeteweenPrevious will be negative, but we need a positive version
            var overlapTime = -timeBetweenPrevious;

            // Get reference to previous clip
            var previousClip = tickSortedClips[i-1];

            // Build container for inner clips
            var containerClip = cloneClip(clip);
            containerClip._id = "container-placeholder"
            containerClip.asset_id = "container-placeholder"
            containerClip.length = overlapTime;
            containerClip.trim.left = 0;
            containerClip.trim.right = 0;
            containerClip.track = 0;

            // Generate inner clips
            var rightInnerClip = cloneClip(clip);
            var leftInnerClip = cloneClip(previousClip);
            
            // Trim inner clips to fit in container
            leftInnerClip.trim.left = leftInnerClip.length - overlapTime;
            rightInnerClip.trim.right = rightInnerClip.length - overlapTime;

            // Add inner clips to container
            // TODO: Order inner clips by track
            containerClip.subclips = [leftInnerClip, rightInnerClip];

            // Trim outer clips to fit outside of container
            previousClip.trim.right += overlapTime;
            clip.trim.left += overlapTime;

            // Insert container into clip list
            tickSortedClips.splice(i, 0, containerClip);
            i++;
        }

        // For now, naively put all clips on track 0
        clip.track = 0;


        previousEndTick = clip.tick + clip.length;
    }

    return tickSortedClips;
}

// Creates a clone of a clip object
function cloneClip(clip) {
    return JSON.parse(JSON.stringify(clip));
}

// Creates a clip of blackness for the specified project at the specified tick with the specified length
function createBlackness(tick, length, project_id)
{
    return {
        "_id": "blackness-placeholder",
        "asset_id": "blackness-placeholder",
        "project_id": project_id,
        "trim":
        {
            "left": 0,
            "right": 0
        },
        "tick": tick,
        "length": length,
        "track": 0
    };
}
