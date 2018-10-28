/* main API script */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const config = require('./config');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');

// Instantiate the HTTP server
const httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

// Start HTTP server
httpServer.listen(config.httpPort, function(){
    console.log(`Server listening on ${config.httpPort}`);
});

// Instantiate the HTTPS server
const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req, res);
})

// Start HTTPS server
httpsServer.listen(config.httpsPort, function(){
    console.log(`Server listening on ${config.httpsPort}`);
});


// Allt the server logic for http and https
const unifiedServer = function(req, res) {
    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);
    
    // Get path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload if any
    const decoder = new StringDecoder('utf-8');
    const buffer = '';

    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer += decoder.end();

        // Choose the handler
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct data object for handler
        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        // Route the request to the right handler
        chosenHandler(data, function(statusCode, payload){
            // Use the status code called back by the handler or default
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler or default
            payload = typeof(payload) == "object" ? payload : {};

            // Convert the payload to string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log(`Returning response: `, statusCode, payloadString);

        });
        
    });
}


// Define handlers
const handlers = {};

// Hello handler
handlers.hello = function(data, callback) {
    callback(200, {'hello': 'Welcome to home assignment #1 REST API server made by Zitzy :) '})
};

// Ping handler
handlers.ping = function(data, callback) {
    callback(200);
};

// Not found handler
handlers.notFound = function(data, callback){
    callback(404);
};

// Define router
const router = {
    'ping' : handlers.ping,
    'hello' : handlers.hello
};
