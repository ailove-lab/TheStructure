var WebSocket = require('ws')
var ws = new WebSocket("ws://websdr.ewi.utwente.nl:8901/~~stream");        

ws.on('open', function() {
	console.log("open");
    ws.send('GET /~~param?f=828');
});
ws.on('message', function(message) {
    console.log('received: %s', message);
});

// GET /~~param?f=828
// 18
// 6:24:27 PM
// Binary Frame (Opcode 2)
// 157
// 6:24:27 PM
// GET /~~param?f=14589.8&band=0&lo=0.3&hi=2.7&mode=0&name=peko
// 60
// 6:24:27 PM
// GET /~~param?f=14589.8&band=0&lo=0.3&hi=2.7&mode=0&name=peko
// 60
// 6:24:27 PM
// GET /~~param?mute=0
// 19
// 6:24:27 PM
// GET /~~param?squelch=0
// 22
// 6:24:27 PM
// GET /~~param?autonotch=0