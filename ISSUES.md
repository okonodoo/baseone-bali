# BaseOne Bali — Tespit Edilen Sorunlar

> Tarih: 2026-02-21
> Kapsam: Güvenlik, kod kalitesi, mimari, performans

---

## 1. Güvenlik Açıkları (Security)

### 1.1 — CORS, Helmet, Rate Limiting YOK
**Dosya:** `server/index.ts`
**Önem:** Yüksek

Express sunucusunda temel güvenlik middleware'leri eksik:
- `cors` — Hangi origin'lerin API'ye erişebileceği kontrol edilmiyor. Herhangi bir domain API'ye istek atabilir.
- `helmet` — HTTP güvenlik başlıkları (CSP, X-Frame-Options, HSTS vb.) set edilmiyor.
- `express-rate-limit` veya benzeri — Brute force, spam ve DDoS saldırılarına karşı koruma yok.

**En kritik nokta:** `lead.create` ve `vendor.uploadImage` endpoint'leri hem kimlik doğrulama gerektirmiyor hem de rate limit yok. Bu sayede otomatize araçlarla sınırsız lead ve dosya yüklemesi yapılabilir.

---

### 1.2 — `vendor.uploadImage` Herkese Açık (unauthenticated)
**Dosya:** `server/routers.ts:189`
**Önem:** Yüksek

```ts
uploadImage: publicProcedure  // Giriş yapmış olmak gerekmiyor
```

S3'e dosya yükleme işlemi herhangi bir oturuma ihtiyaç duymadan gerçekleştirilebilir. `fileSize` parametresi **client'tan geliyor**, sunucu asıl buffer boyutunu kontrol etmiyor:

```ts
// Satır 198-199: fileSize input'tan alınıyor
if (input.fileSize > MAX_FILE_SIZE) { ... }
const buffer = Buffer.from(input.fileData, "base64");
// buffer.length kontrolü yapılmıyor
```

Saldırgan `fileSize: 100` gönderip 50 MB'lık veri yükleyebilir.

---

### 1.3 — `dangerouslySetInnerHTML` ile XSS Riski
**Dosya:** `client/src/pages/BlogDetail.tsx:126`
**Önem:** Orta-Yüksek

```tsx
dangerouslySetInnerHTML={{ __html: formatContent(content) }}
```

Blog içeriği Odoo'dan veya admin panelinden geliyorsa ve `formatContent` yeterli sanitizasyon yapmıyorsa XSS saldırısına açık. `DOMPurify` veya benzeri bir sanitizasyon kütüphanesi kullanılmalı.

**Ek:** `client/src/components/PropertyMap.tsx:60,159` — Map marker'ları için `innerHTML` kullanılıyor, aynı risk geçerli.

---

### 1.4 — `new Function()` ile Kod Çalıştırma
**Dosya:** `server/_core/chat.ts:70`
**Önem:** Orta

```ts
const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "");
const result = Function(`"use strict"; return (${sanitized})`)() as number;
```

Regex tabanlı sanitizasyon zayıf olabilir. Örneğin `(1).constructor.constructor("...")()` gibi kalıplar bazı durumlarda regex'i bypass edebilir. `mathjs` gibi bir kütüphane kullanmak daha güvenli.

---

### 1.5 — Hardcoded E-posta Adresi
**Dosya:** `server/email.ts:12`
**Önem:** Düşük-Orta

```ts
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ozgur@telkonone.com";
```

`ADMIN_EMAIL` env değişkeni tanımlanmadığında tüm lead ve vendor bildirimleri kişisel bir e-posta adresine gidiyor. Bu hem gizlilik riski hem de operasyonel risk.

---

### 1.6 — JWT Secret Boş String Olabilir
**Dosya:** `server/_core/env.ts:3`
**Önem:** Yüksek

```ts
cookieSecret: process.env.JWT_SECRET ?? process.env.SESSION_SECRET ?? "",
```

`JWT_SECRET` tanımlanmadığında boş string `""` kullanılıyor. Bu, session token imzalamayı tamamen anlamsız kılıyor. Startup'ta zorunlu env değişkenleri kontrol edilmiyor.

---

## 2. Ortam Değişkeni Doğrulaması Eksik

**Dosya:** `server/_core/env.ts`, `server/index.ts`
**Önem:** Yüksek

Sunucu, kritik değişkenler eksik olsa bile başlıyor. Hiçbir yerde startup validation yok:

