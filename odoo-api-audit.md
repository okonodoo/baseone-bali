# Odoo API Audit — `server/odoo.ts`

## 1. JSON-RPC Versiyonu

**Kullanılan versiyon: JSON-RPC 2.0** (satır 32)

Ana `odooJsonRpc()` fonksiyonu `"2.0"` ile sabit kodlanmış:

```typescript
// server/odoo.ts:28-47
async function odooJsonRpc(url: string, method: string, params: unknown) {
  const response = await axios.post(url, {
    jsonrpc: "2.0",   // ✅ 2.0
    method: "call",   // Odoo JSON-RPC standardı
    id: Date.now(),   // her istekte yeni ID
    params,
  }, ...);
}
```

### Endpoint'ler

| Fonksiyon | Endpoint | Protokol |
|---|---|---|
| `authenticate()`, `executeKw()` | `${ODOO_URL}/jsonrpc` | JSON-RPC 2.0 (axios) |
| `activatePortalAccess()` | `${ODOO_URL}/json/2/res.users/action_grant_portal_access` | Odoo 17+ REST-style (fetch) |

> ⚠️ **İki farklı API katmanı paralel kullanılıyor.** `activatePortalAccess()` Odoo 17+'nın yeni `/json/2/` REST endpoint'ini kullanıyor; diğer tüm fonksiyonlar klasik `/jsonrpc` yolunu kullanıyor. Ayrıca `activatePortalAccess()` içinde `jsonrpc: '2.0'` ve `method: 'call'` gönderiliyor (satır 963-965), ancak `/json/2/` endpoint'i bu alanları yok sayar — sadece Bearer token + params body bekler. Bu field'lar gereksiz ama zararsız.

---

## 2. API Çağrı Örnekleri

### 2.1 `authenticate()` — Satır 49-60

```typescript
const uid = await odooJsonRpc(`${config.url}/jsonrpc`, "call", {
  service: "common",
  method: "authenticate",
  args: [config.db, config.username, config.password, {}],
});
```

**JSON-RPC body:**
```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "id": 1740123456789,
  "params": {
    "service": "common",
    "method": "authenticate",
    "args": ["mydb", "admin@example.com", "secret", {}]
  }
}
```

Başarılı olursa Odoo bir tam sayı `uid` döndürür. `uid` sayı değilse hata fırlatılır (satır 56-58).

---

### 2.2 `create()` — İki Farklı Format Kullanılıyor (Tutarsızlık!)

Dosyada `create` çağrıları **iki farklı** argüman formatında yapılıyor:

#### Format A — Tekil `vals` dict (satırlar 294, 549, 643, 757, 769)

```typescript
// satır 549
const leadId = await executeKw(config, uid, "crm.lead", "create", [leadValues]);
// satır 757
const orderId = await executeKw(config, uid, "sale.order", "create", [{
  partner_id: partnerResult.partnerId,
  order_line: [[0, 0, { product_id: productId, ... }]],
}]);
```

→ `execute_kw` çağrısında: `args = [vals]`

Odoo RPC katmanı: `crm.lead.create(vals)` — tekil dict, standart format.

#### Format B — `vals` liste içinde (satırlar 608, 891)

```typescript
// satır 608
const result = await executeKw(config, uid, "res.partner", "create", [[values]]);
// satır 891
const result = await executeKw(config, uid, "product.template", "create", [[vals]]);
```

→ `execute_kw` çağrısında: `args = [[vals]]`

Odoo RPC katmanı: `res.partner.create([vals])` — vals_list formatı. Odoo 14+'da `create()` hem `dict` hem `list[dict]` kabul eder; bu da çalışır ama tutarsız.

#### Özet

| Satır | Model | Format | Durum |
|---|---|---|---|
| 294 | `sale.order` | `[dict]` (Format A) | ✅ Standart |
| 549 | `crm.lead` | `[dict]` (Format A) | ✅ Standart |
| 608 | `res.partner` | `[[dict]]` (Format B) | ⚠️ Çalışır ama tutarsız |
| 643 | `product.template` | `[dict]` (Format A) | ✅ Standart |
| 757 | `sale.order` | `[dict]` (Format A) | ✅ Standart |
| 891 | `product.template` | `[[dict]]` (Format B) | ⚠️ Çalışır ama tutarsız |

