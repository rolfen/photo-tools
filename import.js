#!/usr/bin/node

"use strict";

const fs = require("fs");


// command line options
/*
if(args = process.argv.slice(2)) {
	args.forEach(function(arg){
		if(arg == "explain") {
			config.do = false;
			config.dbg = true;
		}
		if(arg == "list") {
			config.do = false;
			config.dbg = false;
		}
	});
}
*/

// stats
var scriptStats = {
};

// --------- callback-style functions

function dbg(s) {
	// show inline debug info
	if(config.dbg || config.do) {
		return(s);
	}
	return('');
}



// process.stdout.write("mkdir --parents " + shellEscape(moveTargetDir) + "\n");

function fileExt(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i + 1);
}

// ----------- subs

// main process
function processData(data) {
	importFiles();
	done();
}


function processDupeSet(set) {
	try{
		var fileStats = fs.statSync(realPath);
		if(fileStats.size > 0) {
		} else {
		}
	} catch (err) {
	}
}

function done() {
	process.stderr.write(JSON.stringify(scriptStats,null,2) + '\n');
}


