const express = require('express');
const app = express();
require('./config/express')(app);

app.listen(app.get('port'), () => {
    console.log(`Running at port:${app.get('port')}`);
});