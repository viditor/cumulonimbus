### Installing ###

Install both [node](http://www.nodejs.org) and [mongo](http://www.mongodb.org) on your system. After you've finished the installation, check that everything is pathed to your terminal by prompting each application for a version number.

    $ node --version
    v0.10.x
    
    $ mongo --version
    v2.6.x

Download the dependencies for the project through [npm](https://www.npmjs.com), which should have been bundled with your installation of node. These dependencies are automatically pulled from ``package.json``, which you can find in the root directory.

    npm install

Optionally, download some tools for building and testing the project, such as [Forever](https://github.com/foreverjs/forever) or [Jasmine](http://jasmine.github.io/). By configuring them "globally" with the ``-g``, they will be accessible from the terminal.

    npm install forever -g
    npm install jasmine-node -g

Finally, configure [ffmpeg](https://www.ffmpeg.org) for your system. This will install all the codecs for processing the video. Do not confuse yourself over ffserver or ffplay or ffprobe; you do not need any of these.

    ffmpeg --version

### Executing ###

    npm start
    
    OR
    
    node server.js

### Testing ###

    npm test
    
    OR
    
    jasmine-node specs
