// usecase/verify.html.js

const verifyHtml = (token) => {
    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Doğrulama</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .email-container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                width: 100%;
                text-align: center;
            }
            .email-header {
                font-size: 24px;
                color: #333333;
                margin-bottom: 20px;
            }
            .email-body {
                font-size: 16px;
                color: #555555;
                margin-bottom: 20px;
            }
            .email-button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 5px;
                text-decoration: none;
                margin-top: 20px;
            }
            .email-footer {
                font-size: 14px;
                color: #888888;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">Email Doğrulama</div>
            <div class="email-body">
                <p>Merhaba,</p>
                <p>Hesabınızı doğrulamak için aşağıdaki butona tıklayın:</p>
                <a href="http://localhost:3000/user/verify?token=${token}" class="email-button">Hesabımı Doğrula</a>
                <p>Eğer bu işlemi siz başlatmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
            </div>
            <div class="email-footer">
                <p>Teşekkürler,</p>
                <p>MyApp Ekibi</p>
            </div>
        </div>
    </body>
    </html>
    `;
  };
  
  module.exports = verifyHtml;
  