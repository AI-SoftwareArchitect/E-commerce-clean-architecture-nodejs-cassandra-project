const nodemailer = require('nodemailer');
require('dotenv').config(); // Ortam değişkenlerini kullanabilmek için dotenv kullanıyoruz

class MailTransporter {
    constructor() {
        if (!MailTransporter.instance) {
            // Ortam değişkenlerinden güvenli bir şekilde kullanıcı bilgilerini alıyoruz
            this.transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,  // Örneğin: 'your-email@gmail.com'
                    pass: process.env.EMAIL_PASS   // E-posta şifresi
                }
            });
            MailTransporter.instance = this;
        }
        return MailTransporter.instance;
    }

    getTransporter() {
        return this.transporter;
    }
}

module.exports = new MailTransporter();
