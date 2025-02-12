const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

class Logger {
  // Singleton instance'ını saklamak için statik değişken
  static instance = null;

  constructor() {
    if (Logger.instance) {
      return Logger.instance;  // Eğer instance zaten varsa, tekrar oluşturma
    }

    // Logger'ı yapılandırma
    this.logger = winston.createLogger({
      level: 'info',  // En düşük log seviyesi
      format: winston.format.combine(
        winston.format.colorize(),  // Logları renkli hale getirir
        winston.format.timestamp(),  // Zaman damgası ekler
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
      transports: [
        new winston.transports.Console(),  // Konsola log yazma
        new DailyRotateFile({  // Günlük log döndürme
          filename: 'logs/%DATE%-app.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',  // Dosya başına maksimum boyut
          maxFiles: '14d'  // Son 14 günün loglarını saklar
        })
      ]
    });

    Logger.instance = this; // İlk defa oluşturuluyorsa instance'ı kaydet
    return this;  // Bu instance'ı döndür
  }

  // Info logu yazma
  info(message) {
    this.logger.info(message);
  }

  // Warn logu yazma
  warn(message) {
    this.logger.warn(message);
  }

  // Error logu yazma
  error(message) {
    this.logger.error(message);
  }

  // Debug logu yazma
  debug(message) {
    this.logger.debug(message);
  }

  // Verbose logu yazma
  verbose(message) {
    this.logger.verbose(message);
  }

  // Silly logu yazma
  silly(message) {
    this.logger.silly(message);
  }
}

// Singleton instance'ı dışarıya export et
module.exports = new Logger();
