// require("http").createServer(function (req, res) {
//   res.end("Hello from server started by Electron app!");
// }).listen(9000, '127.0.0.2')


const http = require('node:http');
const https = require('node:https');
const net = require('node:net');
const { URL } = require('node:url');
const fs = require('node:fs');

// Create an HTTP tunneling proxy
const proxy = https.createServer({
  key: fs.readFileSync('../../bordeaux/.certs/local.key'),
  cert: fs.readFileSync('../../bordeaux/.certs/local.pem')
}, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  console.log('hi',req.url)
  // Connect to an origin server
  const { port, hostname } = new URL(`https://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});
proxy.listen(1337, '127.0.0.1')
// Now that proxy is running
// proxy.listen(1337, '127.0.0.1', () => {
//
//   // Make a request to a tunneling proxy
//   const options = {
//     port: 1337,
//     host: '127.0.0.1',
//     method: 'CONNECT',
//     path: 'www.google.com:80'
//   };
//
//   const req = http.request(options);
//   req.end();
//
//   req.on('connect', (res, socket, head) => {
//     console.log('got connected!');
//
//     // Make a request over an HTTP tunnel
//     socket.write('GET / HTTP/1.1\r\n' +
//                  'Host: www.google.com:80\r\n' +
//                  'Connection: close\r\n' +
//                  '\r\n');
//     socket.on('data', (chunk) => {
//       console.log(chunk.toString());
//     });
//     socket.on('end', () => {
//       proxy.close();
//     });
//   });
// });