| Değişken | Boş string durumu |
|---|---|
| `JWT_SECRET` | Session imzalanamaz (güvenlik açığı) |
| `DATABASE_URL` | DB bağlantısı başarısız olur, uygulama çalışmaya devam eder |
| `XENDIT_SECRET_KEY` | Ödeme işlemi yapılamaz ama sessizce geçilir |
| `OPENAI_API_KEY` / `BUILT_IN_FORGE_API_KEY` | AI chat çalışmaz |

Öneri: Uygulama başlangıcında eksik kritik değişkenleri tespit edip process'i sonlandırmak.

---

## 3. Kod Kalitesi Sorunları

### 3.1 — `as any` Kullanımları (Type Safety)
**Önem:** Düşük

```ts
// server/routers.ts:474
(data as any).publishedAt = new Date();

// server/_core/sdk.ts:138-142
(data as any)?.platforms,
(data as any)?.platform ?? data.platform ?? null,
...(data as any),

// server/storage.ts:60
new Blob([data as any], { type: contentType });
```

`as any` kullanımı TypeScript'in tip güvenliğini devre dışı bırakır ve runtime hatalarını gizler.

---

### 3.2 — Simüle Edilmiş Hava Durumu Aracı
**Dosya:** `server/_core/chat.ts:43-55`
**Önem:** Orta

```ts
const temp = Math.floor(Math.random() * 30) + 5;
const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"][Math.floor(Math.random() * 4)];
```

AI chat'in `getWeather` aracı rastgele veri döndürüyor — gerçek bir API entegrasyonu yok. AI bu verileri gerçekmiş gibi kullanıcıya sunuyor. Bu, kullanıcıyı yanıltır.

---

### 3.3 — Demo Route Production Sunucusunda Kaldı
**Dosya:** `server/index.ts:62-64`
**Önem:** Düşük

```ts
// "API Rotaların buraya gelecek" yorum ile birlikte demo route:
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Server!" });
});
```

Test amaçlı yazılmış bu route production'da hâlâ aktif.

---

### 3.4 — Türkçe Yorumlar Production Kodunda
**Dosya:** `server/index.ts`
**Önem:** Çok Düşük

```ts
// 1. ÖNEMLİ: Railway ve Bulut ortamları için Port ayarı
// JSON body parser (API istekleri için)
// 3. SPA (Single Page Application) Fallback
```

Kod yorumları Türkçe yazılmış; uluslararası ekip için İngilizce tercih edilmeli.

---

## 4. Mimari ve Tasarım Sorunları

### 4.1 — Base64 ile Resim Yükleme (Verimsiz)
**Dosya:** `server/routers.ts:189-211`
**Önem:** Orta

Resimler tRPC üzerinden base64 olarak gönderiliyor. Bu yöntem:
- JSON payload boyutunu ~%33 artırıyor
- Büyük dosyalar için bellek baskısı yaratıyor
- `multipart/form-data` ile doğrudan S3'e yüklemeye kıyasla çok daha yavaş

---

### 4.2 — Kriptografik Olmayan Rastgelelik ile Dosya İsimleri
**Dosya:** `server/routers.ts:207`
**Önem:** Düşük

```ts
const randomSuffix = Math.random().toString(36).substring(2, 10);
```

`Math.random()` tahmin edilebilir. Dosya path'leri için `crypto.randomUUID()` veya `crypto.randomBytes()` kullanılmalı.

---

### 4.3 — Vendor Submission Country Hardcoded
**Dosya:** `server/routers.ts:252`
**Önem:** Düşük

```ts
country: "Indonesia",  // Tüm vendor'lar Endonezya'dan varsayılıyor
```

Vendor'ın ülkesi her zaman "Indonesia" olarak Odoo'ya gönderiliyor.

---

### 4.4 — Lead Listesi için Pagination Yok
**Dosya:** `server/routers.ts:400`
**Önem:** Orta

```ts
return getRecentLeads(input?.limit || 100);
```

Admin lead listesi maksimum 100 kayıt döndürüyor ve offset/cursor tabanlı pagination yok. Veriler büyüdükçe bu yeterli olmayacak.

---

### 4.5 — SPA Fallback'te Hata Yönetimi Eksik
**Dosya:** `server/index.ts:68-77`
**Önem:** Düşük

