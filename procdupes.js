#!/usr/bin/node

// if confident about script, implement delete function and run on my files

"use strict";

const fs = require("fs");

var processedSets = [];

var createdDirsCache = [];

var args = [];

// default config
var config = {
	do : true, // delete files, don't just list them
	dbg : false, // debug mode
	inFile : "dupephotos.txt",
	pathPrefix : ""
}

// command line options
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

// stats
var scriptStats = {
	errLog :[],
	foundFiles: 0,
	foundSets:0,
	processedFiles: 0,
	failed:0,
	deleted:0,
	skippedEmpty:0,
	emptySets:0,
	skippedBlacklisted:0,
};

if(config.do) {
	scriptStats.createdDirs = 0;
	scriptStats.cachedDirCreation = 0;
}

// executive
fs.readFile(config.inFile,'utf8', function(err, data){
	if(err) {
		throw(err);
	} else {
		processFdupesList(data);
		done();
	}
});

// --------- callback-style functions

function dbg(s) {
	// show inline debug info
	if(config.dbg || config.do) {
		return(s);
	}
	return('');
}

function emitNewSet(set) {
	if(config.dbg) {
		process.stdout.write(dbg(" NEW SET ") + "\n");
	}
}

function emitKeepEmpty(path) {
	if(config.dbg) {
		process.stdout.write(dbg(" KE ")+ path +  "\n");		
	}
}


function emitKeepLast(path) {
	if(config.dbg) {
		process.stdout.write(dbg(" KL ")+ path +  "\n");
	}
}


function emitKeepXmp(path) {
	if(config.dbg) {
		process.stdout.write(dbg(" KX ") + path +  "\n");
	}
}


function shellEscape(s) {
	return("'" + s.replace(new RegExp("'"),"\'") + "'");
}

function emitDelete(path) {
	// console.log("delete " + path);
	if(config.do) {
		var moveTarget = config.pathPrefix + ".Trash/" + path.replace(new RegExp("^[/. ]+"),"");
		var moveTargetDir = moveTarget.replace(new RegExp("[^/]*$"),"");
		if(!createdDirsCache[moveTargetDir]) {
			process.stdout.write("mkdir --parents " + shellEscape(moveTargetDir) + "\n");
			createdDirsCache[moveTargetDir] = 1;
			scriptStats.createdDirs ++;

		} else {
			createdDirsCache[moveTargetDir] ++;
			scriptStats.cachedDirCreation ++;
		}
		process.stdout.write("mv " + shellEscape(config.pathPrefix + path ) + " " + shellEscape(moveTarget) + "\n");
	} else {
		process.stdout.write(dbg(" D ") + path +  "\n");

	}
}

function done() {
	process.stderr.write(JSON.stringify(scriptStats,null,2) + '\n');
}

// ----------- util

function fileExt(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i + 1);
}

// ----------- subs


function processFdupesList(list) {
	var sets = list.split(/\n\n/);
	sets.forEach(function(setLines){
		var index = sets.indexOf(setLines);
		var set = setLines.split(/\n/);
		var filteredSet = set.filter(function(i){
			return(i.length > 0);
		});
		processDupeSet(filteredSet);
	});
}

function processDupeSet(set) {
	if(set.length > 0) {
		emitNewSet(set);
		set.forEach(function(givenPath, indexInSet){
			if(indexInSet == (set.length - 1)) {
				// keep last duplicate
				emitKeepLast(givenPath);
			} else {

				var realPath = config.pathPrefix + givenPath;

				try{
					var fileStats = fs.statSync(realPath);
					if(fileStats.size > 0) {
						if(fileExt(realPath) == 'xmp'){
							scriptStats.skippedBlacklisted ++;
							emitKeepXmp(givenPath);
						} else {
							emitDelete(givenPath);
							scriptStats.deleted ++;
						}
					} else {
						scriptStats.skippedEmpty ++;
						emitKeepEmpty(givenPath);
					}
				} catch (err) {
					scriptStats.failed ++;
					scriptStats.errLog.push(err.stack);
				}

				scriptStats.processedFiles ++;
			} 

			scriptStats.foundFiles ++;
		})
		scriptStats.foundSets ++;
	} else {
		scriptStats.emptySets ++;
	}
}

