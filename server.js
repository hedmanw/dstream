import express from 'express';
import bodyParser from 'body-parser';
import ipfsclient from './src/client/ipfsclient.js';

let app = express();

// Serve static files
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/images', function(req, res) {
  dockerx.client.listImages().then(json => res.json(json));
});

app.post('/transfer', function(req, res) {
    let imageHash = req.body.imageHash;
    let host = req.body.host;
    let port = req.body.port;
    dockerx.client.sendImage(imageHash, host, port);
    res.send(imageHash + " " + host + ":" + port + "\n");
});

// Run server
let server = app.listen(8000, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Zeppelin listening at http://%s:%s', host, port);
});

app.post('/ipfs', function(req, res) {
    if (req.body.cmd == 'addFile') {
        res.send(ipfsclient.addFile(req.body.arg));
    } else if (req.body.cmd == 'getFile') {
        res.send(ipfsclient.getFile(req.body.arg));
    } else if (req.body.cmd == 'getReceivedAmount') {
        res.send(ipfsclient.getReceivedAmount(req.body.arg));
    } else if (req.body.cmd == 'getProviders') {
        res.send(ipfsclient.getProviders(req.body.arg));
    }
});