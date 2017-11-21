const minimist = require("minimist");
const path = require('path');

var args = minimist(process.argv.slice(2),{
	alias: {
		d: "directory",
		o: "output-file"
	},
	default: {
		o: "local/localHashes.txt"
	}
});

// normalize trailing slashes
args.d = args.d.replace(/[\/\\]$/,'') + path.sep;

function processFile(f) {
	const sha1File = require("sha1-file");
	var sha1 = sha1File(f);
	process.stdout.write( sha1 + " " + f + "\n" );
}

function recursiveProcessDirectory(path) {
	const recursiveReaddir = require("recursive-readdir");
	recursiveReaddir(args.d, (err, files) => {
		if(err) {
			throw new Error(err);
		}
		files.forEach(processFile);
	})
}

function processDirectory(path) {
	const fs = require('fs');
	fs.readdir(path, (err, files) => {
		if(err) {
			throw new Error(err);
		}
		files.forEach(file => {
			debugger;
			fs.stat(path + file, (err, stats) => {
				if(err) {
					throw new Error(err);
				} else {
					if(!stats.isDirectory()) {
						processFile(path + file);
					}			
				}
			});
		});
	})
}

try {
	recursiveProcessDirectory(args.d);
} catch(e) {
	console.log("Usage: " + process.argv[1] + " -d input-directory [-o output-file]");
	console.dir(e);
}
