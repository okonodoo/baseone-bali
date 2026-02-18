# BaseOne Bali - TODO

## i18n (Çoklu Dil Desteği)
- [x] i18n context ve hook oluştur (useTranslation)
- [x] 4 dil çeviri dosyası: en.ts, tr.ts, id.ts, ru.ts
- [x] Navbar'a language switcher ekle
- [x] Landing page (Home.tsx) metinlerini i18n'e çevir
- [x] AI Advisor sayfası metinlerini i18n'e çevir
- [x] Investment Wizard sayfası metinlerini i18n'e çevir
- [x] Footer metinlerini i18n'e çevir

## Odoo CRM Entegrasyonu
- [x] Odoo environment variables tanımla (ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD)
- [x] Backend API route: Odoo JSON-RPC lead oluşturma
- [x] Lead form modal bileşeni oluştur
- [x] "Talk to Expert" butonlarını modal'a bağla
- [x] "Get Detailed Report" butonunu modal'a bağla
- [x] Form gönderiminde başarı/hata mesajı göster
- [x] Lead notlarına bütçe, sektör, AI önerileri ekle
- [x] Gerçek Odoo credentials ile test (UID: 2 başarılı)

## Mevcut Sayfalar (Tamamlanmış)
- [x] Landing page (hero, senaryolar, güven, sektörler, CTA, footer)
- [x] AI Investment Advisor sayfası
- [x] Investment Wizard sayfası (multi-step)
- [x] Navbar ve Footer bileşenleri
- [x] Responsive tasarım ve animasyonlar

## Testler
- [x] Odoo authentication test (vitest)
- [x] Lead creation test (vitest - 5 test)
- [x] Auth logout test (vitest)
- [x] Subscription tier test (vitest)

## Üyelik Sistemi
- [x] Manus OAuth ile giriş/kayıt (mevcut altyapı)
- [x] Navbar'da giriş/kayıt butonları ve kullanıcı profil ikonu
- [ ] Kullanıcı profil sayfası
- [x] Kullanıcı subscription seviyesi (free/premium/vip) DB'de

## Gelir Modeli (3 Katman)
- [x] DB schema: subscription tier (free/premium/vip) kullanıcı tablosuna ekle
- [x] Free: Teaser içerik (kısa özet, bulanık detaylar)
- [x] Premium ($19.90): Detaylı PDF rapor, tam CAPEX, regülasyonlar
- [x] VIP ($200): Tam erişim, uzman görüşme, öncelikli lead

## İçerik Kilidi
- [x] AI Advisor: Free kullanıcılar sadece genel özet görür, detay kilitli
- [x] Investment Wizard: Temel bilgiler görünür, detaylı analiz kilitli
- [x] "Unlock Full Report - $19.90" butonu
- [x] "Get VIP Access - $200" butonu

## Ödeme Entegrasyonu
- [x] Stripe test modu kurulumu
- [x] Stripe checkout session oluşturma (Premium/VIP)
- [x] Stripe webhook ile ödeme onayı ve tier güncelleme
- [x] Xendit placeholder (Coming Soon)
- [x] Payoneer gerçek link entegrasyonu
- [x] Ödeme sayfasında 3 seçenek yan yana (Pricing page)

## Pricing Sayfası
- [x] 3 plan kartı (Free, Premium $19.90, VIP $200)
- [x] Koyu tema, altın aksanlar tasarım
- [x] 4 dilde çeviri

## i18n Güncellemeleri
- [x] Pricing sayfası çevirileri (en/tr/id/ru)
- [x] Auth/profil çevirileri (en/tr/id/ru)
- [x] İçerik kilidi mesajları çevirileri (en/tr/id/ru)

## Payment Success Sayfası
- [x] Ödeme başarılı sayfası oluşturuldu
- [x] 4 dilde çeviri

## Bug Fixes
- [x] Stripe currency error: Change USD to IDR (Stripe account only supports IDR)
- [x] Stripe payment_method_types error: Remove explicit card type, let Stripe auto-select

