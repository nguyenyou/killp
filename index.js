#!/usr/bin/env node
'use strict'

var argv = process.argv;
argv.shift();
argv.shift();

if (Array.isArray(argv) && argv.length > 0) {
    for (let index = 0; index < argv.length; index++) {
        const port = argv[index];
        require('child_process').exec(`lsof -i:${port} |xargs killall`)
    }
}
