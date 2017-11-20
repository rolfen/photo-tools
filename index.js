const sha1File = require("sha1-file");
const B2 = require("backblaze-b2");
const fs = require("fs");

// load credentials
var b2Credentials = JSON.parse(fs.readFileSync('local/credentials.js', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
}));

// create b2 object instance
var b2 = new B2(b2Credentials);

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

console.log(sha1File("local/P9140797.ORF"));


b2.authorize().then(
	() => {
		return b2.listFileNames({
		    bucketId: 'b4d47c917831c1d95dfd021a',
		    startFileName: "P9140797.ORF",
		    maxFileCount: 1,
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
			console.log([f.fileName, f.contentSha1]);
		})
	},
	(err) => {
		console.log("List fail");
		console.dir(err.response.data);
	}
);



