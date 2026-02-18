export interface BlogPost {
  slug: string;
  title: string;
  titleTr: string;
  titleId: string;
  titleRu: string;
  excerpt: string;
  excerptTr: string;
  excerptId: string;
  excerptRu: string;
  content: string;
  contentTr: string;
  contentId: string;
  contentRu: string;
  category: "investment-guide" | "legal-tax" | "real-estate" | "lifestyle" | "news";
  image: string;
  author: string;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
}

export const BLOG_CATEGORIES = [
  { id: "all", label: "All", labelTr: "Tümü", labelId: "Semua", labelRu: "Все" },
  { id: "investment-guide", label: "Investment Guide", labelTr: "Yatırım Rehberi", labelId: "Panduan Investasi", labelRu: "Руководство по инвестициям" },
  { id: "legal-tax", label: "Legal & Tax", labelTr: "Hukuk & Vergi", labelId: "Hukum & Pajak", labelRu: "Право и налоги" },
  { id: "real-estate", label: "Real Estate", labelTr: "Gayrimenkul", labelId: "Properti", labelRu: "Недвижимость" },
  { id: "lifestyle", label: "Lifestyle", labelTr: "Yaşam Tarzı", labelId: "Gaya Hidup", labelRu: "Образ жизни" },
  { id: "news", label: "News", labelTr: "Haberler", labelId: "Berita", labelRu: "Новости" },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-invest-in-bali-complete-guide-2026",
    title: "How to Invest in Bali: Complete Guide for Foreigners 2026",
    titleTr: "Bali'de Yatırım Nasıl Yapılır: Yabancılar İçin 2026 Rehberi",
    titleId: "Cara Berinvestasi di Bali: Panduan Lengkap untuk WNA 2026",
    titleRu: "Как инвестировать на Бали: Полное руководство для иностранцев 2026",
    excerpt: "Everything you need to know about investing in Bali as a foreigner — from legal structures and PMA setup to choosing the right sector and location.",
    excerptTr: "Yabancı olarak Bali'de yatırım yapma hakkında bilmeniz gereken her şey — hukuki yapılardan PMA kurulumuna, doğru sektör ve konum seçimine kadar.",
    excerptId: "Semua yang perlu Anda ketahui tentang berinvestasi di Bali sebagai WNA — dari struktur hukum dan pendirian PMA hingga memilih sektor dan lokasi yang tepat.",
    excerptRu: "Всё, что нужно знать об инвестировании на Бали для иностранцев — от юридических структур и создания PMA до выбора подходящего сектора и локации.",
    content: `## Why Bali Is the Top Investment Destination in Southeast Asia

Bali has emerged as one of the most attractive investment destinations in Southeast Asia, drawing entrepreneurs and investors from around the world. With over 6 million international tourists annually (pre-pandemic levels now fully recovered), a rapidly growing digital nomad community, and Indonesia's pro-investment policies, Bali offers a unique combination of lifestyle and business opportunity.

The island's economy is diverse, spanning tourism, hospitality, real estate, technology, wellness, and agriculture. The Indonesian government has introduced several incentive programs, including the Golden Visa and simplified PMA (Penanaman Modal Asing) registration process, making it easier than ever for foreigners to establish businesses.

## Legal Structure: Setting Up a PT PMA

For foreign investors, the primary legal vehicle is a PT PMA (Foreign Investment Company). This allows 100% foreign ownership in many sectors, though some industries have foreign ownership caps under the Positive Investment List (Daftar Positif Investasi).

**Key requirements for PT PMA:**
- Minimum investment plan of IDR 10 billion (~$630,000) excluding land and buildings
- Minimum paid-up capital of IDR 10 billion
- At least one director and one commissioner
- KBLI (Indonesian Business Classification) code registration
- OSS (Online Single Submission) license

The actual minimum to start varies by sector. For restaurants and cafes, you can begin operations with $25,000-50,000 in practical costs, while the formal capital requirements can be structured over time.

## Choosing the Right Sector

Bali's investment landscape spans multiple sectors, each with different capital requirements, ROI timelines, and regulatory considerations:

**Hospitality & F&B:** The most popular sector for foreign investors. Restaurants, beach clubs, and boutique hotels offer strong returns, especially in Canggu, Seminyak, and Uluwatu. Expect 18-35% annual ROI for well-managed venues.

**Real Estate:** Villa development and rental management remain highly profitable. Leasehold properties in prime locations can generate 8-15% annual yields, while development projects offer 25-40% returns over 2-3 year cycles.

**Digital & Technology:** Bali's growing tech ecosystem, centered in Canggu, supports digital agencies, SaaS companies, and fintech ventures. Lower operational costs compared to Singapore or Australia make it attractive for bootstrapped startups.

## Location Analysis

Each area of Bali offers distinct advantages:

- **Canggu:** Digital nomad hub, surf culture, rapidly developing. Best for cafes, co-working spaces, and tech businesses.
- **Seminyak:** Established luxury market, high foot traffic. Ideal for upscale restaurants, boutiques, and wellness centers.
- **Ubud:** Cultural heart of Bali, wellness tourism. Perfect for retreat centers, art galleries, and eco-tourism.
- **Uluwatu:** Emerging luxury destination with stunning clifftop locations. Great for high-end villas and beach clubs.

## Getting Started

The first step is to consult with a qualified investment advisor who understands both Indonesian regulations and your specific goals. BaseOne Bali provides AI-powered investment analysis and connects you with local experts to guide your journey from initial planning to operational launch.`,
    contentTr: `## Bali Neden Güneydoğu Asya'nın En İyi Yatırım Destinasyonu?

Bali, dünya genelinden girişimcileri ve yatırımcıları çeken Güneydoğu Asya'nın en cazip yatırım destinasyonlarından biri haline gelmiştir. Yılda 6 milyonun üzerinde uluslararası turist, hızla büyüyen dijital göçebe topluluğu ve Endonezya'nın yatırım yanlısı politikalarıyla Bali, yaşam tarzı ve iş fırsatının benzersiz bir kombinasyonunu sunmaktadır.

Adanın ekonomisi turizm, konaklama, gayrimenkul, teknoloji, wellness ve tarım gibi çeşitli sektörleri kapsamaktadır. Endonezya hükümeti, Golden Visa ve basitleştirilmiş PMA kayıt süreci dahil olmak üzere çeşitli teşvik programları sunarak yabancıların iş kurmasını her zamankinden daha kolay hale getirmiştir.

## Hukuki Yapı: PT PMA Kurulumu

Yabancı yatırımcılar için birincil hukuki araç PT PMA'dır (Yabancı Yatırım Şirketi). Bu, birçok sektörde %100 yabancı mülkiyetine izin verir, ancak bazı sektörlerde Pozitif Yatırım Listesi kapsamında yabancı mülkiyet sınırları bulunmaktadır.

**PT PMA için temel gereksinimler:**
- Arazi ve bina hariç minimum 10 milyar IDR (~630.000$) yatırım planı
- Minimum 10 milyar IDR ödenmiş sermaye
- En az bir direktör ve bir komiser
- KBLI kod kaydı
- OSS lisansı

## Doğru Sektörü Seçmek

Bali'nin yatırım ortamı, her biri farklı sermaye gereksinimleri, ROI zaman çizelgeleri ve düzenleyici hususlara sahip birden fazla sektörü kapsamaktadır.

**Konaklama & F&B:** Yabancı yatırımcılar için en popüler sektör. İyi yönetilen mekanlar için yıllık %18-35 ROI beklentisi.

**Gayrimenkul:** Villa geliştirme ve kiralama yönetimi oldukça karlı olmaya devam etmektedir. Prime lokasyonlardaki kiralık mülkler yıllık %8-15 getiri sağlayabilir.

## Başlarken

İlk adım, hem Endonezya düzenlemelerini hem de sizin özel hedeflerinizi anlayan nitelikli bir yatırım danışmanına danışmaktır. BaseOne Bali, AI destekli yatırım analizi sağlar ve sizi ilk planlamadan operasyonel lansmana kadar yolculuğunuzda yönlendirecek yerel uzmanlarla buluşturur.`,
    contentId: `## Mengapa Bali Menjadi Destinasi Investasi Terbaik di Asia Tenggara

Bali telah muncul sebagai salah satu destinasi investasi paling menarik di Asia Tenggara, menarik pengusaha dan investor dari seluruh dunia. Dengan lebih dari 6 juta turis internasional setiap tahun, komunitas digital nomad yang berkembang pesat, dan kebijakan pro-investasi Indonesia, Bali menawarkan kombinasi unik antara gaya hidup dan peluang bisnis.

Ekonomi pulau ini beragam, mencakup pariwisata, perhotelan, properti, teknologi, wellness, dan pertanian. Pemerintah Indonesia telah memperkenalkan beberapa program insentif, termasuk Golden Visa dan proses pendaftaran PMA yang disederhanakan.

## Struktur Hukum: Mendirikan PT PMA

Bagi investor asing, kendaraan hukum utama adalah PT PMA (Perusahaan Penanaman Modal Asing). Ini memungkinkan kepemilikan asing 100% di banyak sektor.

**Persyaratan utama PT PMA:**
- Rencana investasi minimum IDR 10 miliar (~$630.000)
- Modal disetor minimum IDR 10 miliar
- Minimal satu direktur dan satu komisaris
- Registrasi kode KBLI
- Izin OSS

## Memilih Sektor yang Tepat

**Perhotelan & F&B:** Sektor paling populer untuk investor asing. ROI tahunan 18-35% untuk venue yang dikelola dengan baik.

**Properti:** Pengembangan villa dan manajemen sewa tetap sangat menguntungkan. Yield tahunan 8-15% untuk properti di lokasi premium.

## Memulai

Langkah pertama adalah berkonsultasi dengan penasihat investasi yang memahami regulasi Indonesia dan tujuan spesifik Anda. BaseOne Bali menyediakan analisis investasi berbasis AI dan menghubungkan Anda dengan ahli lokal.`,
    contentRu: `## Почему Бали — лучшее направление для инвестиций в Юго-Восточной Азии

Бали стал одним из самых привлекательных инвестиционных направлений в Юго-Восточной Азии, привлекая предпринимателей и инвесторов со всего мира. С более чем 6 миллионами международных туристов ежегодно, растущим сообществом цифровых кочевников и проинвестиционной политикой Индонезии, Бали предлагает уникальное сочетание образа жизни и деловых возможностей.

## Юридическая структура: Создание PT PMA

Для иностранных инвесторов основным юридическим инструментом является PT PMA (Компания с иностранными инвестициями). Это позволяет 100% иностранное владение во многих секторах.

**Основные требования для PT PMA:**
- Минимальный инвестиционный план в размере 10 миллиардов IDR (~$630,000)
- Минимальный оплаченный капитал 10 миллиардов IDR
- Как минимум один директор и один комиссар
- Регистрация кода KBLI
- Лицензия OSS

## Выбор правильного сектора

**Гостеприимство и общепит:** Самый популярный сектор для иностранных инвесторов. Годовая рентабельность 18-35%.

**Недвижимость:** Строительство вилл и управление арендой остаются высокоприбыльными. Годовая доходность 8-15%.

## Начало работы

Первый шаг — консультация с квалифицированным инвестиционным советником. BaseOne Bali предоставляет анализ инвестиций на основе ИИ и связывает вас с местными экспертами.`,
    category: "investment-guide",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=400&fit=crop",
    author: "BaseOne Bali Team",
    publishedAt: "2026-01-15",
    metaTitle: "How to Invest in Bali 2026 | Complete Foreign Investor Guide",
    metaDescription: "Complete guide for foreign investors looking to invest in Bali. Learn about PMA setup, legal requirements, best sectors, and location analysis.",
  },
  {
    slug: "setting-up-pt-pma-company-indonesia",
    title: "Setting Up a PT PMA Company in Indonesia: Step by Step",
    titleTr: "Endonezya'da PT PMA Şirketi Kurma: Adım Adım Rehber",
    titleId: "Mendirikan PT PMA di Indonesia: Langkah demi Langkah",
    titleRu: "Создание компании PT PMA в Индонезии: Пошаговое руководство",
    excerpt: "A detailed walkthrough of the PT PMA registration process, required documents, costs, and timeline for foreign investors in Indonesia.",
    excerptTr: "Endonezya'da yabancı yatırımcılar için PT PMA kayıt sürecinin, gerekli belgelerin, maliyetlerin ve zaman çizelgesinin detaylı rehberi.",
    excerptId: "Panduan lengkap proses pendaftaran PT PMA, dokumen yang diperlukan, biaya, dan timeline untuk investor asing di Indonesia.",
    excerptRu: "Подробное руководство по процессу регистрации PT PMA, необходимым документам, расходам и срокам для иностранных инвесторов в Индонезии.",
    content: `## Understanding PT PMA

PT PMA (Perseroan Terbatas Penanaman Modal Asing) is the legal entity that allows foreign nationals to own and operate a business in Indonesia. Since the implementation of the Omnibus Law (Job Creation Law) in 2020 and subsequent Government Regulation No. 5/2021, the process has been significantly streamlined through the OSS (Online Single Submission) system.

## Step 1: Choose Your Business Activity (KBLI Code)

Every business in Indonesia must be classified under the KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) system. Your KBLI code determines which licenses you need and whether there are foreign ownership restrictions.

**Popular KBLI codes for Bali investors:**
- 56101: Restaurants and food stalls
- 55111: Star-rated hotels
- 55194: Villa accommodation services
- 62011: Computer programming activities
- 68200: Real estate activities
- 96111: Spa and wellness services

## Step 2: Prepare Required Documents

**For the company:**
- Company name (3 alternatives, checked via AHU Online)
- Business address in Indonesia (virtual office acceptable for initial registration)
- Company deed of establishment (Akta Pendirian)
- KBLI code selection

**For shareholders/directors:**
- Passport copies (notarized)
- Tax ID (NPWP) — can be obtained during the process
- Domicile letter (Surat Keterangan Domisili)

## Step 3: Registration Process

1. **Name reservation** via AHU Online (1-2 days)
2. **Deed of Establishment** by Indonesian notary (3-5 days)
3. **Ministry of Law approval** — SK Kemenkumham (7-14 days)
4. **Tax registration** — NPWP company (3-5 days)
5. **OSS registration** — NIB (Nomor Induk Berusaha) and business licenses (1-3 days)
6. **Bank account opening** (7-14 days)

## Step 4: Costs Breakdown

| Item | Estimated Cost |
|------|---------------|
| Notary fees | $800 - $1,500 |
| Government fees | $200 - $500 |
| Legal consultant | $1,500 - $3,000 |
| Virtual office (annual) | $500 - $1,200 |
| KITAS processing | $1,200 - $1,800 |
| **Total** | **$4,200 - $8,000** |

## Step 5: Post-Registration Compliance

After establishing your PT PMA, ongoing compliance includes quarterly tax reporting, annual financial statements, LKPM (Investment Activity Report) submission, and maintaining proper bookkeeping. Working with a local accounting firm is strongly recommended.`,
    contentTr: `## PT PMA'yı Anlamak

PT PMA, yabancı uyrukluların Endonezya'da bir işletme sahibi olmasına ve işletmesine izin veren tüzel kişiliktir. 2020'de Omnibus Yasası'nın uygulanmasından bu yana süreç OSS sistemi aracılığıyla önemli ölçüde basitleştirilmiştir.

## Adım 1: İş Faaliyetinizi Seçin (KBLI Kodu)

Endonezya'daki her işletme KBLI sistemi altında sınıflandırılmalıdır. KBLI kodunuz hangi lisanslara ihtiyacınız olduğunu belirler.

## Adım 2: Gerekli Belgeleri Hazırlayın

**Şirket için:** Şirket adı, Endonezya'da iş adresi, kuruluş belgesi, KBLI kodu seçimi.

**Hissedarlar/direktörler için:** Pasaport kopyaları, Vergi Kimlik Numarası (NPWP), İkametgah belgesi.

## Adım 3: Kayıt Süreci

1. AHU Online üzerinden ad rezervasyonu (1-2 gün)
2. Endonezya noteri tarafından Kuruluş Belgesi (3-5 gün)
3. Hukuk Bakanlığı onayı (7-14 gün)
4. Vergi kaydı — NPWP (3-5 gün)
5. OSS kaydı — NIB ve iş lisansları (1-3 gün)
6. Banka hesabı açılışı (7-14 gün)

## Adım 4: Maliyet Dökümü

Toplam maliyet yaklaşık $4,200 - $8,000 arasında değişmektedir.`,
    contentId: `## Memahami PT PMA

PT PMA adalah badan hukum yang memungkinkan warga negara asing untuk memiliki dan mengoperasikan bisnis di Indonesia. Sejak implementasi UU Cipta Kerja pada 2020, prosesnya telah disederhanakan melalui sistem OSS.

## Langkah 1: Pilih Kegiatan Usaha (Kode KBLI)

Setiap bisnis di Indonesia harus diklasifikasikan dalam sistem KBLI. Kode KBLI Anda menentukan izin yang diperlukan.

## Langkah 2: Siapkan Dokumen

**Untuk perusahaan:** Nama perusahaan, alamat bisnis di Indonesia, akta pendirian, kode KBLI.

## Langkah 3: Proses Pendaftaran

1. Reservasi nama via AHU Online (1-2 hari)
2. Akta Pendirian oleh notaris (3-5 hari)
3. Persetujuan Kemenkumham (7-14 hari)
4. Pendaftaran pajak — NPWP (3-5 hari)
5. Pendaftaran OSS — NIB dan izin usaha (1-3 hari)

## Langkah 4: Rincian Biaya

Total biaya berkisar antara $4,200 - $8,000.`,
    contentRu: `## Понимание PT PMA

PT PMA — это юридическое лицо, позволяющее иностранным гражданам владеть и управлять бизнесом в Индонезии. С момента принятия Закона о создании рабочих мест в 2020 году процесс значительно упрощён через систему OSS.

## Шаг 1: Выберите вид деятельности (код KBLI)

Каждый бизнес в Индонезии должен быть классифицирован по системе KBLI.

## Шаг 2: Подготовьте документы

Для компании: название, адрес в Индонезии, учредительный акт, код KBLI.

## Шаг 3: Процесс регистрации

1. Резервирование названия через AHU Online (1-2 дня)
2. Учредительный акт у нотариуса (3-5 дней)
3. Одобрение Министерства юстиции (7-14 дней)
4. Налоговая регистрация (3-5 дней)
5. Регистрация OSS (1-3 дня)

## Шаг 4: Расходы

Общая стоимость составляет от $4,200 до $8,000.`,
    category: "legal-tax",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop",
    author: "BaseOne Bali Legal Team",
    publishedAt: "2026-01-28",
    metaTitle: "PT PMA Setup Indonesia 2026 | Step by Step Guide",
    metaDescription: "Step-by-step guide to setting up a PT PMA company in Indonesia. Costs, documents, timeline, and KBLI codes explained.",
  },
  {
    slug: "bali-real-estate-market-trends-2026",
    title: "Bali Real Estate Market Trends 2026",
    titleTr: "Bali Gayrimenkul Piyasası Trendleri 2026",
    titleId: "Tren Pasar Properti Bali 2026",
    titleRu: "Тренды рынка недвижимости Бали 2026",
    excerpt: "Analysis of Bali's property market in 2026 — price trends, hottest areas, rental yields, and what investors should watch for.",
    excerptTr: "2026'da Bali gayrimenkul piyasası analizi — fiyat trendleri, en popüler bölgeler, kira getirileri ve yatırımcıların dikkat etmesi gerekenler.",
    excerptId: "Analisis pasar properti Bali 2026 — tren harga, area terpanas, yield sewa, dan hal yang harus diperhatikan investor.",
    excerptRu: "Анализ рынка недвижимости Бали в 2026 году — ценовые тренды, популярные районы, доходность аренды.",
    content: `## Market Overview

Bali's real estate market has shown remarkable resilience and growth, with property values in prime locations increasing 12-18% year-over-year in 2025. The combination of returning tourism, digital nomad demand, and infrastructure development continues to drive the market upward.

## Price Trends by Area

**Canggu:** Land prices have reached $250-400/m² for leasehold, up from $150-250/m² just three years ago. Villa rental yields average 8-12% annually, with premium properties achieving 15%+.

**Seminyak:** The most established market with land at $350-600/m². Rental yields are stable at 7-10%, with commercial properties performing better at 12-15%.

**Ubud:** Still relatively affordable at $100-200/m² for land. The wellness tourism boom has pushed villa yields to 10-14%, particularly for retreat-style properties.

**Uluwatu:** The fastest-growing area with land prices doubling in 5 years to $200-350/m². Clifftop villas command premium rents with yields of 10-15%.

## Rental Market Analysis

The short-term rental market (Airbnb, Booking.com) remains strong with average occupancy rates of 70-85% in prime areas during peak season. Monthly rental demand from digital nomads has created a stable year-round income stream, with 1-bedroom villas renting for $800-2,000/month and 3-bedroom properties at $2,500-6,000/month.

## Investment Outlook

The outlook for 2026 remains positive. Key drivers include Indonesia's Golden Visa program attracting high-net-worth individuals, continued infrastructure investment (new toll roads, airport expansion plans), and Bali's positioning as a premium remote work destination. Investors should focus on areas with strong infrastructure development and proximity to lifestyle amenities.`,
    contentTr: `## Piyasa Genel Bakış

Bali gayrimenkul piyasası dikkat çekici bir dayanıklılık ve büyüme göstermiştir. Prime lokasyonlardaki mülk değerleri 2025'te yıllık %12-18 artış kaydetmiştir.

## Bölgelere Göre Fiyat Trendleri

**Canggu:** Arsa fiyatları kiralık için 250-400$/m²'ye ulaşmıştır. Villa kira getirileri yıllık ortalama %8-12'dir.

**Seminyak:** En köklü piyasa, arsa 350-600$/m². Kira getirileri %7-10 arasında stabildir.

**Ubud:** Hala nispeten uygun fiyatlı, arsa 100-200$/m². Wellness turizm patlaması villa getirilerini %10-14'e çıkarmıştır.

**Uluwatu:** En hızlı büyüyen bölge, arsa fiyatları 5 yılda ikiye katlanarak 200-350$/m²'ye ulaşmıştır.

## 2026 Yatırım Görünümü

2026 görünümü olumlu olmaya devam etmektedir. Temel itici güçler arasında Golden Visa programı, altyapı yatırımları ve Bali'nin premium uzaktan çalışma destinasyonu olarak konumlanması yer almaktadır.`,
    contentId: `## Gambaran Pasar

Pasar properti Bali menunjukkan ketahanan dan pertumbuhan yang luar biasa, dengan nilai properti di lokasi premium meningkat 12-18% year-over-year pada 2025.

## Tren Harga per Area

**Canggu:** Harga tanah mencapai $250-400/m² untuk leasehold. Yield sewa villa rata-rata 8-12% per tahun.

**Seminyak:** Pasar paling mapan dengan tanah di $350-600/m². Yield sewa stabil di 7-10%.

**Ubud:** Masih relatif terjangkau di $100-200/m². Boom wellness tourism mendorong yield villa ke 10-14%.

**Uluwatu:** Area dengan pertumbuhan tercepat, harga tanah berlipat ganda dalam 5 tahun.

## Prospek Investasi 2026

Prospek 2026 tetap positif dengan program Golden Visa dan investasi infrastruktur yang berkelanjutan.`,
    contentRu: `## Обзор рынка

Рынок недвижимости Бали демонстрирует замечательную устойчивость и рост, с увеличением стоимости недвижимости в премиальных локациях на 12-18% в годовом исчислении.

## Ценовые тренды по районам

**Чангу:** Цены на землю достигли $250-400/м². Доходность аренды вилл составляет 8-12% годовых.

**Семиньяк:** Наиболее устоявшийся рынок с ценами на землю $350-600/м².

**Убуд:** Относительно доступный район с ценами $100-200/м².

**Улувату:** Самый быстрорастущий район с удвоением цен за 5 лет.

## Инвестиционный прогноз на 2026

Прогноз на 2026 год остаётся позитивным благодаря программе Golden Visa и инвестициям в инфраструктуру.`,
    category: "real-estate",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=400&fit=crop",
    author: "BaseOne Bali Research",
    publishedAt: "2026-02-01",
    metaTitle: "Bali Real Estate Trends 2026 | Property Market Analysis",
    metaDescription: "Comprehensive analysis of Bali's real estate market in 2026. Price trends, rental yields, and investment outlook for foreign investors.",
  },
  {
    slug: "understanding-indonesian-tax-system-foreign-investors",
    title: "Understanding Indonesian Tax System for Foreign Investors",
    titleTr: "Yabancı Yatırımcılar İçin Endonezya Vergi Sistemini Anlamak",
    titleId: "Memahami Sistem Pajak Indonesia untuk Investor Asing",
    titleRu: "Понимание налоговой системы Индонезии для иностранных инвесторов",
    excerpt: "A comprehensive overview of Indonesia's tax obligations for foreign investors — PPN, PPh, withholding taxes, and tax treaty benefits.",
    excerptTr: "Yabancı yatırımcılar için Endonezya vergi yükümlülüklerinin kapsamlı bir genel bakışı — PPN, PPh, stopaj vergileri ve vergi anlaşması avantajları.",
    excerptId: "Gambaran lengkap kewajiban pajak Indonesia untuk investor asing — PPN, PPh, pajak pemotongan, dan manfaat perjanjian pajak.",
    excerptRu: "Полный обзор налоговых обязательств Индонезии для иностранных инвесторов — PPN, PPh, удерживаемые налоги и преимущества налоговых соглашений.",
    content: `## Tax Overview for Foreign Investors

Indonesia's tax system can seem complex, but understanding the key components is essential for any foreign investor. The main taxes you'll encounter are PPN (Value Added Tax), PPh (Income Tax), and various withholding taxes.

## PPN (Pajak Pertambahan Nilai) — Value Added Tax

As of 2025, the standard PPN rate is **11%**, applicable to most goods and services. This is equivalent to VAT in European countries. Key points:

- Businesses with annual turnover exceeding IDR 4.8 billion must register as PKP (Taxable Entrepreneur)
- PPN is charged on sales and can be offset against PPN paid on purchases (input tax credit)
- Certain items are exempt: basic necessities, medical services, educational services, and financial services

## PPh (Pajak Penghasilan) — Income Tax

**Corporate Income Tax (PPh Badan):** The standard rate is **22%** for companies. Small and medium enterprises with annual turnover up to IDR 50 billion receive a 50% discount on the first IDR 4.8 billion of taxable income.

**Personal Income Tax (PPh Orang Pribadi):** Progressive rates from 5% to 35% based on annual income brackets.

**Withholding Taxes:**
- PPh 21: Employee salary withholding (progressive rates)
- PPh 23: Service payments to residents (2-15%)
- PPh 26: Payments to non-residents (20%, reduced by tax treaties)
- PPh 4(2): Final tax on rental income (10%), construction services (2-6%)

## Tax Treaty Benefits

Indonesia has tax treaties with over 70 countries. These treaties can significantly reduce withholding tax rates on dividends, interest, and royalties. For example, the Indonesia-Turkey treaty reduces dividend withholding to 10-15%.

## Practical Tips

1. Register for NPWP (tax ID) immediately upon company establishment
2. File monthly tax returns (SPT Masa) by the 20th of the following month
3. File annual tax returns (SPT Tahunan) by April 30th
4. Keep all receipts and invoices for at least 10 years
5. Work with a qualified tax consultant familiar with foreign investment regulations`,
    contentTr: `## Yabancı Yatırımcılar İçin Vergi Genel Bakışı

Endonezya vergi sistemi karmaşık görünebilir, ancak temel bileşenleri anlamak her yabancı yatırımcı için önemlidir. Karşılaşacağınız ana vergiler PPN (KDV), PPh (Gelir Vergisi) ve çeşitli stopaj vergileridir.

## PPN — Katma Değer Vergisi

2025 itibarıyla standart PPN oranı **%11**'dir. Yıllık cirosu 4,8 milyar IDR'yi aşan işletmeler PKP olarak kayıt yaptırmalıdır.

## PPh — Gelir Vergisi

**Kurumlar Vergisi:** Standart oran **%22**'dir. KOBİ'ler için ilk 4,8 milyar IDR'lik vergilendirilebilir gelirde %50 indirim uygulanır.

## Vergi Anlaşması Avantajları

Endonezya'nın 70'den fazla ülkeyle vergi anlaşması bulunmaktadır. Türkiye-Endonezya anlaşması temettü stopajını %10-15'e düşürmektedir.`,
    contentId: `## Gambaran Pajak untuk Investor Asing

Sistem pajak Indonesia mungkin terlihat kompleks, namun memahami komponen utamanya sangat penting. Pajak utama yang akan Anda temui adalah PPN, PPh, dan berbagai pajak pemotongan.

## PPN — Pajak Pertambahan Nilai

Tarif PPN standar adalah **11%**. Usaha dengan omzet tahunan melebihi IDR 4,8 miliar wajib mendaftar sebagai PKP.

## PPh — Pajak Penghasilan

**PPh Badan:** Tarif standar **22%**. UMKM mendapat diskon 50% untuk IDR 4,8 miliar pertama.

## Manfaat Perjanjian Pajak

Indonesia memiliki perjanjian pajak dengan lebih dari 70 negara yang dapat mengurangi tarif pajak pemotongan secara signifikan.`,
    contentRu: `## Обзор налогов для иностранных инвесторов

Налоговая система Индонезии может показаться сложной, но понимание ключевых компонентов необходимо. Основные налоги: PPN (НДС), PPh (подоходный налог) и различные удерживаемые налоги.

## PPN — Налог на добавленную стоимость

Стандартная ставка PPN составляет **11%**. Предприятия с годовым оборотом свыше 4,8 миллиарда IDR обязаны зарегистрироваться как PKP.

## PPh — Подоходный налог

**Корпоративный налог:** Стандартная ставка **22%**. МСП получают скидку 50% на первые 4,8 миллиарда IDR.

## Преимущества налоговых соглашений

Индонезия имеет налоговые соглашения с более чем 70 странами.`,
    category: "legal-tax",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    author: "BaseOne Bali Tax Advisory",
    publishedAt: "2026-02-05",
    metaTitle: "Indonesian Tax Guide for Foreign Investors 2026",
    metaDescription: "Complete guide to Indonesian taxes for foreign investors. PPN, PPh, withholding taxes, and tax treaty benefits explained.",
  },
  {
    slug: "best-areas-invest-bali-canggu-seminyak-ubud",
    title: "Best Areas to Invest in Bali: Canggu vs Seminyak vs Ubud",
    titleTr: "Bali'de Yatırım İçin En İyi Bölgeler: Canggu vs Seminyak vs Ubud",
    titleId: "Area Terbaik untuk Investasi di Bali: Canggu vs Seminyak vs Ubud",
    titleRu: "Лучшие районы для инвестиций на Бали: Чангу vs Семиньяк vs Убуд",
    excerpt: "A detailed comparison of Bali's top investment areas — demographics, property prices, rental yields, and which sectors thrive in each location.",
    excerptTr: "Bali'nin en iyi yatırım bölgelerinin detaylı karşılaştırması — demografi, mülk fiyatları, kira getirileri ve her lokasyonda hangi sektörlerin geliştiği.",
    excerptId: "Perbandingan detail area investasi terbaik di Bali — demografi, harga properti, yield sewa, dan sektor yang berkembang di setiap lokasi.",
    excerptRu: "Детальное сравнение лучших инвестиционных районов Бали — демография, цены на недвижимость, доходность аренды.",
    content: `## The Big Three: Canggu, Seminyak, and Ubud

When it comes to investing in Bali, three areas consistently top the list for foreign investors. Each offers a distinct character, demographic, and investment profile. Understanding these differences is crucial for making the right investment decision.

## Canggu: The Digital Nomad Capital

**Demographics:** Young professionals (25-40), digital nomads, surfers, health-conscious entrepreneurs
**Vibe:** Trendy, fast-growing, surf culture meets startup culture

**Investment Highlights:**
- Land prices: $250-400/m² (leasehold)
- Villa rental yield: 8-12% annually
- Best sectors: Cafes, co-working spaces, boutique hotels, surf schools
- Growth rate: 15-20% annual property appreciation

Canggu has transformed from a quiet surf village to Bali's most dynamic neighborhood. The area around Batu Bolong, Berawa, and Pererenan offers the highest concentration of digital nomads and young professionals. The key risk is overdevelopment — infrastructure hasn't kept pace with growth, leading to traffic congestion.

## Seminyak: Established Luxury

**Demographics:** Affluent tourists (30-55), luxury travelers, established expats
**Vibe:** Sophisticated, nightlife-oriented, high-end retail

**Investment Highlights:**
- Land prices: $350-600/m² (leasehold)
- Villa rental yield: 7-10% annually
- Best sectors: Fine dining, luxury retail, beach clubs, spas
- Growth rate: 8-12% annual property appreciation

Seminyak is Bali's most mature market with established infrastructure, premium dining, and world-class beach clubs. The area commands higher prices but offers more predictable returns. Eat Street (Jl. Kayu Aya) and the beach club strip remain prime commercial locations.

## Ubud: Cultural & Wellness Hub

**Demographics:** Wellness seekers (30-60), yoga practitioners, art enthusiasts, spiritual tourists
**Vibe:** Peaceful, cultural, nature-immersed, spiritual

**Investment Highlights:**
- Land prices: $100-200/m² (leasehold)
- Villa rental yield: 10-14% annually
- Best sectors: Retreat centers, wellness spas, organic restaurants, art galleries
- Growth rate: 10-15% annual property appreciation

Ubud offers the best value proposition with lower entry costs and strong yields driven by the global wellness tourism trend. The Tegallalang rice terrace area and Ubud center are prime locations. The main advantage is lower competition and a loyal, returning visitor base.

## Comparison Table

| Factor | Canggu | Seminyak | Ubud |
|--------|--------|----------|------|
| Entry Cost | Medium | High | Low |
| Rental Yield | 8-12% | 7-10% | 10-14% |
| Growth Rate | 15-20% | 8-12% | 10-15% |
| Competition | High | Very High | Medium |
| Infrastructure | Developing | Established | Basic |
| Best For | Tech/F&B | Luxury/Retail | Wellness/Culture |`,
    contentTr: `## Büyük Üçlü: Canggu, Seminyak ve Ubud

Bali'de yatırım söz konusu olduğunda, üç bölge sürekli olarak yabancı yatırımcılar için listenin başında yer almaktadır.

## Canggu: Dijital Göçebe Başkenti

Canggu, sessiz bir sörf köyünden Bali'nin en dinamik mahallesine dönüşmüştür. Arsa fiyatları 250-400$/m², villa kira getirisi yıllık %8-12.

## Seminyak: Yerleşik Lüks

Seminyak, Bali'nin en olgun piyasasıdır. Arsa fiyatları 350-600$/m², kira getirisi %7-10.

## Ubud: Kültür & Wellness Merkezi

Ubud, düşük giriş maliyetleri ve güçlü getirilerle en iyi değer teklifini sunmaktadır. Arsa fiyatları 100-200$/m², kira getirisi %10-14.`,
    contentId: `## Tiga Besar: Canggu, Seminyak, dan Ubud

Ketika berbicara tentang investasi di Bali, tiga area secara konsisten menduduki peringkat teratas untuk investor asing.

## Canggu: Ibukota Digital Nomad

Canggu telah bertransformasi dari desa surfing yang tenang menjadi lingkungan paling dinamis di Bali. Harga tanah $250-400/m², yield sewa villa 8-12% per tahun.

## Seminyak: Kemewahan yang Mapan

Seminyak adalah pasar paling matang di Bali. Harga tanah $350-600/m², yield sewa 7-10%.

## Ubud: Hub Budaya & Wellness

Ubud menawarkan proposisi nilai terbaik dengan biaya masuk lebih rendah. Harga tanah $100-200/m², yield sewa 10-14%.`,
    contentRu: `## Большая тройка: Чангу, Семиньяк и Убуд

Когда речь идёт об инвестициях на Бали, три района стабильно возглавляют список для иностранных инвесторов.

## Чангу: Столица цифровых кочевников

Чангу превратился из тихой деревни сёрферов в самый динамичный район Бали. Цены на землю $250-400/м², доходность аренды вилл 8-12%.

## Семиньяк: Устоявшаяся роскошь

Семиньяк — наиболее зрелый рынок Бали. Цены на землю $350-600/м², доходность аренды 7-10%.

## Убуд: Культурный и велнес-центр

Убуд предлагает лучшее соотношение цены и качества. Цены на землю $100-200/м², доходность аренды 10-14%.`,
    category: "real-estate",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=400&fit=crop",
    author: "BaseOne Bali Research",
    publishedAt: "2026-02-08",
    metaTitle: "Best Areas to Invest in Bali 2026 | Canggu vs Seminyak vs Ubud",
    metaDescription: "Compare Bali's top investment areas: Canggu, Seminyak, and Ubud. Property prices, rental yields, and best sectors for each location.",
  },
  {
    slug: "kitas-vs-kitap-visa-guide-bali",
    title: "KITAS vs KITAP: Which Visa Do You Need for Bali?",
    titleTr: "KITAS vs KITAP: Bali İçin Hangi Vizeye İhtiyacınız Var?",
    titleId: "KITAS vs KITAP: Visa Mana yang Anda Butuhkan untuk Bali?",
    titleRu: "KITAS vs KITAP: Какая виза нужна для Бали?",
    excerpt: "Complete guide to Indonesian visa types for investors and business owners — KITAS, KITAP, B211A, and the new Golden Visa program.",
    excerptTr: "Yatırımcılar ve işletme sahipleri için Endonezya vize türlerinin tam rehberi — KITAS, KITAP, B211A ve yeni Golden Visa programı.",
    excerptId: "Panduan lengkap jenis visa Indonesia untuk investor dan pemilik bisnis — KITAS, KITAP, B211A, dan program Golden Visa baru.",
    excerptRu: "Полное руководство по типам виз Индонезии для инвесторов — KITAS, KITAP, B211A и новая программа Golden Visa.",
    content: `## Visa Types for Foreign Investors in Bali

Choosing the right visa is one of the first decisions you'll make as a foreign investor in Bali. The wrong choice can lead to legal complications, while the right one provides stability and flexibility for your business operations.

## KITAS (Kartu Izin Tinggal Terbatas) — Limited Stay Permit

KITAS is the most common visa for foreign investors and workers in Indonesia. It provides a temporary residence permit valid for 1-2 years, renewable.

**Types of KITAS:**
- **Investor KITAS:** For directors/commissioners of PT PMA companies
- **Worker KITAS (IMTA):** For foreign employees with work permits
- **Spouse KITAS:** For those married to Indonesian citizens

**Requirements:**
- Valid passport (minimum 18 months validity)
- Sponsor letter from your PT PMA company
- RPTKA (Foreign Worker Utilization Plan) approval
- Company documents (NIB, NPWP, domicile letter)

**Cost:** $1,200 - $1,800 (including agent fees)
**Processing time:** 4-8 weeks

## KITAP (Kartu Izin Tinggal Tetap) — Permanent Stay Permit

KITAP is the permanent residence permit, available after holding KITAS for 4+ consecutive years. It's valid for 5 years and renewable indefinitely.

**Eligibility:**
- 4+ consecutive years on KITAS
- Clean immigration record
- Proof of income/investment
- Basic Indonesian language proficiency (recommended)

**Cost:** $2,000 - $3,000
**Processing time:** 2-3 months

## Golden Visa

Indonesia's Golden Visa program, launched in 2024, offers a fast-track to long-term residency for high-net-worth individuals and investors.

**Categories:**
- **5-year stay:** Investment of $350,000 in government bonds or $2.5 million in a company
- **10-year stay:** Investment of $700,000 in government bonds or $5 million in a company

**Benefits:**
- No need for KITAS/KITAP process
- Multiple entry
- Work permit included
- Family members eligible

## B211A — Business Visit Visa

For those exploring investment opportunities before committing, the B211A visa allows a 60-day stay (extendable to 180 days). It does not permit employment but allows business meetings, property viewing, and market research.

**Cost:** $200 - $500
**Processing time:** 3-5 business days

## Recommendation

For most foreign investors setting up a PT PMA in Bali, the recommended path is: B211A (exploration) → Investor KITAS (establishment) → KITAP (long-term). The Golden Visa is ideal for high-net-worth investors seeking immediate long-term residency.`,
    contentTr: `## Bali'deki Yabancı Yatırımcılar İçin Vize Türleri

Doğru vizeyi seçmek, Bali'de yabancı yatırımcı olarak vereceğiniz ilk kararlardan biridir.

## KITAS — Sınırlı İkamet İzni

KITAS, Endonezya'daki yabancı yatırımcılar ve çalışanlar için en yaygın vizedir. 1-2 yıl geçerli, yenilenebilir.

**Maliyet:** $1,200 - $1,800
**İşlem süresi:** 4-8 hafta

## KITAP — Kalıcı İkamet İzni

KITAP, 4+ yıl ardışık KITAS sahibi olduktan sonra alınabilir. 5 yıl geçerli, süresiz yenilenebilir.

## Golden Visa

Endonezya'nın Golden Visa programı, yüksek net değerli bireyler ve yatırımcılar için hızlı uzun vadeli ikamet imkanı sunmaktadır.

## Öneri

Çoğu yabancı yatırımcı için önerilen yol: B211A → Yatırımcı KITAS → KITAP şeklindedir.`,
    contentId: `## Jenis Visa untuk Investor Asing di Bali

Memilih visa yang tepat adalah salah satu keputusan pertama yang akan Anda buat sebagai investor asing di Bali.

## KITAS — Izin Tinggal Terbatas

KITAS adalah visa paling umum untuk investor dan pekerja asing di Indonesia. Berlaku 1-2 tahun, dapat diperpanjang.

**Biaya:** $1,200 - $1,800
**Waktu proses:** 4-8 minggu

## KITAP — Izin Tinggal Tetap

KITAP tersedia setelah memegang KITAS selama 4+ tahun berturut-turut. Berlaku 5 tahun.

## Golden Visa

Program Golden Visa Indonesia menawarkan jalur cepat untuk residensi jangka panjang bagi investor.

## Rekomendasi

Jalur yang direkomendasikan: B211A → KITAS Investor → KITAP.`,
    contentRu: `## Типы виз для иностранных инвесторов на Бали

Выбор правильной визы — одно из первых решений для иностранного инвестора на Бали.

## KITAS — Разрешение на временное проживание

KITAS — наиболее распространённая виза для иностранных инвесторов. Действует 1-2 года, продлевается.

**Стоимость:** $1,200 - $1,800
**Срок оформления:** 4-8 недель

## KITAP — Разрешение на постоянное проживание

KITAP доступен после 4+ лет непрерывного KITAS. Действует 5 лет.

## Golden Visa

Программа Golden Visa Индонезии предлагает ускоренный путь к долгосрочному проживанию для инвесторов.

## Рекомендация

Рекомендуемый путь: B211A → KITAS Инвестора → KITAP.`,
    category: "legal-tax",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&h=400&fit=crop",
    author: "BaseOne Bali Immigration",
    publishedAt: "2026-02-10",
    metaTitle: "KITAS vs KITAP Bali 2026 | Complete Visa Guide for Investors",
    metaDescription: "Complete guide to Indonesian visas for investors: KITAS, KITAP, Golden Visa, and B211A. Requirements, costs, and processing times.",
  },
];
