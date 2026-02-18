# Odoo Studio - VGR Portal Özelleştirme Kılavuzu

Bu döküman, VGR (Vireon Global Resources) portal görünümünü özelleştirmek için Odoo Studio'da yapılması gereken manuel adımları içerir.

---

## ✅ Tamamlanan Adımlar (API ile)

1. **Project Modülü** - Yüklü ve aktif
2. **PMA Company Formation Projesi** - Oluşturuldu (ID: 1)
3. **Proje Aşamaları** - 4 aşama oluşturuldu:
   - Evrak Kontrolü (ID: 15, sequence: 1)
   - Noter ve Akta (ID: 16, sequence: 2)
   - OSS ve Lisanslar (ID: 17, sequence: 3)
   - Teslimat (ID: 18, sequence: 4)
4. **Örnek Task** - "PMA Setup - John Smith (Villa Rental)" (ID: 3)
5. **Proje Görünürlüğü** - Portal'da görünür (privacy_visibility: portal)
6. **VGR Kullanıcısı** - Aktif ve portal erişimi mevcut (User ID: 6, Partner ID: 15)

---

## 📋 Manuel Yapılması Gereken Adımlar

### 1. Custom Field Ekleme (x_portal_status_percentage)

**Amaç:** Task'lerin tamamlanma yüzdesini portal'da göstermek için custom field eklemek.

**Adımlar:**

1. Odoo'ya admin olarak giriş yap (ozgur@telkonone.com)
2. **Settings → Technical → Database Structure → Models** menüsüne git
3. **project.task** modelini bul ve aç
4. **Fields** sekmesine tıkla
5. **Create** butonuna tıkla
6. Yeni field bilgilerini gir:
   - **Field Name:** `x_portal_status_percentage`
   - **Field Label:** `Portal Status (%)`
   - **Field Type:** `Integer`
   - **Default Value:** `0`
   - **Help:** `Completion percentage visible in portal (0-100)`
7. **Save** butonuna tıkla

**Alternatif (Odoo Studio ile):**

1. **Settings → Customization → Odoo Studio** menüsüne git
2. **Project** uygulamasını seç
3. **Tasks** görünümünü aç
4. Sağ panelden **+ Add** butonuna tıkla
5. **Integer** field tipini seç
6. Field adını `x_portal_status_percentage` olarak gir
7. **Save** butonuna tıkla

---

### 2. Portal Görünümü Özelleştirme

**Amaç:** VGR portal kullanıcılarının task'leri görüntüleyebilmesi için portal görünümünü özelleştirmek.

**Adımlar:**

1. **Settings → Customization → Odoo Studio** menüsüne git
2. **Project** uygulamasını seç
3. Sol menüden **Views** sekmesine tıkla
4. **Portal Templates** bölümünü bul
5. **project.portal_my_tasks** template'ini aç
6. Template içinde `x_portal_status_percentage` field'ını ekle:

```xml
<t t-if="task.x_portal_status_percentage">
    <div class="progress" style="height: 20px;">
        <div class="progress-bar" role="progressbar" 
             t-att-style="'width: %s%%' % task.x_portal_status_percentage"
             t-att-aria-valuenow="task.x_portal_status_percentage"
             aria-valuemin="0" aria-valuemax="100">
            <t t-esc="task.x_portal_status_percentage"/>%
        </div>
    </div>
</t>
```

7. **Save** butonuna tıkla

---

### 3. Belge Yükleme Alanı Ekleme

**Amaç:** Portal kullanıcılarının task'lere belge yükleyebilmesi için alan eklemek.

**Not:** Odoo V19'da **Documents** modülü gereklidir. Eğer yüklü değilse:

1. **Apps** menüsüne git
2. "Documents" ara
3. **Install** butonuna tıkla

**Portal'da Belge Yükleme Aktifleştirme:**

1. **Settings → Customization → Odoo Studio** menüsüne git
2. **Project** uygulamasını seç
3. **Tasks** form görünümünü aç
4. **Documents** sekmesini bul (eğer yoksa **+ Add** ile ekle)
5. **Portal Access** checkbox'ını işaretle
6. **Save** butonuna tıkla

**Alternatif (Manuel Template Düzenleme):**

1. **Settings → Technical → User Interface → Views** menüsüne git
2. **project.portal_my_task** view'ını bul ve aç
3. Template içinde belge yükleme formu ekle:

