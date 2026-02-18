import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "url";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerXenditWebhook } from "./xendit";

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy: Railway/nginx set X-Forwarded-Proto; required for correct req.protocol and cookie secure
app.set("trust proxy", 1);

// 1. ÖNEMLİ: Railway ve Bulut ortamları için Port ayarı
// 0.0.0.0 dinlemesi şarttır, yoksa dış dünyadan erişilemez.
const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

// JSON body parser (API istekleri için)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OAuth callback (session cookie set here after OAuth login)
registerOAuthRoutes(app);

// Xendit webhook for payment callbacks
registerXenditWebhook(app);

// tRPC API Middleware (must be registered before static + SPA fallback)
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// 2. ÖNEMLİ: Healthcheck Endpoint'i
// Railway /api/health adresine istek atıp cevap bekliyor.
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Statik Dosyalar (Vite Build Sonrası)
// Loglardan anladığım kadarıyla build işlemi 'dist/public' veya kök dizine çıkıyor.
// Garanti olsun diye hem development hem production yollarını kapsayalım.
const publicDir = path.resolve(__dirname, "../dist/public"); // Build sonrası
const publicDirDev = path.resolve(__dirname, "../public");   // Dev ortamı

// Önce build klasörüne bak, yoksa dev klasörüne
app.use(express.static(publicDir));
app.use(express.static(publicDirDev));

// API Rotaların buraya gelecek (Varsa import edip app.use('/api', apiRouter) yapmalısın)
// Şimdilik test için bir demo route:
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Server!" });
});

// 3. SPA (Single Page Application) Fallback
// React/Vite router'ın çalışması için, API olmayan tüm istekleri index.html'e yönlendir.
app.get("*", (req, res) => {
  // Önce dist içindekini dene
  const indexHtml = path.join(publicDir, "index.html");
  res.sendFile(indexHtml, (err) => {
    if (err) {
      // Bulamazsa dev ortamındakini dene
      res.sendFile(path.join(publicDirDev, "index.html"));
    }
  });
});

// Sunucuyu Başlat
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server listening on http://${HOST}:${PORT}`);
  console.log(`Looking for static files in: ${publicDir}`);
});
