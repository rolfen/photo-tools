// parse arguments
const minimist = require("minimist");
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
const path = require('path');
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

try {
	recursiveProcessDirectory(args.d);
} catch(e) {
	console.log("Usage: " + process.argv[1] + " -d input-directory [-o output-file]");
	console.dir(e);
}
