const express = require('express')
const router = express.Router()
const messageQueueHandler = require('../storage')

router.get('/', (req, res) => {
    const response = messageQueueHandler.getAllLatestMessages();
    res.status(200).json(response);
});

router.get('/:id', (req, res) => {
    // res.status(200).send('Data for drone name :' + req.params.id);
    const response = messageQueueHandler.getLatestMessagesByName(req.params.id);
    res.status(200).json(response);
    // res.download(); to download a file from server
    // res.render() to render an html file  ->  npm i ejs // to be able to render views app.set('view engine', 'ejs');
});

module.exports = router;