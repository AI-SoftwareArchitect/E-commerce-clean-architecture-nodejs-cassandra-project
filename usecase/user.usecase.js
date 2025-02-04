const bcrypt = require('bcrypt');
const MailUseCase = require('./mail.usecase');
const mailTransporter = require('../frameworks/mailTransporter'); // MailTransporter örneğinizin doğru yolunu kontrol edin

class UserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
    // MailUseCase’e mail transporter’ı enjekte ediyoruz.
    this.mailSender = new MailUseCase(mailTransporter.getTransporter());
  }

  async save(user) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    user.isVerified = user.authProvider === 'google' ? true : false;
    await this.userRepository.save(user);
  }

  async sendVerificationEmail(email, token) {
    await this.mailSender.sendVerificationEmail(email, token);
  }

  async update(userId, user) {
    await this.userRepository.update(userId, user);
  }

  async remove(userId) {
    await this.userRepository.remove(userId);
  }

  async findById(userId) {
    return await this.userRepository.findById(userId);
  }

  async findByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }
}

module.exports = UserUseCase;
