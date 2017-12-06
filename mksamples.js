#!/usr/bin/env node

'use strict'; 

const spawn = require('child_process').spawn;
const fs = require("fs");
const path = require('path');
const split = require('split');

const outDir = "/home/rolf/TMP/";


function mySpawn(psName, psArgs, options) {
	// acts just like spawn() but prints a bunch of debug messages to reflect what is happening

	console.log(": " + psName + " " + psArgs.join(" "));

	var ps = spawn(psName, psArgs, options);

	ps.on('error', (data) => {
		console.log(`${psName} error: ${data}`);
	});

	ps.on('exit', (code) => {
		console.log(`${psName} exited with code ${code}`);
	});

	ps.stdout.on('readable', () => {
		console.log(psName + " stdout");
	});

	// todo: how do I watch stdin?

	ps.stderr.on('readable', () => {
		var data = ps.stderr.read()
		if(data) {
			console.log(psName + ' stderr: ' + data);
		}
	});

	return(ps);
}

function processLine (fname) {
  fs.access(fname, function(err){
  	if(!err) {
  		console.log(" <  " + fname + " >")

  		// file exists
		var ext = path.extname(fname);
		var basename = path.basename(fname, ext);
		var previewFname = outDir + basename +  ".preview.jpg";

		var output = fs.createWriteStream(outDir + basename +  ".preview.1.jpg");
		var output2 = fs.createWriteStream(outDir + basename +  ".preview.2.jpg");

		var psDcraw = spawn('dcraw',['-e', '-c' , '-h', fname]);
		var psDecoder = spawn("djpeg",["-scale", "6/8"]);

		var psResampler = spawn("pnmscalefixed",["-pixels","750000"]);
		var psEncoder = spawn("cjpeg", ["-quality", "80"]);

		var psResampler2 = spawn("pnmscalefixed",["-pixels","47050"]);
		var psEncoder2 = spawn("cjpeg", ["-quality", "80"]);

		psDcraw.stdout.pipe(psDecoder.stdin);

		psDecoder.stdout.pipe(psResampler.stdin);
		psResampler.stdout.pipe(psEncoder.stdin);
		psEncoder.stdout.pipe(output);

		psDecoder.stdout.pipe(psResampler2.stdin);
		psResampler2.stdout.pipe(psEncoder2.stdin);
		psEncoder2.stdout.pipe(output2);

		//psDecoder.stdout.pipe(psResampler.stdin);
		//psResampler.stdout.pipe(psEncoder.stdin);
		//psEncoder.stdout.pipe(output)


  	} else {
  		console.log("Cannot access " + fname);
  	}
  });
}

// we need stdin for the debugger
// process.stdin.pipe(split()).on('data', processLine)

var input = ["/mnt/Shared/sample.ORF"];
input.forEach(processLine);