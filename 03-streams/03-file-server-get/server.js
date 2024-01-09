const http = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new http.Server();

function readFile(filepath) {
  return new Promise((resolve) => resolve(fs.createReadStream(filepath)));
}

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Nested files are not supported');
      } else {
        readFile(filepath).then((stream) => {
          stream.pipe(res);

          stream.on('error', () => {
            res.statusCode = 404;
            res.end('File not found');
          });

          req.on('aborted', () => {
            stream.destroy();
          });
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
