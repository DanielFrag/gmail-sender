const bodyParser = require('body-parser');
const { port } = require('./config');
const express = require('express');
const router = express.Router();
require('./router')(router);

module.exports = app => {
    app.set('port', port);
    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use('/api', router);
}
