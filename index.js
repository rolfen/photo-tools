// const sha1File = require("sha1-file");
const B2 = require("backblaze-b2");
const fs = require("fs");

const localDir = 'local/';

// load credentials
const b2Config = JSON.parse(fs.readFileSync(localDir + 'config.js', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
}));

const remoteHashListFileName = localDir + 'remoteHashes.txt';
fs.truncate(remoteHashListFileName, 0, function(){
	// file is now empty
});

// create b2 object instance
var b2 = new B2({
    "accountId": b2Config.accountId,
    "applicationKey": b2Config.applicationKey
});

// console.log(sha1File("local/P9140797.ORF"));

// takes a B2 listFileNames response and appends it to a file
function saveListFileNamesResponse(r) {
	var lines = "";
	r.data.files.forEach((f) => {
		lines += f.contentSha1 + " " + f.fileName + "\n";
	});
	fs.appendFile(remoteHashListFileName, lines, function(err){
		// my code is perfect
	});
}

async function getAllFileNames(saveResponse) {
	var r;
	var nextFileName = "";

	while(nextFileName !== null) {
		try {
			r = await b2.listFileNames({
			    bucketId: b2Config.bucketId,
			    startFileName: nextFileName,
			    maxFileCount: 5000,
			    delimiter: '',
			    prefix: ''
			});
			nextFileName = r.data.nextFileName;
			if(typeof saveResponse == "function") {
				saveResponse(r);
			}
		} catch (e) {
			console.dir(e);
		}
	}
}

b2.authorize().then(() => {
	getAllFileNames(saveListFileNamesResponse);
});


/*
async function GetBuckets() {
  try {
    await b2.authorize();
    var response = await b2.listBuckets()
    console.log(response.data)
  } catch (e){
    console.log('Error getting buckets:', e)
  }
}
*/

/*

b2.authorize().then(
	() => {
		return b2.listFileNames({
		    bucketId: 'b4d47c917831c1d95dfd021a',
		    startFileName: "",
		    maxFileCount: 0,
		    delimiter: '',
		    prefix: ''
		});
	},
	() => {
		console.log("Auth fail");
	}	
).then(
	(response) => {
		response.data.files.forEach(function(f){
			console.log("[" + f.fileName + ", " + f.contentSha1 + "]");
		})
	},
	(err) => {
		console.log("List fail");
		console.dir(err.response.data);
		console.log(err.response.headers['content-length']);
	}
);

*/



