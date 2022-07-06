const http = require('http'),
	fs = require('fs'),
	PORT = 3200


http.createServer((req, res) => {
  fs.readFile('./devLogin/index.html', "utf8", function(err, file) {
      if(err) {
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.write(err + "\n");
        res.end();
        return;
      }

      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(file, "utf8");
      res.end();
    });
}).listen(PORT)

console.log("Static server running at http://localhost:" + PORT);
