# Railway Deployment Fix - BaseOne Bali

## Sorun
- Kullanıcılar giriş yapabiliyor ama session payload eksik alanlar nedeniyle admin paneline erişemiyor
- `[Auth] Session payload missing required fields` hatası

## Çözüm

### 1. Kod Değişiklikleri (✅ YAPILDI)

**Düzeltilen dosyalar:**
- `server/routers/auth.ts` - Session token oluştururken fazla field gönderilmesi düzeltildi
- `server/_core/env.ts` - Railway environment variable isimleriyle uyumlu hale getirildi
- `drizzle.config.ts` - MYSQL_URL fallback eklendi

### 2. Railway'de Eklenecek Environment Variables

Aşağıdaki değişkeni Railway'e **mutlaka ekleyin:**

```bash
OWNER_OPEN_ID=email_[UUID]
```

**OWNER_OPEN_ID nasıl bulunur:**

Railway veritabanınıza bağlanın ve şu SQL'i çalıştırın:

```sql
SELECT id, openId, email, role FROM users ORDER BY createdAt ASC LIMIT 1;
```

Dönen `openId` değerini kopyalayıp Railway'de `OWNER_OPEN_ID` olarak ayarlayın.

**Alternatif: Manuel olarak admin yapın**

Railway MySQL veritabanında:

```sql
UPDATE users SET role = 'admin' WHERE email = 'sizin@email.com';
```

### 3. Mevcut Environment Variables Kontrolü

Railway'de şunlar **mevcut** (✅ doğrulandı):
- `DATABASE_URL` veya `MYSQL_URL` ✅
- `JWT_SECRET` ✅
- `SESSION_SECRET` ✅
- `CLOUDFLARE_TURNSTILE_SECRET_KEY` ✅
- `ODOO_URL` ✅
- `ODOO_DB` ✅
- `ODOO_USERNAME` ✅
- `ODOO_PASSWORD` ✅
- `APP_URL` ✅
- `BASE_URL` ✅

### 4. Deploy Sonrası Test

1. Railway'de redeploy yapın
2. Kullanıcı girişi yapın: `https://baseoneglobal.com`
3. Admin paneline gidin: `https://baseoneglobal.com/admin`
4. Kullanıcılar listeleniyorsa ✅ çalışıyor

### 5. Debug için Log Kontrolü

Railway logs'da şunları kontrol edin:

```bash
# ✅ Başarılı giriş:
[Auth] Session created successfully

# ❌ Hala sorun varsa:
[Auth] Session payload missing required fields
```

Eğer hala sorun varsa:
- `appId` değerinin boş olmadığını kontrol edin (default: "baseone-bali")
- Database bağlantısını kontrol edin
- Cookie'nin browser'da set edildiğini kontrol edin (DevTools → Application → Cookies)

## Değişiklik Özeti

### `server/routers/auth.ts`
**ÖNCEKİ (Hatalı):**
```typescript
const sessionToken = await sdk.createSessionToken(user.openId, {
  name: user.name || "Investor",
  email: user.email,        // ❌ Bu field desteklenmiyor
  role: user.role || "user", // ❌ Bu field desteklenmiyor
  expiresInMs: ONE_YEAR_MS,
});
```

**SONRAKİ (Düzeltilmiş):**
```typescript
const sessionToken = await sdk.createSessionToken(user.openId, {
  name: user.name || "Investor",
  expiresInMs: ONE_YEAR_MS,
});
```

### `server/_core/env.ts`
Railway environment variable isimleri için fallback eklendi:
- `APP_ID` fallback for `VITE_APP_ID`
- `SESSION_SECRET` fallback for `JWT_SECRET`
- `BASE_URL` / `APP_URL` fallback for `SITE_URL`
- `MYSQL_URL` fallback for `DATABASE_URL`
- `CLOUDFLARE_TURNSTILE_SECRET_KEY` fallback for `TURNSTILE_SECRET_KEY`

## Sonuç

Bu değişiklikler sonrası:
1. ✅ Kullanıcılar başarıyla giriş yapabilecek
2. ✅ Session cookie doğru oluşacak
3. ✅ Admin paneli erişilebilir olacak (OWNER_OPEN_ID set edildikten sonra)
4. ✅ Kullanıcılar admin panelde görünecek
