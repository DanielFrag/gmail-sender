const fs = require('fs');
const path = require('path');

module.exports = (router) => {
    fs.readdirSync('./routes').forEach(file => require(`../routes/${file}`)(router));
}