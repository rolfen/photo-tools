const path = require('path');

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
	// normalize trailing slashes
	args.d = args.d.replace(/[\/\\]$/,'') + path.sep;
	recursiveProcessDirectory(args.d);
} catch(e) {
	console.dir(e);
	console.log("----------");
	console.log("Usage: " + process.argv[1].split(path.sep).pop() + " -d input-directory");
	// console.log("Usage: " + process.argv[1].split(path.sep).pop() + " -d input-directory [-o output-file]");
}
