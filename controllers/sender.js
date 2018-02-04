const GmailSender = require('../helpers/gmail-sender');

module.exports = {
    sendEmailByList(req, res) {
        const gmailLogin = req.body.gmailLogin;
        const gmailPass = req.body.gmailPass;
        const userAlias = req.body.userAlias;
        const receiversList = req.body.receiversList;
        const subject = req.body.subject;
        const message = req.body.message;
        if (!gmailLogin || !gmailPass || !userAlias || !receiversList || !subject || !message) {
            return res.status(401).send('Missing params');
        }
        const sender = new GmailSender(gmailLogin, gmailPass, userAlias);
        sender.sendWithGmailSmtpServerQueue(subject, message, receiversList);
        return res.status(200).send('Ok');
    },
    getBodyStruct(req, res) {
        return res.json({
            gmailLogin: 'user@gmail.com',
            gmailPass: 'mypass',
            userAlias: 'myalias',
            subject: 'test',
            message: '<h2>Olá ##name##!</h2> </br>Essa é uma mensagem de teste. </br>##greatings##',
            receiversList: [{
                email: 'firstclient@gmail.com',
                vars: {
                    name: "first",
                    greatings: "Vlw 1!"
                }
            }, {
                email: 'secondclient@yahoo.com.br',
                vars: {
                    name: "second",
                    greatings: "Vlw 2!"
                }
            }]
        });
    }
};