> **Öneri:** Tüm `create()` çağrılarını Format A'ya (`[vals]`) standardize edin.

---

### 2.3 `write()` — Tutarlı Format

Tüm `write()` çağrıları `[[ids], values]` formatında yapılıyor:

```typescript
// satır 212
await executeKw(config, uid, model, 'write', [[recordId], { x_referred_by: affiliateCode }]);

// satır 260
await executeKw(config, uid, 'crm.lead', 'write', [[leadId], { stage_id: stages[0] }]);

// satır 603
await executeKw(config, uid, "res.partner", "write", [[partnerId], values]);

// satır 834
await executeKw(config, uid, "res.partner", "write", [[partnerId], { x_membership_level: level }]);

// satır 911
await executeKw(config, uid, "product.template", "write", [[productId], { active: true }]);
```

→ `execute_kw` çağrısında: `args = [[id1, id2, ...], {field: value}]`

`write()` **tamamen tutarlı**. ✅

---

## 3. JSON-RPC Request Body Formatı

### 3.1 Ana `odooJsonRpc()` — Tüm Standart Çağrılar

```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "id": 1740123456789,
  "params": {
    "service": "object",
    "method": "execute_kw",
    "args": [
      "mydb",
      42,
      "secret",
      "crm.lead",
      "create",
      [{ "name": "...", "email_from": "..." }],
      {}
    ]
  }
}
```

**Alanlar:**

| Alan | Değer | Açıklama |
|---|---|---|
| `jsonrpc` | `"2.0"` | Sabit |
| `method` | `"call"` | Odoo her zaman "call" bekler |
| `id` | `Date.now()` | Milisaniye timestamp, her istekte farklı |
| `params.service` | `"common"` / `"object"` | `common` = auth; `object` = model işlemleri |
| `params.method` | `"authenticate"` / `"execute_kw"` | İşlem türü |
| `params.args` | dizi | Değişken; model, method, args, kwargs içerir |

### 3.2 `activatePortalAccess()` — Odoo 17+ REST Endpoint

```json
POST /json/2/res.users/action_grant_portal_access
Authorization: Bearer <ODOO_API_KEY>

{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "ids": [123]
  }
}
```

> ⚠️ `/json/2/` endpoint'i `jsonrpc` ve `method` alanlarını dikkate almaz. Sadece `params` + Bearer token yeterli. Bu alanlar gereksiz ama hata vermez.

---

## 4. Bulgu Özeti

| # | Bulgu | Satır | Önem |
|---|---|---|---|
| A | İki API katmanı paralel (JSON-RPC `/jsonrpc` + REST `/json/2/`) | 957 | 🟡 Düşük |
| B | `activatePortalAccess()`'te gereksiz `jsonrpc`/`method` field'ları | 963-965 | 🟡 Düşük |
| C | `create()` tutarsız formatlar: Format A (`[vals]`) vs Format B (`[[vals]]`) | 608, 891 | 🟠 Orta |
| D | `write()` tutarlı — sorun yok | — | ✅ |
| E | `jsonrpc: "2.0"` her yerde doğru | — | ✅ |
| F | `method: "call"` her yerde doğru | — | ✅ |

---

## 5. Öneriler

1. **`create()` çağrılarını standardize edin:**
   ```typescript
   // ❌ Tutarsız (satır 608, 891)
   await executeKw(config, uid, "res.partner", "create", [[values]]);

   // ✅ Standart
   await executeKw(config, uid, "res.partner", "create", [values]);
   ```

2. **`activatePortalAccess()` içindeki gereksiz JSON-RPC field'larını kaldırın:**
   ```typescript
   // ❌ Mevcut
   body: JSON.stringify({
     jsonrpc: '2.0',
     method: 'call',
     params: { ids: [parseInt(String(userId))] }
   })

   // ✅ /json/2/ için yeterli
   body: JSON.stringify({
     params: { ids: [parseInt(String(userId))] }
   })
   ```

3. **API katmanlarını belgeleyin:** Hangi fonksiyonların eski `/jsonrpc` path'ini, hangilerinin yeni `/json/2/` path'ini kullandığını JSDoc ile belirtin.
