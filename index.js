var express = require('express')
var fs = require('fs')

var app = express()

var photoFiles = "/home/rolf/photo/out/thumb/";
var photos = [];


fs.readdir(photoFiles,function(err, files){
	if(err) {

	} else {

		files.forEach(function(fileName){
			if(fileName.match(/\.jpg$/)) {
				fs.stat(photoFiles + fileName,function(err, stats){
					if(err) {

					} else {
						if(stats.isFile()) {
							photos.push({
								id: fileName.match(/(^|\/)([^./]+)\..+/)[2],
								file: fileName,
								stats: stats
							})
						}
					}
				});				
			}
		});
	}
});


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
	res.send(new String(photos.length));
})

app.get('/chunk/:from-:to', function (req, res) {
	var from = parseInt(req.params.from);
	var to = parseInt(req.params.to);
	if((from !== NaN) && (to !== NaN)) {
		res.send(JSON.stringify(photos.map((d)=>d.id).slice(from, to)));
	}
})

app.listen(3110, function () {
  console.log('Listening on port 3110!')
})