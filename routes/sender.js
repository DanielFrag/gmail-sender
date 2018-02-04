const sender = require('../controllers/sender');

module.exports = (router) => {
    router.get('/get-body-struct', sender.getBodyStruct);
    router.post('/send-email-by-list', sender.sendEmailByList);
}