var fs = require('fs');

class CustomQueue {
    items = {};
    //should care for maxint
    tail = 0;
    head = 0;

    enqueue(element) {
        this.items[this.tail] = element;
        this.tail++;
    }
    dequeue() {
        const item = this.items[this.head];
        delete this.items[this.head];
        this.head++;
        return item;
    }
    isEmpty() {
        return this.size() === 0;
    }
    size() {
        return this.tail - this.head;
    }
    peek() {
        return this.items[this.head];
    }
    iterateAndMap(func) {
        let returnArray = new Array();
        for (let i = this.head; i < this.tail; i++){
            const res = func(this.items[i]);
            if (res != null)
                returnArray.push(res);
        }
        return returnArray;
    }
}

class MessageQueueHandlerSingleton {
    
    constructor() {
        this.queue = new CustomQueue();
        this.savingArray = new Array();
    }

    getLatestMessagesByName(name){
        return this.queue.iterateAndMap((e) => {
            if (e.name == name)
                return e;
            return null;
        })
    }

    getAllLatestMessages(){
        return this.queue.iterateAndMap((e) => {
            return e;
        })
    }
    //save content of savingQueue to log file 
    saveArrayToLog(){
        //create log file named after the timestamp of first element in array
        const date = new Date(this.savingArray[0].timestamp);
        var file = fs.createWriteStream(date.toISOString());
        this.savingArray.forEach(function(v) { file.write(JSON.stringify(v) + '\n'); });
        file.end();
        //reset array to new empty array
        this.savingArray = [];
    }
    //ajoute un message a la queue
    enqueueMessage(message) {
        const timestamp = Date.now();
        this.queue.enqueue({timestamp: timestamp, name: message.name, message: message});
        //check oldest timestamp , if timestamp older than 60sec , dequeue last element
        var oldest = this.queue.peek();
        console.log(timestamp - oldest.timestamp);
        while ( timestamp - oldest.timestamp > process.env.LOGRANGE){
            const element = this.queue.dequeue();
            //check if older than 60s after first savingArray element timestamp
            //if older -> create log of all that was previously saved
            if (this.savingArray.length){
                if (element.timestamp - this.savingArray[0].timestamp > process.env.LOGRANGE){
                    this.saveArrayToLog();
                }
            }
            this.savingArray.push(element);
            oldest = this.queue.peek();
        }
    }
    dequeueMessage(){
        return this.queue.dequeue();
    }
    //iterate through all entries
    logContent(){
        console.log("LOGGING QUEUE CONTENT");
        for (const [key, value] of Object.entries(this.queue.items)){
            console.log(`${key}: ${JSON.stringify(value)}`);
        }
    }
}

class MessageQueueHandler {
    constructor() {
        throw new Error("Use MessageQueueHandler.getInstance()");
    }

    static getInstance() {
        if (!MessageQueueHandler.instance) {
            MessageQueueHandler.instance = new MessageQueueHandlerSingleton();
        }
        return MessageQueueHandler.instance;
    }
}

module.exports = MessageQueueHandler.getInstance();