require("dotenv").config();
const http = require('http');
const app = require('./app');
var port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);

