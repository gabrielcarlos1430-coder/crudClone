import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, fallback = "") =>
  process.env[key] ?? fallback;

export const env = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  port: Number(getEnv("PORT", "3000")),

  jwtSecret: getEnv("JWT_SECRET", "secret"),
  jwtRefreshSecret: getEnv("JWT_REFRESH_SECRET", "refresh-secret"),

  redisUrl: getEnv("REDIS_URL", "redis://localhost:6379"),

  // ⚽ FOOTBALL (BLOQUEIO DE VAZIO)
  footballApiKey: getEnv("API_FOOTBALL_KEY"),
  footballApiHost: getEnv("API_FOOTBALL_HOST", "v3.football.api-sports.io"),

  frontUrl: getEnv("FRONT_URL", "http://localhost:5173"),

  scraperUrl: getEnv(
    "SCRAPER_URL",
    "https://portalbrasil.net/jogodobicho/resultado-do-jogo-do-bicho/"
  ),

  forcePro: getEnv("FORCE_PRO") === "true",
};

// 🔥 DEBUG FORÇADO (remove depois se quiser)
console.log("⚽ ENV CHECK:", {
  key: env.footballApiKey ? "OK" : "MISSING",
  host: env.footballApiHost
});