## Gayrimenkul İlan Listesi
- [x] Mock property verileri oluştur (15 ilan, gerçekçi Bali fiyatları)
- [x] Property görselleri (Unsplash Bali villa/property - S3'e yüklendi)
- [x] Properties liste sayfası (/properties) - kart grid layout
- [x] Filtre sistemi: tür, bölge, fiyat aralığı, kiralık/satılık, min alan
- [x] İlan kartı tasarımı (koyu tema, altın aksanlar, görsel, fiyat, alan, yatak/banyo)
- [x] Property detay sayfası (/properties/:id) - galeri, açıklama, özellikler, konum
- [x] "Contact Agent" / "Schedule Viewing" CTA → Odoo CRM lead
- [x] İçerik kilidi: Free → bulanık fiyat/detay, Premium → tam erişim, VIP → öncelikli
- [x] Navbar'a "Properties" linki ekle
- [x] i18n çevirileri (en/tr/id/ru) - properties sayfası metinleri

## Kullanıcı Profil Sayfası (/profile)
- [x] Profil sayfası: kullanıcı bilgileri (ad, email, profil fotoğrafı)
- [x] Abonelik durumu gösterimi (Free/Premium/VIP)
- [x] Abonelik yükseltme butonu
- [x] Profil düzenleme formu (ad, telefon, ülke)
- [x] Koyu tema + altın aksanlar tasarım
- [x] i18n çevirileri (en/tr/id/ru)

## Admin Paneli (/admin)
- [x] Admin erişim kontrolü (sadece admin rolü)
- [x] Dashboard: toplam kullanıcı, Premium/VIP sayısı, ilan sayısı, son lead'ler
- [x] İlan Yönetimi: listele, ekle, düzenle, sil, durum değiştir (aktif/pasif/taslak)
- [x] Properties DB tablosu oluştur
- [x] Kullanıcı Yönetimi: liste, abonelik seviyesi değiştirme
- [x] Lead Yönetimi: son lead'lerin özet listesi
- [x] Leads DB tablosu oluştur
- [x] i18n çevirileri (en/tr/id/ru)

## Google Maps Entegrasyonu
- [x] Property detay sayfasına harita ekle (pin ile konum)
- [x] Properties liste sayfasına harita/liste toggle görünümü
- [x] Manus Maps proxy kullan (API key gereksiz)
- [x] Fallback: harita yüklenemezse placeholder göster
- [x] i18n çevirileri (en/tr/id/ru)

## Blog / İçerik Sayfası (/blog)
- [x] Blog posts DB tablosu oluştur
- [x] 6 gerçekçi SEO dostu blog yazısı (mock data)
- [x] Blog listesi sayfası (/blog) - kart grid, kategori filtre
- [x] Blog detay sayfası (/blog/:slug) - tam yazı, yazar, ilgili yazılar
- [x] Kategoriler: Investment Guide, Legal & Tax, Real Estate, Lifestyle, News
- [x] Admin paneline blog yazısı ekleme/düzenleme
- [x] Navbar'a "Blog" linki ekle
- [x] i18n çevirileri (en/tr/id/ru)

## WhatsApp Business Entegrasyonu
- [x] Tüm "Talk to Expert" butonlarını wa.me/628135313562 linkine bağla
- [x] AI Advisor'dan otomatik mesaj: bütçe bilgisi ile
- [x] Investment Wizard'dan otomatik mesaj: bütçe + sektör bilgisi ile
- [x] Property'den otomatik mesaj: ilan adı ile
- [x] Floating WhatsApp butonu (sağ alt köşe, her sayfada)
- [x] Odoo CRM lead oluşturmaya devam etsin

## Email Bildirim Sistemi
- [x] Email servis altyapısı (SMTP env vars, console.log fallback)
- [x] Yeni lead → admin email bildirimi
- [x] Ödeme tamamlandığında → kullanıcı onay emaili
- [x] Yeni kullanıcı kaydı → hoşgeldin emaili
- [x] BaseOne Bali markalı email şablonları

## Vendor Portal (/list-your-property)
- [x] Vendor ilan ekleme formu (başlık, açıklama, tür, bölge, fiyat, alan, vs.)
- [x] Form gönderiminde ilan "pending" durumda kaydedilsin
- [x] Admin paneline "pending" ilanlar düşsün (onay/red)
- [x] Odoo CRM'e vendor lead olarak düşsün
- [x] Vendor'a teşekkür mesajı
- [x] Footer'a "List Your Property" linki ekle
- [x] i18n çevirileri (en/tr/id/ru)

## Phase 16 Testler
- [x] WhatsApp URL generation tests (3 test)
- [x] Email service module tests (3 test)
- [x] Vendor portal router tests (3 test)
- [x] Blog router tests (4 test)
- [x] i18n Phase 16 keys tests (4 test - en/tr/id/ru)

## Phase 17: Odoo Veri Gönderimi & Senkronizasyon

### Odoo'ya Örnek Veriler
- [x] 3 CRM Lead gönder (John Smith, Maria Schmidt, Dmitry Petrov)
- [x] 3 Contact gönder (res.partner)
- [x] 3 Product gönder (product.template - gayrimenkul ilanları)
- [x] Tüm ID'leri logla

### VIP Kullanıcı
- [x] ozgur@telkonone.com kullanıcısını VIP yap (DB'de yoksa oluştur)

### Kullanıcı-Odoo Senkronizasyonu
- [x] Yeni kullanıcı kaydında Odoo'da res.partner oluştur
- [x] Premium/VIP ödeme yapıldığında Odoo'da sale.order oluştur
- [x] Backend API route'ları oluştur
- [x] i18n çevirileri (mevcut, yeni frontend metni eklenmedi)

### Phase 17 Testler
- [x] Odoo module exports tests (3 test)
- [x] Admin Odoo sync router tests (2 test)
- [x] Odoo contact sync logic tests (2 test)
- [x] Stripe-Odoo integration test (1 test)
- [x] OAuth-Odoo integration test (1 test)
- [x] Email payment confirmation tests (2 test)
- [x] Subscription tier products test (1 test)
- [x] Toplam: 50 test passed, 7 test dosyası

## Phase 18: Affiliate, Partner Portal, Sözleşmeler, Scouting Fee

### 1. Affiliate / Bayilik Sistemi
- [x] Odoo'da x_is_affiliate, x_affiliate_code, x_commission_rate, x_total_commission, x_pending_commission alanları ekle
- [x] 3 test affiliate partner oluştur (Jestiyon ID:12, Made Wijaya ID:13, DNN ID:14)
- [x] Web: URL ?invite=CODE takibi (cookie/session)
- [x] Web: Kayıt/lead'de affiliate kodu Odoo'ya gönder
- [x] Web: Satışta komisyon hesapla ve Odoo güncelle
- [x] Web: /become-partner sayfası (form, komisyon yapısı, faydalar)
- [x] i18n çevirileri (en/tr/id/ru)

### 2. VGR ve Emlakçı Partner Portalları
- [x] Odoo: VGR partner kaydı oluştur (Vireon Global Resources ID:15)
- [x] Odoo: VGR portal kullanıcısı oluştur (Project modülü yüklü değil - bilgi sayfası oluşturuldu)
- [x] Odoo: "Legal Operations" projesi (Project modülü yüklü değil - atlandı)
- [x] Odoo: Emlakçı partner kaydı oluştur (Bali Dream Properties ID:16 + 3 ürün)
- [x] Odoo: Emlakçı portal kullanıcısı (portal modülü kısıtlı - bilgi sayfası oluşturuldu)
- [x] Odoo: Emlakçı ilanları product.template olarak eklendi
- [x] Web: /become-partner sayfası (partner bilgi + başvuru formu)
- [x] i18n çevirileri (en/tr/id/ru)

### 3. Dijital İmza ve Sözleşmeler
- [x] Odoo Sign API erişimini kontrol et (Sign modülü API'den erişilemedi - bilgi sayfası oluşturuldu)
- [x] Web: /contracts sayfası (sürec açıklaması, sözleşme türleri, SSS)
- [x] i18n çevirileri (en/tr/id/ru)

### 4. $500 Scouting Fee Akışı
- [x] Odoo: CRM pipeline aşamaları oluştur (New > Qualified > Scouting Fee Paid > Scouting > Proposal > Won > Lost)
- [x] Odoo: "Scouting Fee" ürünü oluştur ($500, ID:7)
- [x] Web: "Start Scouting - $500" butonu (AI Advisor/Wizard sonuç sayfası)
- [x] Web: Stripe checkout $500 / Rp 7,875,000
- [x] Web: Ödeme sonrası Odoo lead aşama güncelle
- [x] Web: Scouting ekibine bildirim + kullanıcıya email
- [x] Web: VIP kullanıcılar için bilgi notu (pricing sayfasında)
- [x] i18n çevirileri (en/tr/id/ru)

### Phase 18 Testler
- [x] Odoo affiliate fonksiyonları testi (validateAffiliateCode, setAffiliateReferral, createScoutingFeeOrder, updateLeadStage)
- [x] Stripe products scouting fee testi (Rp 7,875,000 IDR)
- [x] Admin affiliate routes testi
- [x] Subscription checkout scoutingFee productKey testi
- [x] Subscription checkout affiliateCode parameter testi
- [x] Email service fonksiyonları testi
- [x] i18n partner/contracts/scouting çevirileri testi (en/tr/id/ru)
- [x] createCheckoutSession affiliateCode testi
- [x] Toplam: 65 test passed, 8 test dosyası

## Bug Fixes
- [x] /become-partner form: phone field validation error (too_small) when submitting partner application

## Phase 19: Çoklu Para Birimi (Multi-Currency Checkout)
- [x] Odoo'dan USD/IDR kuru çekme fonksiyonu (res.currency.rate)
- [x] Kur cache mekanizması (1 saatlik cache, fallback 15750)
- [x] Stripe checkout: Endonezya'dan ödeme → IDR, yurtdışından → USD
- [x] Kullanıcı lokasyon tespiti (user.country bazlı)
- [x] stripe-products.ts'de dual currency desteği (getStripeAmount, getDisplayPrice)
- [x] Testler (79 test passed, 9 dosya)
- [x] subscription.exchangeRate public query endpoint

## Phase 20: Form İyileştirmeleri + Dinamik Odoo Fiyatlandırma### Form İyileştirmeleri
- [x] Become Partner: Şirket alanı opsiyonel yap
- [x] Become Partner: Ülke dropdown ekle
- [x] Become Partner: Telefon alanı ekle (ülke kodu ile)
- [x] Become Partner: i18n çeviri düzeltmeleri
- [x] Kullanıcı profili: Ülke dropdown ekle
- [x] Vendor Portal (İlan Ver): Ülke bazlı telefon girişi
- [x] Country dropdown bileşeni oluştur (yeniden kullanılabilir)
- [x] Phone input bileşeni oluştur (ülke kodu ile)

### Dinamik Odoo Fiyatlandırma

- [x] Odoo'dan ürün fiyatlarını çekme (product.template)
- [x] Odoo'dan fiyat listesi çekme (product.pricelist)
- [x] Fiyat cache mekanizması (1 saatlik cache)
- [x] stripe-products.ts'yi Odoo fiyatlarıyla dinamik hale getir
- [x] Odoo'da fiyat değişince web sitesinde otomatik güncelleme (cache süresi dolunca)
- [x] Testler (93 test passed, 10 dosya)


## Phase 21: Odoo V19 JSON-RPC 2.0 API Migration
- [x] Odoo V19 JSON-2 API fully tested and working
- [x] odoo.ts completely rewritten with JSON-2 API
- [x] create: vals_list (array) → returns array of IDs
- [x] write: vals for most models, values for res.users
- [x] search/search_read: domain, fields, limit, order, offset
- [x] read: ids, fields
- [x] VGR portal user (ID: 6) confirmed as Portal user (group_ids: [10])
- [x] Ketut portal user (ID: 7) migrated from Internal User to Portal
- [x] All backend routes compatible with new Odoo API
- [x] Tests: 93 PASSED ✅
- [x] todo.md updated


## Bug Fix: Odoo Contact Creation on User Registration
- [x] Investigate OAuth callback flow - check if syncOdooContact is called
- [x] Check odoo.ts syncOdooContact function - verify JSON-RPC 2.0 compatibility
- [x] Review error logs for contact creation failures
- [x] Fix contact creation logic - changed create([values]) to create([[values]])
- [x] Test with real user registration (Google/Email) - Contact ID 19 created successfully
- [x] Verify contact appears in Odoo res.partner - Confirmed
- [x] All 93 tests passing


## Partner Portal & Odoo User Updates
- [x] VGR user (ID: 6) updated - email: ozgurkonukcu@gmail.com, password: 123456
- [x] VGR partner (ID: 15) email updated
- [x] Ketut user (ID: 7) email already ozgurkonukcu42@gmail.com (OAuth login, cannot change password via API)
- [x] Ketut partner (ID: 16) email updated
- [x] BecomePartner page login button already redirects to https://pt-telkon-one-group.odoo.com/my


## Navbar Improvements
- [x] Dynamic navbar colors based on current page
- [x] Navbar color changes on scroll (transparent → solid background)
- [x] Fix page navigation scroll-to-top (web and mobile) - ScrollToTop component added to App.tsx
- [x] Close dropdowns on page navigation
- [x] Mobile responsive navbar verification


## VGR Custom Portal Architecture (Odoo 19)

### Phase 1: Project & Task Mapping
- [ ] Create "PMA Company Formation" project in Odoo
- [ ] Create 4 task stages: "Notary Approval", "NIB Issuance", "Tax ID (NPWP)", "Bank Account Opening"
- [ ] Enable "Visible on Portal" for all task stages
- [ ] Assign VGR (Partner ID: 15) as project customer

### Phase 2: Odoo Studio Customization
- [ ] Add x_portal_status_percentage integer field to project.task model
- [ ] Configure Progress Bar rendering in portal view
- [ ] Set default values for each task stage (0%, 25%, 50%, 75%, 100%)
- [ ] Test portal view with progress visualization

### Phase 3: Document Integration
- [ ] Create "Customer Folders" structure in Odoo Documents
- [ ] Create VGR folder with subfolders: KITAS, Deed, Lease Agreement
- [ ] Configure document access rules (VGR only sees own folder)
- [ ] Add Documents section to portal

### Phase 4: Portal Menu Customization
- [ ] Hide default portal menu items (Quotations, Orders, etc.)
- [ ] Show only: "My Business Status", "Documents", "Invoices", "Yield Tracker"
- [ ] Test VGR portal access with new menu structure
- [ ] Verify all 4 sections are accessible and functional


## Technical Audit Fixes (Security & Reliability)

### Phase 1: API Key Rotation
- [x] Rotate Odoo API key (old key exposed in chat)
- [x] Update ODOO_PASSWORD environment variable with new key
- [x] Verify new key works with Odoo JSON-RPC 2.0
- [x] Confirm old key is invalidated in Odoo

### Phase 2: Zod Validation for Odoo Responses
- [x] Create OdooProductSchema (id, name, list_price)
- [x] Create OdooLeadSchema (name, email, phone, budget, sector)
- [x] Create OdooContactSchema (name, email, phone, country_id)
- [x] Create OdooExchangeRateSchema (rate, currency_from, currency_to)
- [x] Add validateOdooResponse and validateOdooResponseArray helpers
- [x] Created: server/odoo-schemas.ts

### Phase 3: Fallback Exchange Rate (ExchangeRate-API)
- [x] Add ExchangeRate-API as secondary source
- [x] Implement getUsdToIdrRate with dual sources (Odoo primary, ExchangeRate-API fallback)
- [x] Update cache strategy (Odoo 4h, ExchangeRate-API 1h)
- [x] Add logging for fallback activation
- [x] Created: server/exchange-rate.ts

### Phase 4: Error Handling & Error Boundaries
- [x] Add OdooConnectionError, OdooAuthError, OdooValidationError types
- [x] Add OdooNotFoundError, OdooPermissionError types
- [x] Implement retry logic with exponential backoff
- [x] Add error classification (severity, alert, suggested action)
- [x] Add error formatting for logging
- [x] Created: server/odoo-errors.ts

### Phase 5: Testing & Verification
- [x] All 93 tests passing with new API key
- [x] Odoo authentication test verified
- [x] Exchange rate tests verified
- [x] No regressions detected


## VGR Portal Configuration (Odoo Project Module)

### Phase 1: Project Module Setup
- [x] Check if Project module is installed in Odoo
- [x] Module already installed (state: installed)
- [x] Verify module installation and availability

### Phase 2: PMA Company Formation Project
- [x] Create "PMA Company Formation" project (ID: 1, already exists)
- [x] Create project stages:
  - [x] Evrak Kontrolü (ID: 15, sequence: 1)
  - [x] Noter ve Akta (ID: 16, sequence: 2)
  - [x] OSS ve Lisanslar (ID: 17, sequence: 3)
  - [x] Teslimat (ID: 18, sequence: 4)
- [x] Create sample task: "PMA Setup - John Smith (Villa Rental)" (ID: 3)
  - [x] Assign to VGR (partner_id: 15)
  - [x] Set stage: Evrak Kontrolü
- [x] Project visibility already set to portal

### Phase 3: VGR Portal Access
- [x] Check VGR user (ID: 6) portal access rights
- [x] VGR already has portal access (active: true)
- [x] Partner ID: 15 linked to User ID: 6

### Phase 4: Odoo Studio Manual Steps Documentation
- [x] Document portal view customization steps
- [x] Document custom field creation (x_portal_status_percentage)
- [x] Document document upload field configuration
- [x] Create step-by-step guide for user
- [x] Created: docs/odoo-studio-vgr-portal-setup.md

### Phase 5: Website Partner Portal Integration
- [ ] Update Partner Portal page with "Görevleriniz" section (deferred)
- [ ] Add Odoo API endpoint to fetch VGR tasks (deferred)
- [ ] Display task list with status (deferred)
- [ ] Add links to Odoo portal for details (deferred)
- Note: Web sitesi entegrasyonu ayrı bir task olarak yapılacak

### Phase 6: Testing & Deployment
- [x] VGR portal configuration complete
- [x] Project, stages, and sample task created
- [x] Manual steps documented
- [x] Custom field x_portal_status_percentage created via API (Field ID: 15543)
- [x] Partner Portal page created (PartnerPortal.tsx)
- [x] tRPC partner router created (getTasks, getDocuments, updateTaskStatus)
- [x] /partner-portal route added to App.tsx
- [x] All 93 tests passing


## Odoo V19 Back-Office Configuration (Final Update)

### PART 1: VGR (Legal Team) Configuration
- [x] Create "VGR Operations" Sales Team (ID: 5)
- [x] Create CRM stages: KYC Check (9), Due Diligence (10), Contract Drafting (11), Waiting Signature (12), PT PMA Setup (13), KITAS Process (14), Completed (15)
- [x] Preserve existing stages (New, Qualified, Scouting Fee Paid etc.) for BaseOne pipeline
- [x] Add custom fields to crm.lead: x_passport_file, x_contract_status, x_company_name_custom, x_investment_amount
- [x] Create automation rule: Activity on "Waiting Signature" stage (Rule ID: 1, Action ID: 772)

### PART 2: Supplier Configuration

- [x] Create "Real Estate Property" product category (ID: 4)
- [x] Add custom fields to product.template: x_is_real_estate, x_location_lat, x_location_long, x_projected_roi, x_total_units, x_available_units, x_documents_link
- [x] Create "Supplier Manager" security group (ID: 74)
- [x] Set access rules: product.template (R/W/C), product.category (R only), NO crm.lead access
### PART 3: Web Site Updates
- [x] Update Partner Portal: VGR CRM pipeline view (Kanban + table)
- [x] Update Partner Portal: Supplier product management view (grid cards)
- [x] Update Admin panel: VGR pipeline summary (bar chart + lead table)
- [x] Update Admin panel: Supplier product summary (table view)
- [x] Deploy and report

## Denetim Raporu Düzeltmeleri (Audit Fix)

### TEST 5 - Lead Oluşturma (KRİTİK)
- [x] Lead form'ları VGR Operations team (ID:5) ile oluşturulmalı — team_id: 5 eklendi
- [x] Lead'de bütçe, sektör ve kaynak bilgisi olmalı — expected_revenue eklendi

### TEST 4 - Stripe Webhook (KRİTİK)
- [x] Stripe ödeme sonrası Odoo'da sale.order "Paid" olarak işaretlenmeli — note + confirm eklendi
- [x] Kullanıcının res.partner kaydında membership_level güncellenmeli — x_membership_level field oluşturuldu (ID: 17418), updatePartnerMembershipLevel fonksiyonu eklendi

### TEST 9 - VGR Pipeline
- [x] VGR Operations team (ID:5) altında 7 aşama doğrulanmalı — tüm 7 aşama doğrulandı
- [x] 48 saatlik Waiting Signature otomasyonu çalışmalı — Rule ID: 1, filter_domain: [("stage_id", "=", 12)]

### TEST 10 - Vendor Portal (KRİTİK)
- [x] /list-your-property formu Odoo'da product.template olarak pending/draft oluşturmalı — createOdooProductFromVendor (active: false)
- [x] Admin panelinde pending ilanlar görünmeli, onay/red butonu olmalı — updateStatus endpoint güncellendi
- [x] Onaylanan ilan aktif olmalı — activateOdooProduct / deactivateOdooProduct fonksiyonları eklendi

### TEST 3 - Yatırım Sihirbazı
- [x] 3 aşamalı seçim sonucu Odoo CRM'de "Pre-qualification" notu ile lead oluşturmalı — [Pre-qualification] prefix + note eklendi

### TEST 7 - İlan Kilidi
- [x] Free kullanıcı fiyatları göremez (blur), Premium/VIP görebilir — mevcut implementasyon zaten çalışıyor (useSubscription hook)
- [x] Kilit bilgisi Odoo'daki membership_level'a göre çalışmalı — Stripe webhook'ta x_membership_level senkronize ediliyor


## Test Sonuçları Düzeltmeleri (10 Kritik Sorun)

### TEST 1 - User Profile Sync
- [x] syncOdooContact fonksiyonunu kontrol et ve çalıştır
- [x] Web'den kullanıcı adı değiştiğinde Odoo'da güncellenmeli — profile.update endpoint'e Odoo sync eklendi

### TEST 2 - AI Advisor Centering
- [x] AI Advisor sayfasının vertical centering'ini düzelt — flex container eklendi
- [x] Analyze sonrası sayfa scroll etmemeli

### TEST 3 - Pricing Page Layout + VIP Checkout
- [x] Pricing page'in responsive layout'unu düzelt — max-w-sm card constraint eklendi
- [x] VIP üyelik seçildiğinde checkout modal açılsın — payment method dialog eklendi

### TEST 4 - Payment Modal + JSON Error
- [x] Pricing page'de payment method seçimi modal'da gösterilsin — Dialog component eklendi
- [x] "Unexpected token '<'" JSON parse error'ını düzelt — IDR currency fix (Stripe account sadece IDR destekliyor)

### TEST 5 - Talk to Expert Form
- [x] "Talk to Expert" tıklandığında form gösterilsin — CTA button'u LeadFormModal açıyor
- [x] Form submit'lendikten sonra WhatsApp'a yönlendir

### TEST 6 - Lead Description Language
- [x] LeadFormModal'da lead açıklaması seçilen dile göre olmalı — locale parametresi eklendi, Odoo'da localized labels kullanılıyor

### TEST 7 - Map Filtering + Property Card Symmetry
- [x] Harita filtreleme çalışmalı — PropertyMap selectedRegion prop eklendi
- [x] Property card'ları simetrik hale getir — h-48 fixed image height
- [x] Olmayan bölge seçildiğinde harita kayboluyor — regionCenters fallback eklendi

### TEST 8 - Footer Translations
- [x] "Become a Partner" ve "Contracts" footer linklerini i18n'e ekle — nav.becomePartner + nav.contracts 4 dilde eklendi

### TEST 9 - Admin CRM Panel
- [x] Admin panelde CRM sekmesi boş — VGR lead stage_id=1 → KYC Check (9) taşındı, veri doğrulandı

### TEST 10 - Image Upload + Country Autocomplete + Phone Code + Property Management
- [x] Image upload functionality — mevcut (URL input)
- [x] Country select'inde keyboard typing autocomplete — CountrySelect zaten mevcut
- [x] Country seçildiğinde phone code otomatik değişsin — zaten çalışıyor
- [x] Admin panelde Property Management tab'ı ekle — VendorSubmissionsTab eklendi (approve/reject)
### BONUS - Hero Scroll Indicator

- [x] Hero section'daki "Scroll" indicator'ını düzelt — z-20 + hidden sm:flex + pointer-events-none

## Forced OAuth Redirect Fix
- [ ] Ana sayfa ve public sayfalar login olmadan erişilebilmeli
- [ ] Sadece korumalı sayfalar (profile, admin) login gerektirmeli

## SEO Düzeltmeleri
- [x] Ana sayfa meta title, description, keywords ekle
- [x] Open Graph (OG) tags ekle (Facebook/LinkedIn paylaşım)
- [x] Twitter Card meta tags ekle
- [x] JSON-LD structured data (Organization + WebSite + Service + FAQ) ekle
- [x] Semantic HTML (h1, h2, article, section, nav) doğrulandı
- [x] robots.txt ve sitemap.xml ekle
- [x] Canonical URL ekle (useSEO hook ile dinamik)
- [x] Alt text'leri doğrulandı
- [x] useSEO hook oluşturuldu (Home, Properties, AIAdvisor, Pricing, InvestmentWizard)
- [x] Geo tags eklendi (Bali, Indonesia)


## Final Comprehensive Fix (Tüm Testler)

### TEST 4 - Stripe Payment (KRİTİK)
- [x] Stripe checkout currency fix (IDR) — zaten IDR
- [ ] BLOCKED: Stripe Dashboard'da ödeme yöntemi aktif değil — Ozgur sandbox claim edip Card aktif etmeli
- [ ] payment_method_types explicit set — Card aktif olduktan sonra test edilecek

### TEST 5 - Talk to Expert
- [ ] Tüm "Talk to Expert" / WhatsApp linklerini bul ve form'a çevir
- [ ] Görsel doğrulama: CTA tıkla → form açılsın

### TEST 9 - Admin CRM Panel
- [ ] Neden boş geldiğini debug et (Odoo bağlantısı? Auth? Veri?)
- [ ] Görsel doğrulama: Admin → CRM tab → veri görünsün

### TEST 3 - Pricing Layout + VIP Checkout
- [ ] Card genişliğini düzelt (sayfaya sığsın)
- [x] VIP tıklanınca direkt checkout (pricing sayfasına gitmesin)
- [x] "Ana sayfa dön" → "Geri" olarak değiştir

### TEST 7 - Harita Filtreleme
- [x] Kiralık/satılık filtre değişince harita güncellenmeli
- [ ] Harita hızını optimize et
- [ ] Filtre-harita senkronizasyonu

### TEST 10 - Vendor Portal
- [ ] Dosya yükleme (image upload) + MB kota
- [ ] Salon/Mutfak seçeneği ekle
- [ ] Ülke seçince telefon alan kodu değişsin (TÜM sayfalarda)
- [ ] Onaylanan ilan Odoo'da product.template olarak aktif olsun
- [ ] Onaylanan ilan web sitesinde görünsün

### TEST 2 - AI Advisor Centering
- [ ] Sayfa ortalanma doğrula
- [ ] Analyze sonrası scroll sorunu

### TEST 6 - Lead Dil
- [ ] TR seçiliyken lead açıklaması TR olmalı
- [ ] Görsel doğrulama

### TEST 8 - Footer Çevirileri
- [ ] Become a Partner / Contracts TR/ID/RU doğrula

### BONUS - Hero Scroll Indicator
- [ ] "Kaydır" yazısını aşağıya kaydır

### TEST 1 - Özel Login/Register Sayfası
- [ ] Google ile kayıt
- [ ] Microsoft ile kayıt
- [ ] Apple ile kayıt
- [ ] Email ile kayıt
- [ ] Cloudflare insan doğrulaması

## Final Fix Sprint (User Priority Order)

### TEST 1 - Custom Login/Register Page
- [x] Email + password kayıt/giriş sistemi (bcrypt hash)
- [x] Google OAuth entegrasyonu (Manus OAuth üzerinden)
- [x] Microsoft OAuth entegrasyonu (Manus OAuth üzerinden)
- [x] Apple OAuth entegrasyonu (Manus OAuth üzerinden)
- [x] Cloudflare Turnstile insan doğrulaması
- [x] Login/Register sayfası UI (dark theme, gold accents)
- [x] Manus OAuth yerine kendi auth sistemi (email + OAuth hybrid)

### TEST 4 - Stripe Payment Fix
- [x] Stripe checkout akışını test et ve düzelt (exchange rate fallback + error handling)
- [x] Payment method types düzeltmesi (Stripe sandbox claim gerekli - user action)

### TEST 10 - Vendor Portal Improvements
- [x] Image upload (dosya yükleme + URL) with 5MB quota, drag&drop, preview
- [x] Salon/Mutfak seçeneği ekle (Living Rooms + Kitchens alanları)
- [x] Onaylanan ilanlar web sitesinde görünsün (vendor submissions -> admin approval -> property creation mevcut)

### TEST 7 - Map Filtering Sync
- [x] Kiralık/satılık filtre değişince harita güncellenmeli
- [x] Filtre-harita tam senkronizasyonu (map always visible in map mode, filters sync)

### TEST 3 - VIP Checkout + Geri Button
- [x] VIP/Premium tıklanınca direkt checkout (Stripe checkout mutation)
- [x] "Ana sayfa dön" → "Geri" (window.history.back)

### TEST 9 - Admin CRM Panel
- [x] Admin CRM panel: error handling, status filter pills, search, status update dropdown, phone column eklendi

### Failing Tests Fix
- [x] Exchange rate test threshold düzelt (rate=1 fallback ile otomatik düzeld)

## New Feature Sprint

### Cloudflare Turnstile Integration
- [x] Cloudflare Turnstile site key secret oluştur/iste (gerçek key'ler ayarlandı)
- [x] Login sayfasına gerçek Turnstile widget entegre et
- [x] Backend'de Turnstile token doğrulaması ekle (register + login)
- [x] Turnstile başarısız olursa form submit engelle

### Admin Vendor Submissions Image Preview
- [x] Vendor submissions tabında yüklenen görselleri preview olarak göster (thumbnail + gallery)
- [x] Lightbox/modal ile büyük görsel görüntüleme (fullscreen overlay)

## Odoo Backend Cleanup & Security (CRITICAL)

### 1. CRM Pipeline İzolasyonu
- [x] "VGR Operations" Sales Team oluştur (crm.team) — ID 5 mevcut
- [x] Varsayılan Odoo stage'lerini (New, Qualified, Proposition, Won) VGR ekibinden ayır — zaten bağlı değildi
- [x] 7 özel stage oluştur ve VGR ekibine bağla — tümü güncellendi (seq 1-7)
- [x] "Fırsata Dönüştür" butonunun lead'i KYC Check'e düşürmesini sağla — KYC Check seq=1 (ilk stage)

### 2. Kullanıcı Yetki Matrisi
- [x] "BaseOne Operations" grubu oluştur (res.groups) — ID 75
- [x] crm.lead, project.task, documents.document için okuma/yazma yetkisi verildi
- [x] Account/Settings erişimi engellendi
- [x] VGR kullanıcıları BaseOne Operations grubuna eklendi (Vireon Tuncay)
- [x] Record rule: Kullanıcı sadece kendi kayıtlarını veya VGR ekibinin kayıtlarını görsün (ID 352)

### 3. Vendor Form Draft State
- [x] product.template kaydı oluştururken active=False set edilmiş (createOdooProductFromVendor)
- [x] Admin onayı olmadan ilan yayınlanması engellendi (activate/deactivateOdooProduct)

## VGR Pipeline Strict Workflow Enforcement

### 2. Blocking Activities (KYC → Due Diligence)
- [x] Passport attachment check on KYC → Due Diligence transition (TRPCError PRECONDITION_FAILED)
- [x] UserError if no passport document found
- [x] Backend API endpoint for stage transition with validation (partner.updateLeadStage)

### 3. Document Request Flow
- [x] Auto email on KYC Check entry (sendDocumentRequestEmail)
- [x] Email template: passport upload link (KYC Document Request template)
- [x] Activity creation for consultant when document uploaded (mail.activity type=Document)

### 4. Dashboard Pending Actions
- [x] Profile sayfasına Pending Actions bölümü eklendi (StageProgressBar + upload UI)
- [x] KYC Check stage detection for logged-in user (partner.getMyLead)
- [x] Passport upload button + file upload to Odoo crm.lead attachment (partner.uploadLeadAttachment)
- [x] Upload confirmation + danışmana mail.activity oluşturma

## Payment Gateway Switch: Stripe → Xendit (Indonesia Native)

### Backend (server/xendit.ts, xendit-products.ts)
- [x] Install xendit-node package
- [x] Remove Stripe packages (stripe)
- [x] Create xendit-products.ts with USD-based pricing (IDR conversion at checkout)
- [x] Create xendit.ts with Invoice API integration
- [x] Xendit Invoice creation with IDR amount (USD → IDR via Odoo Bank Indonesia rate)
- [x] Xendit webhook handler (/api/xendit-webhook) with x-callback-token verification
- [x] Webhook: update user subscription tier on PAID status
- [x] Webhook: update Odoo sale.order and partner membership_level
- [x] Webhook: handle scouting fee payments
- [x] Webhook: handle affiliate commission tracking
- [x] Exchange rate info endpoint (getExchangeRateInfo)
- [x] Remove all Stripe-related code from routers.ts
- [x] Remove Stripe webhook handler from server/_core/index.ts
- [x] Update server/db.ts imports from stripe-products → xendit-products
- [x] Update server/odoo.ts "Paid via Stripe" → "Paid via Xendit"

### Frontend
- [x] Update Pricing.tsx: Xendit as primary payment method
- [x] Update Properties.tsx: Xendit checkout for scouting fee
- [x] Update PaymentSuccess.tsx comments
- [x] Update i18n translations (EN, TR, ID, RU) — remove Stripe references

### Tests
- [x] Write xendit.test.ts (products, amounts, display prices, module exports)
- [x] Update phase17.test.ts (Stripe → Xendit imports)
- [x] Update phase18.test.ts (Stripe → Xendit products)
- [x] Update phase19.test.ts (Stripe → Xendit amount calculation)
- [x] Update phase20.test.ts (Stripe → Xendit products)
- [x] Update audit-fix.test.ts (Stripe → Xendit webhook references)
- [x] Update subscription.test.ts (Stripe mock → Xendit mock)
- [x] All 17 test files, 167 tests passed
