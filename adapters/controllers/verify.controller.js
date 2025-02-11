
const verifyHtml = require('../../usecase/verify');  

class VerifyController {
  constructor() {}

  async verify(req, res) {
    try {
      const token = req.query.token;

      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const htmlContent = verifyHtml(token);

      res.status(200).send(htmlContent);  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = VerifyController;
