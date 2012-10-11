var defaults = {
    "host": "localhost",
    "port": "3000",
    "targethost": "localhost",
    "targetport": "80",
};

var http = require("http");
var config = require("optimist")
    .default(defaults)
    .argv;

http.createServer(function(request, response) {

    console.log("Processing", request.method, request.url);

    var targetRequest = http.request({
        host: config.targethost,
        port: config.targetport,
        path: request.url,
        method: request.method,
        headers: request.headers
    }, function(targetResponse) {

        response.writeHead(targetResponse.statusCode, targetResponse.headers);

        targetResponse.on("data", function(chunk) {
            response.write(chunk);
        });
        targetResponse.on("end", function() {
            response.end();
        });
    });

    request.on("data", function(chunk) {
        targetRequest.write(chunk);
    });

    request.on("end", function() {
        targetRequest.end();
    });

}).listen(config.port, config.host);

console.log("Listening on " + config.host + ":" + config.port);
console.log("Forwarding to " + config.targethost + ":" + config.targetport);
