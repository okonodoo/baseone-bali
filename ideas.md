# BaseOne Bali - Tasarım Brainstorm

## Proje Bağlamı
Bali'de yatırım yapmak isteyen yabancılar için premium yatırım platformu. Koyu tema (#0a0a0b), altın aksanlar (#c5a059), rounded kartlar, lucide-react ikonlar. İki ana senaryo: AI Investment Advisor ve Investment Wizard.

---

<response>
## Fikir 1: "Tropical Noir" — Karanlık Lüks Tropik Estetiği
<probability>0.07</probability>

**Design Movement:** Film Noir meets Tropical Modernism — sinematik karanlık atmosfer ile Bali'nin tropikal sıcaklığının birleşimi.

**Core Principles:**
1. Derin kontrastlar: Siyah (#0a0a0b) zemin üzerinde altın (#c5a059) ve sıcak amber tonları
2. Sinematik derinlik: Katmanlı gölgeler ve ışık efektleri
3. Organik geometri: Bali tapınak mimarisinden esinlenen yumuşak kemerler ve rounded formlar
4. Sessiz lüks: Minimal ama her detayı düşünülmüş

**Color Philosophy:**
- Primary: #0a0a0b (derin gece siyahı — güven ve gizem)
- Accent: #c5a059 (antik altın — zenginlik ve prestij)
- Secondary: #1a1a1d (koyu gri kartlar — derinlik katmanı)
- Text: #e8e4dc (sıcak beyaz — okunabilirlik)
- Muted: #6b6560 (taş grisi — ikincil bilgi)
- Success: #4ade80 (yeşil — pozitif ROI göstergeleri)

**Layout Paradigm:** Full-bleed hero ile asimetrik grid. Sol tarafta büyük görsel/interaktif alan, sağda bilgi kartları. Sayfalar arasında yatay geçişler. Wizard adımları dikey timeline olarak.

**Signature Elements:**
1. Altın gradient çizgiler — bölüm ayırıcıları olarak ince altın çizgiler
2. Glassmorphism kartlar — backdrop-blur ile yarı saydam koyu kartlar
3. Bali tapınak motifi — subtle SVG pattern olarak arka planda

**Interaction Philosophy:** Hover'da kartlar hafifçe yukarı kalkar ve altın glow efekti. Butonlar basıldığında ripple efekti. Scroll-triggered reveal animasyonları.

**Animation:** Framer Motion ile staggered entrance (kartlar sırayla gelir), smooth page transitions, parallax scroll efektleri hero bölümünde. Wizard adımları arasında slide geçişleri.

**Typography System:**
- Display: "Playfair Display" — serif, lüks ve klasik his
- Body: "Inter" — modern, okunabilir
- Accent: "Space Grotesk" — teknik verilerde kullanılacak monospace-esque
</response>

<response>
## Fikir 2: "Balinese Brutalism" — Dijital Tapınak Estetiği
<probability>0.04</probability>

**Design Movement:** Neo-Brutalism meets Sacred Geometry — ham, güçlü formlar ile Bali'nin kutsal geometrisi.

**Core Principles:**
1. Kalın sınırlar ve keskin gölgeler
2. Büyük tipografi ile güçlü mesajlar
3. Grid-kırıcı asimetrik düzenler
4. Kutsal geometri motifleri

**Color Philosophy:**
- Primary: #0a0a0b (mutlak siyah — otorite)
- Accent: #c5a059 (altın — kutsal, değerli)
- Highlight: #ff6b35 (volkanik turuncu — enerji)
- Surface: #151517 (koyu yüzey)
- Text: #ffffff (saf beyaz — netlik)

**Layout Paradigm:** Overlapping kartlar, rotated elementler, büyük boşluklar. Her bölüm bir "tapınak katmanı" gibi. Wizard bir spiral/mandala formu.

**Signature Elements:**
1. Kalın 3px altın border'lar
2. Offset shadow (4px 4px siyah gölge)
3. Mandala SVG arka plan desenleri

**Interaction Philosophy:** Agresif hover efektleri — kartlar rotate olur, renkler değişir. Click'te satisfying bounce. Scroll'da elementler sahneye "inşa edilir".

**Animation:** Spring-based animasyonlar (bouncy), stagger delays, scroll-linked parallax. Wizard adımları mandala gibi açılır.

**Typography System:**
- Display: "Archivo Black" — kalın, güçlü
- Body: "DM Sans" — temiz, modern
- Data: "JetBrains Mono" — rakamlar ve kodlar için
</response>

<response>
## Fikir 3: "Golden Archipelago" — Premium Finans Estetiği
<probability>0.08</probability>

**Design Movement:** Swiss Finance meets Island Warmth — İsviçre bankacılık estetiğinin hassasiyeti ile Bali'nin sıcak doğal tonları.

**Core Principles:**
1. Matematiksel hassasiyet: 8px grid sistemi, tutarlı spacing
2. Bilgi hiyerarşisi: Veriler net, okunabilir, güvenilir
3. Sıcak minimalizm: Soğuk finans estetiğine tropikal sıcaklık katmak
4. Progressive disclosure: Bilgiyi katman katman açmak

**Color Philosophy:**
- Primary: #0a0a0b (derin siyah — profesyonellik)
- Gold: #c5a059 (altın — değer ve güven)
- Gold Light: #d4b06a (açık altın — hover/active states)
- Surface: #111113 (kart arka planı)
- Surface Elevated: #1c1c1f (yükseltilmiş kartlar)
- Text Primary: #f0ece4 (krem beyaz — sıcak okunabilirlik)
- Text Secondary: #8a8580 (sıcak gri)
- Border: rgba(197, 160, 89, 0.15) (altın border — subtle)
- Success: #22c55e (yeşil — pozitif göstergeler)
- Warning: #f59e0b (amber — dikkat)

**Layout Paradigm:** Merkezi içerik kolonu (max-w-6xl) ile generous padding. Hero full-width, ardından kartlar 2-3 sütunlu grid. Wizard sol tarafta timeline, sağda içerik. AI Advisor chat-benzeri arayüz.

**Signature Elements:**
1. Altın gradient accent line — sayfa üstünde ince 2px altın çizgi (brand marker)
2. Frosted glass kartlar — bg-white/5 backdrop-blur ile derinlik
3. Subtle dot grid pattern — arka planda çok hafif nokta deseni (finans estetiği)

**Interaction Philosophy:** Zarif ve kontrollü. Hover'da kartlarda subtle border-color geçişi (şeffaftan altına). Butonlarda smooth scale(1.02). Focus states belirgin ama şık. Wizard adımları arasında crossfade.

**Animation:** Framer Motion ile:
- Sayfa girişinde fade-up (y: 20 → 0, opacity: 0 → 1)
- Staggered children (her kart 0.1s gecikmeyle)
- Wizard step geçişlerinde AnimatePresence ile slide
- AI Advisor'da typing indicator ve mesaj bubble animasyonları
- Scroll-triggered counters (rakamlar yukarı sayar)

**Typography System:**
- Display: "Sora" — geometric sans-serif, modern ve premium
- Body: "DM Sans" — humanist sans-serif, sıcak ve okunabilir
- Mono: "Space Mono" — finansal veriler, KBLI kodları, fiyatlar
</response>

---

## Seçim: Fikir 3 — "Golden Archipelago"

Bu yaklaşım seçildi çünkü:
1. Finans platformu için en uygun güvenilirlik hissi
2. Webosmobilecode_v5.txt'deki tasarım diline en yakın
3. Bilgi yoğun içerik (KBLI kodları, vergi oranları, bütçe hesaplamaları) için en okunabilir
4. Progressive disclosure felsefesi, Wizard ve AI Advisor akışlarına mükemmel uyum sağlar
