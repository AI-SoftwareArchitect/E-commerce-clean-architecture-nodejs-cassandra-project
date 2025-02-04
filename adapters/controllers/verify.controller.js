// adapters/controllers/verify.controller.js
const verifyHtml = require('../../usecase/verify');  // verify.html.js'yi doğru şekilde dahil ettiğinizden emin olun

class VerifyController {
  constructor() {}

  async verify(req, res) {
    try {
      // 'token' query parametresini al
      const token = req.query.token;

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      // HTML içeriğini dinamik olarak oluştur
      const htmlContent = verifyHtml(token);

      res.status(200).send(htmlContent);  // HTML içeriği doğru şekilde gönderiliyor
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = VerifyController;
