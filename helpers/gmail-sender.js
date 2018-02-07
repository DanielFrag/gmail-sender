const fileUtils = require('../utils/file-utils');
const LoggerHelper = require('./logger');
const nodemailer  = require('nodemailer');
const {resolve} = require('path');
const sendmail = require('sendmail');
const smtpTransport = require('nodemailer-smtp-transport');
const stringUtils = require('../utils/string-utils');

function sendEmailWithGmailSender(transporter, mailOptions) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(error, info) {
            if(error){
                reject(error)
            } else {
                resolve(info)
            }
        });
    });
}

function sendEmailWithCustomSender(sender, from, to, replyTo, subject, html) {
    return new Promise((resolve, reject) => {
        sender({
            from,
            to,
            replyTo,
            subject,
            html
        }, function(err, reply) {
            if (reply) {
                return resolve(reply);
            } else {
                return reject(err);
            }
        });
    });
}

class GmailSender {
    constructor(userEmail, emailPass, userAlias) {
        this.email = stringUtils.validadeEmail(userEmail) ? userEmail : '';
        this.pass = emailPass;
        this.userAlias = userAlias;
        if (this.email) {
            this.logger = new LoggerHelper(this.email);
        }
    }
    async sendWithGmailSmtpServerQueue(subject, message, receiversList) {
        if (!this.email) {
            return Promise.reject('Invalid email');
        }
        if (!this.email || !Array.isArray(receiversList)) {
            return Promise.reject('The receiversList must be an array');
        }
        await this.logger.createLogFile();
        const transporter = nodemailer.createTransport(smtpTransport({
            service: 'Gmail',
            auth: {
                user: this.email,
                pass: this.pass
            },
            tls:{
                rejectUnauthorized: false
            }
        }));
        const mailOptions = {
            from: this.userAlias ? `${this.userAlias} <${this.email}>`: this.email,
            to: '',
            subject,
            html: ''
        };
        const report = {
            error: 0,
            ignored: 0,
            sent: 0
        }
        for (let reciever of receiversList) {
            if (stringUtils.validadeEmail(reciever.email)) {
                try{
                    mailOptions.to = reciever.email;
                    mailOptions.html = reciever.vars ? stringUtils.assignMessageVars(message, reciever.vars) : message;
                    await sendEmailWithGmailSender(transporter, mailOptions);
                    report.sent++;
                } catch(e) {
                    report.error++;
                    this.logger.logError(`${reciever.email} ${e.message}`);
                }
            } else {
                report.ignored++;
                this.logger.logInfo(`${reciever.email} ignored`);
            }
            reciever = {};
        }
        mailOptions.html = `<h2>Summary</h2></br><div>sent: ${report.sent}</div><div>error: ${report.error}</div><div>ignored: ${report.ignored}</div>`;
        mailOptions.subject = 'Sender Report'
        mailOptions.to = this.email;
        const log = await fileUtils.readFileWithPromise(resolve(__dirname, `/${this.logger.getLogFileName()}`), 'utf8');
        if (log && log.length) {
            mailOptions.attachments = [{
                filename: 'log.txt',
                content: log
            }];
        }
        await sendEmailWithGmailSender(transporter, mailOptions);
        await this.logger.resetLogger();
        transporter.close();
    }
    async sendWithGmailSmtpServerPool(subject, message, receiversList) {
        if (!this.email) {
            return Promise.reject('Invalid email');
        }
        if (!this.email || !Array.isArray(receiversList)) {
            return Promise.reject('The receiversList must be an array');
        }
        await this.logger.createLogFile();
        const transporter = nodemailer.createTransport({
            pool: true,
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: this.email,
                pass: this.pass
            },
            maxMessages: 1
        });
        const report = {
            error: 0,
            ignored: 0,
            sent: 0,
            total: receiversList.length
        }
        transporter.on('idle', () => {
            while (receiversList.length && transporter.isIdle()) {
                const mailOptions = {
                    from: this.userAlias ? `${this.userAlias} <${this.email}>`: this.email,
                    subject
                };
                const reciever = receiversList.shift();
                if (stringUtils.validadeEmail(reciever.email)) {
                    mailOptions.to = reciever.email;
                    mailOptions.html = reciever.vars ? stringUtils.assignMessageVars(message, reciever.vars) : message;
                    transporter.sendMail(mailOptions, function(err, info) {
                        if (err) {
                            report.error++;
                            this.logger.logError(`${reciever.email} ${err}`);
                        } else {
                            report.sent++;
                        }
                        transporter.emit('idle');
                    });
                } else {
                    report.ignored++;
                    this.logger.logInfo(`${reciever.email} ignored`);
                }    
            }
            if (transporter.isIdle() && report.error + report.ignored + report.sent === report.total) {
                const mailOptions = {
                    from: this.userAlias ? `${this.userAlias} <${this.email}>`: this.email
                };
                mailOptions.html = `<h2>Summary</h2></br><div>sent: ${report.sent}</div><div>error: ${report.error}</div><div>ignored: ${report.ignored}</div>`;
                mailOptions.subject = 'Sender Report'
                mailOptions.to = this.email;
                fileUtils
                    .readFileWithPromise(resolve(__dirname, `/${this.logger.getLogFileName()}`), 'utf8')
                    .then(fileData => {
                        if (fileData.length) {
                            mailOptions.attachments = [{
                                filename: 'log.txt',
                                content: fileData
                            }];
                        }
                        transporter.sendMail(mailOptions, function(error, info) {
                            setImmediate(() => {
                                transporter.close();
                            });
                        });
                        this.logger
                            .resetLogger()
                            .catch(err => {});
                    })
                    .catch(fileError => {
                        setImmediate(() => {
                            transporter.close();
                        });
                    });
            }
        });
        transporter.emit('idle');
    }
    async sendWithCustomSender(subject, message, receiversList) {
        const sender = sendmail({
            silent: true
        });
        try {
            for (const reciever of receiversList) {
                if (stringUtils.validadeEmail(reciever.email)) {
                    await sendEmailWithCustomSender(sender, this.email, reciever.email, this.email, subject, reciever.vars ? stringUtils.assignMessageVars(message, reciever.vars) : message);
                }
            }
        } catch(e) {
            return {
                error: e
            };
        }
    }
    async sendWithCustomSenderAndDkim(subject, message, receiversList, dkimPath, domainName) {
        const privateKey = await fileUtils.readFileWithPromise(dkimPath, 'utf8');
        if (typeof domainName != 'string' || !privateKey) {
            return {
                error: 'Invalid params'
            }
        }
        const sender = sendmail({
            silent: true,
            dkim: {
                privateKey: privateKey,
                keySelector: domainName
            }
        });
        try {
            for (const reciever of receiversList) {
                if (stringUtils.validadeEmail(reciever.email)) {
                    await sendEmailWithCustomSender(sender, this.email, reciever.email, this.email, subject, reciever.vars ? stringUtils.assignMessageVars(message, reciever.vars) : message);
                }
            }
        } catch(e) {
            return {
                error: e
            };
        }
    }
}

module.exports = GmailSender;
