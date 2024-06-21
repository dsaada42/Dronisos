const express = require('express');
const initUdpServer = require("./udpServer/udpServer"); 
const router = require('./routes/routes');

const app = express();

app.use("/", router);

const PORT = process.env.PORT || 5555;

app.listen(PORT);

initUdpServer(PORT);