```ts
app.get("*", (req, res) => {
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.sendFile(path.join(publicDirDev, "index.html")); // Bu da başarısız olursa?
    }
  });
});
```

İkinci `sendFile` çağrısı da başarısız olursa yanıt takılı kalır (timeout), hata yönetimi yok.

---

## 5. Sessiz Hata Yutma (Silent Failures)

**Önem:** Orta

Kritik işlemler `.catch((e) => console.warn(...))` ile sessizce geçiliyor. Bu durum monitoring'i zorlaştırır:

```ts
// server/routers.ts
sendNewLeadNotification(...).catch((e) => console.warn("[Email] Failed", e));
createOdooLead(...).catch((e) => console.warn("[Odoo] Failed", e));
createOdooProductFromVendor(...).catch((e) => console.warn("[Odoo] Failed", e));
activateOdooProduct(...).catch((e) => console.warn("[Odoo] Failed", e));

// server/xendit.ts
updateAffiliateCommission(...).catch((e) => console.warn(...));
```

Bu hatalar loglanıyor ama hiçbir alert mekanizması veya dead letter queue yok.

---

## 6. Performans Sorunları

### 6.1 — Resim Yükleme Base64 Overhead
Bakınız §4.1

### 6.2 — In-Memory Cache (Tek Instance)
**Dosya:** `server/odoo.ts`, `server/exchange-rate.ts`
**Önem:** Orta

Döviz kuru ve fiyat cache'i process memory'de tutuluyor (`_cachedRate`, `_productPriceCache`). Birden fazla sunucu instance'ı olduğunda (horizontal scaling) cache tutarsızlaşır. Redis gibi distributed cache kullanılmalı.

---

## 7. Test Kapsamı

**Önem:** Orta

- Frontend sayfaları için hiç unit/integration test yok.
- Çoğu test Odoo/Xendit live servislerine bağımlı ve `console.warn("Not configured, skipping")` ile atlıyor.
- `server/_core/chat.ts` için test yok (AI streaming endpoint).
- `server/routers.ts` prosedürleri için entegrasyon testi yok.

---

## Özet Tablosu

| # | Sorun | Dosya | Önem |
|---|---|---|---|
| 1.1 | CORS / Helmet / Rate Limit eksik | `server/index.ts` | 🔴 Yüksek |
| 1.2 | Dosya yükleme kimlik doğrulama gerektirmiyor, boyut client'tan geliyor | `server/routers.ts:189` | 🔴 Yüksek |
| 1.3 | `dangerouslySetInnerHTML` XSS riski | `BlogDetail.tsx:126` | 🟠 Orta-Yüksek |
| 1.4 | `new Function()` ile kod çalıştırma | `chat.ts:70` | 🟠 Orta |
| 1.5 | Hardcoded admin e-posta adresi | `email.ts:12` | 🟡 Düşük-Orta |
| 1.6 | JWT Secret boş string olabilir | `env.ts:3` | 🔴 Yüksek |
| 2 | Startup'ta env değişkeni doğrulaması yok | `env.ts`, `index.ts` | 🔴 Yüksek |
| 3.1 | `as any` kullanımları | `routers.ts`, `sdk.ts` | 🟡 Düşük |
| 3.2 | Simüle hava durumu aracı kullanıcıyı yanıltıyor | `chat.ts:43` | 🟠 Orta |
| 3.3 | Demo route production'da kaldı | `server/index.ts:62` | 🟡 Düşük |
| 4.1 | Base64 ile resim yükleme verimsiz | `routers.ts:189` | 🟠 Orta |
| 4.2 | `Math.random()` ile dosya isimleri | `routers.ts:207` | 🟡 Düşük |
| 4.3 | Vendor country hardcoded "Indonesia" | `routers.ts:252` | 🟡 Düşük |
| 4.4 | Pagination yok (lead listesi) | `routers.ts:400` | 🟠 Orta |
| 4.5 | SPA fallback hata yönetimi eksik | `server/index.ts:68` | 🟡 Düşük |
| 5 | Kritik hatalar sessizce yutulуyor | `routers.ts`, `xendit.ts` | 🟠 Orta |
| 6.2 | In-memory cache, multi-instance'da tutarsız | `odoo.ts`, `exchange-rate.ts` | 🟠 Orta |
| 7 | Frontend ve API entegrasyon testleri eksik | — | 🟠 Orta |
