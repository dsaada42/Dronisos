const dgram = require('node:dgram');
const messageQueueHandler = require('../storage');

function initUdpServer(port) {
    const udpServer = dgram.createSocket('udp4');

    udpServer.on('error', (err) => {
        console.log("error" + err);
        udpServer.close();
    })

    udpServer.on('message', (msg, rinfo) => {
        //parse json message
        const json = JSON.parse(msg);
        // console.log("message received from drone: " + json.name + json.position);
        // store result in data structure
        messageQueueHandler.enqueueMessage({name: json.name, position: json.position})
    })

    udpServer.on('listening', () => {
        const address = udpServer.address();
        console.log(`server listening ${address.address}:${address.port}`);
    });
    
    udpServer.bind(port || 5555);
}

module.exports = initUdpServer;