var express = require('express');
var resumable = require('./resumable-node.js')('c:/Temp/downloadedFiles');
var perfmon = require('perfmon');
var io = require('socket.io');
var app = express.createServer(), io = io.listen(app,{ log: false });
var zlib = require('zlib');
var zipstream = require('zipstream');
var fs = require('fs');
	
var counters = [
	'Network Interface(Broadcom BCM5709C NetXtreme II GigE [NDIS VBD Client])\\Bytes Received/sec',
];

perfmon(counters, function(err, data) {
	io.sockets.emit("network", data);	
});
/*
perfmon.list('Network Interface', function(err, data) {
	console.log(data);
});*/

// Host most stuff in the public folder
app.use(express.static(__dirname + '/public'));

app.use(express.bodyParser());

app.post('/downloadFiles', function (req, res) {
    var out = fs.createWriteStream('out.zip');
    var zip = zipstream.createZip({ level: 1 });

    zip.pipe(out);

    zip.addFile(fs.createReadStream('681605.jpg'), { name: '681605.jpg' }, function () {
        zip.addFile(fs.createReadStream('681614.jpg'), { name: '681614.jpg' }, function () {
            zip.finalize(function (written) { console.log(written + ' total bytes written'); });
        });
    });
});

// Handle uploads through Resumable.js
app.post('/upload', function(req, res){

	// console.log(req);

    resumable.post(req, function(status, filename, original_filename, identifier){
        //console.log('POST', status, original_filename, identifier);

        res.send(status, {
            // NOTE: Uncomment this funciton to enable cross-domain request.
            'Access-Control-Allow-Origin': '*'
        });
    });
});

// Handle cross-domain requests
// NOTE: Uncomment this funciton to enable cross-domain request.

  app.options('/upload', function(req, res){	  
	  res.send(true, {
		'Access-Control-Allow-Origin': '*'
	  }, 200);
  });


// Handle status checks on chunks through Resumable.js
app.get('/upload', function(req, res){
    resumable.get(req, function(status, filename, original_filename, identifier){
        //console.log('GET', status);
        res.send(status, (status == 'found' ? 200 : 404));
      });
  });

app.get('/download/:identifier', function(req, res){
	resumable.write(req.params.identifier, res);
});

console.log("3000");
app.listen(3000);
