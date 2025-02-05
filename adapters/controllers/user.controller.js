const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
  constructor(userUseCase) {
    this.userUseCase = userUseCase;
  }

    // Google ile giriş ya da kayıt fonksiyonu
    async loginOrSignupGoogle(req, res) {
        const { idToken } = req.body;
    
        try {
          // Google ID Token'ını doğrula
          const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID, // Google Client ID'nizi burada kullanın
          });
    
          const payload = ticket.getPayload(); // Kullanıcı bilgileri
          const email = payload.email;
          const googleId = payload.sub;
    
          let user = await this.userUseCase.findByEmail(email);
    
          if (!user) {
            // Kullanıcı yoksa yeni kullanıcı oluştur
            user = {
              id: uuidv4(),
              name: payload.name,
              email,
              password: null, // Google ile şifre gereksiz
              isVerified: true,
              authProvider: 'google',
              googleId,
              createdAt: new Date()
            };
            await this.userUseCase.save(user); // Kullanıcıyı veritabanına kaydet
          }
    

          await this.userUseCase.updateRefreshToken(user.id, refreshToken);
          // Kullanıcıyı bulduktan sonra Access Token oluştur
          const accessToken = this.generateAccessToken(user);
          const refreshToken = this.generateRefreshToken(user);
    
          // Refresh Token'ı Secure cookie olarak gönder
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
          });
    
          res.status(200).json({ accessToken });
    
        } catch (error) {
          console.error('Google login/signup error:', error);
          res.status(500).json({ error: 'Google ile giriş veya kayıt sırasında bir hata oluştu' });
        }
      }

  generateAccessToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
  }

  generateRefreshToken(user) {
    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }

  // --- CRUD İşlemleri ---
  async findAll(req, res) {
    try {
      const users = await this.userUseCase.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req, res) {
    const { id } = req.params;
    try {
      const user = await this.userUseCase.findById(id);
      if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const user = await this.userUseCase.findById(id);
      if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      await this.userUseCase.update(id, updatedData);
      res.status(200).json({ message: 'Kullanıcı başarıyla güncellendi' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async remove(req, res) {
    const { id } = req.params;
    try {
      const user = await this.userUseCase.findById(id);
      if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      await this.userUseCase.remove(id);
      res.status(200).json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Kullanıcı kaydını gerçekleştiren fonksiyon
  async save(req, res) {
    const { name, email, password } = req.body;
    try {
      const newUser = {
        id: uuidv4(),
        name,
        email,
        password: password,
        isVerified: false,
        authProvider: 'local',
        googleId: null,
        createdAt: new Date(),
      };

      await this.userUseCase.save(newUser);
      res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // UserController sınıfına eklenecek metodlar

// Email/Password ile kayıt
async signup(req, res) {
    const { name, email, password } = req.body;
  
    try {
      // Email kontrolü
      const existingUser = await this.userUseCase.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Bu email adresi zaten kayıtlı' });
      }
  
      // Yeni kullanıcı oluştur
      const newUser = {
        id: uuidv4(),
        name,
        email,
        password, // UserUseCase'de hash'lenecek
        isVerified: false,
        authProvider: 'local',
        googleId: null,
        createdAt: new Date()
      };
  
      await this.userUseCase.save(newUser);
  
      // Doğrulama emaili için token oluştur
      const verificationToken = jwt.sign(
        { email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      // Doğrulama emaili gönder
      await this.userUseCase.sendVerificationEmail(email, verificationToken);
  
      res.status(201).json({ 
        message: 'Kullanıcı başarıyla oluşturuldu. Lütfen email adresinizi doğrulayın.' 
      });
  
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Kayıt işlemi sırasında bir hata oluştu' });
    }
  }
  
  // Email/Password ile giriş
  async login(req, res) {
    const { email, password } = req.body;
  
    try {
      // Kullanıcıyı bul
      const user = await this.userUseCase.findByEmail(email);
      
      // Kullanıcı kontrolü
      if (!user) {
        return res.status(401).json({ error: 'Email veya şifre hatalı' });
      }
  
      // Google ile kayıtlı kullanıcı kontrolü
      if (user.authProvider === 'google') {
        return res.status(400).json({ 
          error: 'Bu hesap Google ile oluşturulmuş. Lütfen Google ile giriş yapın.' 
        });
      }
  
      // Şifre kontrolü
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email veya şifre hatalı' });
      }
  
      // Email doğrulama kontrolü
      if (!user.isVerified) {
        return res.status(403).json({ 
          error: 'Lütfen email adresinizi doğrulayın' 
        });
      }
  
      // Token oluştur
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
  
      // Refresh token'ı güvenli cookie olarak gönder
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
      });
  
      // Access token'ı response body'de gönder
      res.status(200).json({ 
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Giriş işlemi sırasında bir hata oluştu' });
    }
  }

  async verify(req, res) {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ error: 'Token is required' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.userUseCase.findByEmail(decoded.email);
      if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

      user.isVerified = true;
      await this.userUseCase.update(user.id, user);

      res.status(200).json({ message: 'Email başarıyla doğrulandı' });
    } catch (error) {
      console.error('Verify error:', error);
      res.status(400).json({ error: 'Geçersiz veya süresi dolmuş token' });
    }
}

  
  // Refresh token ile yeni access token alma
  async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token bulunamadı' });
    }

    try {
        // Refresh Token'ı doğrula
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Kullanıcının veritabanında kayıtlı olup olmadığını kontrol et
        const user = await this.userUseCase.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Geçersiz token' });
        }

        // Burada veritabanında refresh token'ı saklayıp doğrulamak gerekiyor!
        const isValid = await this.userUseCase.isValidRefreshToken(user.id, refreshToken);
        if (!isValid) {
            return res.status(403).json({ error: 'Geçersiz veya eski Refresh Token' });
        }

        // Yeni Access ve Refresh Token üret
        const newAccessToken = this.generateAccessToken(user);
        const newRefreshToken = this.generateRefreshToken(user);

        // Refresh Token'ı güncelle (Eski token'ı sil, yeni token'ı kaydet)
        await this.userUseCase.updateRefreshToken(user.id, newRefreshToken);

        // Yeni Refresh Token'ı güvenli cookie olarak ayarla
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
        });

        res.status(200).json({ accessToken: newAccessToken });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token' });
    }
  }


}

module.exports = UserController;
