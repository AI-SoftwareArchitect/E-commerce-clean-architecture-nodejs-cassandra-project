const jwt = require('jsonwebtoken');

class MailUseCase {
  constructor(transporter) {
    if (!transporter) {
      throw new Error('Mail transporter is required');
    }
    this.transporter = transporter;
  }

  async sendVerificationEmail(email, token) {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Email Doğrulama',
      text: `Emailinizi doğrulamak için aşağıdaki linke tıklayın: ${process.env.APP_URL}/verify/verify-email?token=${token}`
    };
    console.log(`Emailinizi doğrulamak için aşağıdaki linke tıklayın: ${process.env.APP_URL}/verify/verify-email?token=${token}`);
    await this.transporter.sendMail(mailOptions);
  }

  async verifyEmail(token, userRepository) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userRepository.findByEmail(decoded.email);
      if (!user) throw new Error('Kullanıcı bulunamadı.');
      user.isVerified = true;
      await userRepository.update(user.id, user);
    } catch (err) {
      throw new Error('Geçersiz token');
    }
  }
}

module.exports = MailUseCase;