```xml
<form string="Upload Document" class="o_portal_chatter_composer">
    <field name="attachment_ids" widget="many2many_binary" string="Attach Files"/>
    <button string="Upload" type="object" name="message_post" class="btn btn-primary"/>
</form>
```

4. **Save** butonuna tıkla

---

### 4. Portal Menü Özelleştirme

**Amaç:** VGR portal kullanıcılarının sadece ilgili menüleri görmesini sağlamak.

**Adımlar:**

1. **Settings → Users & Companies → Portal Users** menüsüne git
2. **Vireon Global Resources** (User ID: 6) kullanıcısını aç
3. **Portal Access Rights** sekmesine tıkla
4. Şu modülleri aktif et:
   - ☑ **Project** (Tasks görüntüleme)
   - ☑ **Documents** (Belge yükleme/indirme)
   - ☐ **Invoices** (Fatura görüntüleme - isteğe bağlı)
5. **Save** butonuna tıkla

**Portal Menü Sırasını Düzenleme:**

1. **Settings → Technical → User Interface → Menu Items** menüsüne git
2. **Portal** parent menüsünü bul
3. Alt menüleri sürükle-bırak ile sırala:
   - My Business Status (1)
   - Documents (2)
   - Invoices (3)
   - Yield Tracker (4)
4. **Save** butonuna tıkla

---

### 5. Task Stage Renklendirme

**Amaç:** Portal'da task aşamalarını renklerle ayırt etmek.

**Adımlar:**

1. **Project → Configuration → Stages** menüsüne git
2. Her aşama için renk seç:
   - **Evrak Kontrolü** → Mavi (#3498db)
   - **Noter ve Akta** → Turuncu (#f39c12)
   - **OSS ve Lisanslar** → Mor (#9b59b6)
   - **Teslimat** → Yeşil (#27ae60)
3. **Save** butonuna tıkla

---

### 6. Portal Dashboard Widget Ekleme

**Amaç:** VGR portal ana sayfasına task özeti widget'ı eklemek.

**Adımlar:**

1. **Settings → Customization → Odoo Studio** menüsüne git
2. **Portal** uygulamasını seç
3. **Dashboard** görünümünü aç
4. **+ Add Widget** butonuna tıkla
5. **Task Summary** widget'ını seç
6. Widget ayarlarını yapılandır:
   - **Title:** "Görevleriniz"
   - **Filter:** `[('partner_id', '=', user.partner_id.id)]`
   - **Group By:** `stage_id`
7. **Save** butonuna tıkla

---

## 🧪 Test Adımları

1. **VGR Kullanıcısı ile Giriş Yap:**
   - URL: https://pt-telkon-one-group.odoo.com/web/login
   - Email: ozgurkonukcu@gmail.com
   - Password: 123456

2. **Portal'da Task'leri Kontrol Et:**
   - Ana sayfada "Görevleriniz" widget'ını gör
   - **My Tasks** menüsüne tıkla
   - "PMA Setup - John Smith (Villa Rental)" task'ini gör
   - Task detaylarını aç
   - Progress bar'ı gör (x_portal_status_percentage)
   - Belge yükleme alanını gör

3. **Task Güncelleme Testi:**
   - Admin olarak giriş yap
   - Task'i aç (ID: 3)
   - `x_portal_status_percentage` field'ını 50 olarak güncelle
   - VGR kullanıcısı ile portal'a gir
   - Progress bar'ın %50 gösterdiğini doğrula

---

## 📝 Notlar

- **Odoo Studio** lisansı gereklidir (Enterprise sürüm)
- **Documents** modülü belge yükleme için gereklidir
- Portal görünümü değişiklikleri cache temizleme gerektirebilir: **Settings → Technical → Database Structure → Clear Cache**
- Custom field'lar `x_` prefix'i ile başlamalıdır (Odoo standartı)

---

## 🔗 İlgili Dökümanlar

- [Odoo V19 Studio Documentation](https://www.odoo.com/documentation/19.0/applications/studio.html)
- [Odoo V19 Portal Customization](https://www.odoo.com/documentation/19.0/developer/reference/frontend/portal.html)
- [Odoo V19 Project Module](https://www.odoo.com/documentation/19.0/applications/services/project.html)

---

**Son Güncelleme:** 2026-02-16  
**Hazırlayan:** Manus AI Agent  
**Proje:** BaseOne Bali - VGR Portal Configuration
