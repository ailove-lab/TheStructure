// var httpProxy = require('http-proxy');
// var options = {
//     host: 'websdr.ewi.utwente.nl',
//     port: 8901
// }

// var server    = httpProxy.createServer(function (req, res, proxy) {
// 	// var buffer  = httpProxy.buffer(req);

// 	proxy.proxyRequest(req, res, {
// 		host: 'websdr.ewi.utwente.nl',
// 		port: 8901
// 		// buffer: buffer
// 	});
// }, options);

// // server.proxy.on('end', function () {
// //   console.log("The request was proxied.");
// // });

// server.listen(8000);

// server.on('upgrade', function (req, socket, head) {
//     server.proxy.proxyWebSocketRequest(req, socket, head);
// });

var http = require('http'),
    httpProxy = require('http-proxy');
 
var proxy = new httpProxy.HttpProxy({
  target: {host: 'websdr.ewi.utwente.nl', port: 8901}
});
 
var server = http.createServer(function (req, res) { 
  proxy.proxyRequest(req, res);
}).listen(8000);

server.on('upgrade', function (req, socket, head) {
    proxy.proxyWebSocketRequest(req, socket, head);
});
 
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(9000);