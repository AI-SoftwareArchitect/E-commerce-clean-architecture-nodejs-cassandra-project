const Redis = require("ioredis");

const redis = new Redis({
  host: "127.0.0.1", // Redis sunucu adresi
  port: 6379,        // Redis portu
});

// Bağlantı kontrolü
redis.on("connect", () => console.log("🔗 Redis'e bağlandı!"));
redis.on("error", (err) => console.error("❌ Redis Hatası:", err));

module.exports = redis;