const GmailSender = require('../helpers/gmail-sender');
const data = require('./data');

describe('Teste do gmail sender', () => {
    it ('Deve enviar um email pra lista de emails', async () => {
        const gmail = new GmailSender(data.email, data.pass, 'Daniel');
        const html = '<h2>Olá ##name##!</h2> </br>Essa é uma mensagem de teste. </br>##greetings####name##';
        const receivers = [{
            email: 'danielmarcos2@yahoo.com.br',
            vars: {
                name: 'Daniel',
                greetings: 'Vlw '
            }
        }, {
            email: 'dfragoso@tasken.com',
            vars: {
                name: 'eu',
                greetings: 'Ok '
            }
        }, {
            email: 'danieljogosapps@gmail.com',
            vars: {
                name: 'D',
                greetings: 'blz '
            }
        }, {
            email: 'pqpdarius2@gmail.com',
            vars: {
                name: 'DANI',
                greetings: 'já é '
            }
        }, {
            email: 'pqpdarius2-@gmail.com.1',
            vars: {
                name: 'DANI',
                greetings: 'já é '
            }
        }, {
            email: 'pqpdarius2-@gmail.com.2',
            vars: {
                name: 'DANI',
                greetings: 'já é '
            }
        }];
        const result = await gmail.sendWithGmailSmtpServerQueue('mensagem de teste', html, receivers);
        console.log(result);
    }).timeout(20000);
    /*
    it ('Deve enviar um email pra lista de emails', (done) => {
        const gmail = new GmailSender('dfragoso@rcpsoftware.com.br', 'tasken@222', 'Daniel');
        const html = '<h2>Olá ##name##!</h2> </br>Essa é uma mensagem de teste. </br>##greetings####name##';
        const receivers = [{
            email: 'danielmarcos2@yahoo.com.br',
            vars: {
                name: 'Daniel',
                greetings: 'Vlw '
            }
        }, {
            email: 'dfragoso@tasken.com',
            vars: {
                name: 'eu',
                greetings: 'Ok '
            }
        }, {
            email: 'danieljogosapps@gmail.com',
            vars: {
                name: 'D',
                greetings: 'blz '
            }
        }, {
            email: 'pqpdarius2@gmail.com',
            vars: {
                name: 'DANI',
                greetings: 'já é '
            }
        }, {
            email: 'pqpdarius2-@gmail.com.1',
            vars: {
                name: 'DANI',
                greetings: 'já é '
            }
        }, {
            email: 'pqpdarius2-@gmail.com.2',
            vars: {
                name: 'DANI',
                greetings: 'já é '
            }
        }];
        gmail.sendWithGmailSmtpServerPool('mensagem de teste', html, receivers);
        setTimeout(() => {
            done();
        }, 19000);
    }).timeout(20000);
    */
});