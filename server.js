var app = require("./app");
var http = require("http");
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var liveServer = server.listen(port, function () {
  console.log("LISTENING AT " + port);
});
