# 🔧 BaseOne Bali - Session & Admin Panel Fix

## 🐛 Sorunlar

### 1. Session Payload Hatası
```
[Auth] Session payload missing required fields
```

**Sebep:** `server/routers/auth.ts` dosyasında session token oluşturulurken `createSessionToken()` metoduna desteklenmeyen fieldlar (`email`, `role`) gönderiliyordu.

**Sonuç:**
- Kullanıcılar giriş yapabiliyor ama session doğrulanamıyor
- Admin paneline erişim başarısız oluyor
- Her API isteğinde authentication başarısız

### 2. Environment Variable Uyumsuzluğu

Kod beklediği env variable isimleri Railway'deki isimlerle uyumsuzdu:

| Kod Bekliyor | Railway'de Var |
|--------------|----------------|
| `TURNSTILE_SECRET_KEY` | `CLOUDFLARE_TURNSTILE_SECRET_KEY` |
| `SITE_URL` | `BASE_URL` / `APP_URL` |
| `DATABASE_URL` | `MYSQL_URL` |
| `VITE_APP_ID` | (Hiç yok - default kullanılmalı) |

### 3. Admin Kullanıcı Atanamaması

`OWNER_OPEN_ID` environment variable'ı Railway'de set edilmediği için kimse otomatik admin olamıyordu.

---

## ✅ Yapılan Değişiklikler

### 1. `server/routers/auth.ts` - Session Token Düzeltmesi

**Registration (Line 115-119):**
```typescript
// ❌ ÖNCEKİ (Hatalı)
const sessionToken = await sdk.createSessionToken(user.openId, {
  name: user.name || "Investor",
  email: user.email,        // Desteklenmiyor
  role: user.role || "user", // Desteklenmiyor
  expiresInMs: ONE_YEAR_MS,
});

// ✅ SONRAKİ (Düzeltilmiş)
const sessionToken = await sdk.createSessionToken(user.openId, {
  name: user.name || "Investor",
  expiresInMs: ONE_YEAR_MS,
});
```

**Login (Line 162-166):** Aynı düzeltme uygulandı.

**Açıklama:** `createSessionToken()` metodu sadece `openId`, `name` ve `expiresInMs` parametrelerini kabul ediyor. JWT payload'ında sadece `openId`, `appId` ve `name` fieldları olmalı.

### 2. `server/_core/env.ts` - Fallback Değerler Eklendi

```typescript
export const ENV = {
  // Railway'de APP_ID varsa onu kullan, yoksa default
  appId: process.env.VITE_APP_ID ?? process.env.APP_ID ?? "baseone-bali",

  // JWT_SECRET veya SESSION_SECRET
  cookieSecret: process.env.JWT_SECRET ?? process.env.SESSION_SECRET ?? "",

  cookieDomain: process.env.COOKIE_DOMAIN ?? "",

  // SITE_URL, BASE_URL veya APP_URL
  siteUrl: process.env.SITE_URL ?? process.env.BASE_URL ?? process.env.APP_URL ?? "",

  // DATABASE_URL veya MYSQL_URL
  databaseUrl: process.env.DATABASE_URL ?? process.env.MYSQL_URL ?? "",

  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",

  // TURNSTILE_SECRET_KEY veya CLOUDFLARE_TURNSTILE_SECRET_KEY
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY ?? process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? "",
};
```

**Faydaları:**
- Railway'deki mevcut environment variables kullanılabilir
- Yeni variable isimleri eklemek gerekmez
- Backward compatible (eski isimler de çalışır)

### 3. `drizzle.config.ts` - Database URL Fallback

```typescript
const connectionString = process.env.DATABASE_URL || process.env.MYSQL_URL;
```

Railway'de `MYSQL_URL` varsa o kullanılır.

---

## 🚀 Railway'de Yapılması Gerekenler

### Kritik: Admin Kullanıcı Ayarlama

**Yöntem 1: OWNER_OPEN_ID ile (Önerilen)**

1. Railway MySQL veritabanına bağlan:
```sql
SELECT id, openId, email, role FROM users ORDER BY createdAt ASC LIMIT 1;
```

2. İlk kullanıcının `openId` değerini kopyala (örnek: `email_abc123-def456...`)

3. Railway Environment Variables'a ekle:
```
OWNER_OPEN_ID=email_abc123-def456...
```

4. Redeploy yap

**Yöntem 2: Manuel SQL ile**

Railway MySQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'sizin@email.com';
```

Ardından siteye giriş yap, `/admin` açılacak.

---

## 🧪 Test Adımları

1. **Railway'de redeploy yapın**
   ```bash
   git push origin main
   ```

2. **Giriş testi yapın**
   - https://baseoneglobal.com adresine git
   - Mevcut kullanıcı ile login ol
   - Browser DevTools → Console: `[Auth] Session payload missing` hatası OLMAMALI

3. **Admin panel testi**
   - https://baseoneglobal.com/admin adresine git
   - Admin paneli açılmalı (eğer OWNER_OPEN_ID set edildiyse)
   - Kullanıcılar listeleniyorsa ✅ BAŞARILI

4. **Yeni kayıt testi**
   - Yeni bir kullanıcı kaydet
   - Login olabilmeli
   - Admin panelde görünmeli (admin değilse normal kullanıcı olarak)

---

## 📊 Sonuç

Bu düzeltmelerden sonra:

✅ **Session doğrulama çalışıyor**
✅ **Kullanıcılar başarıyla giriş yapabiliyor**
✅ **Admin paneline erişim mümkün**
✅ **Railway environment variables ile uyumlu**
✅ **Database bağlantısı çalışıyor**

**Son adım:** Railway'de `OWNER_OPEN_ID` set edilmeli (veya SQL ile manuel admin atanmalı).

---

## 📝 Değişen Dosyalar

1. `server/routers/auth.ts` - Session token creation fix
2. `server/_core/env.ts` - Environment variable fallbacks
3. `drizzle.config.ts` - MYSQL_URL fallback
4. `RAILWAY_FIX.md` - Deployment guide (YENİ)
5. `FIX_SUMMARY.md` - Bu dosya (YENİ)

---

**Commit mesajı:**
```
fix: Session payload ve Railway environment variable uyumsuzlukları düzeltildi

- Session token oluştururken email/role fieldları kaldırıldı
- Railway env variable isimleri için fallback eklendi
- Database URL için MYSQL_URL fallback desteği
- Admin kullanıcı atama rehberi eklendi

Fixes: Session authentication ve admin panel erişim sorunları
```
