/**
 * Mock Property Data — Realistic Bali Real Estate Listings
 * 15 properties across 5 types and 8 regions
 */

export type PropertyType = "villa" | "commercial" | "office" | "land" | "warehouse";
export type ListingType = "rent" | "sale";
export type Region = "canggu" | "seminyak" | "ubud" | "uluwatu" | "nusa-dua" | "sanur" | "denpasar" | "kuta";

export interface Property {
  id: string;
  title: string;
  titleId: string; // Indonesian
  type: PropertyType;
  listingType: ListingType;
  region: Region;
  priceUSD: number;
  priceIDR: number;
  priceLabel: string; // "/month" or "" for sale
  area: number; // m²
  bedrooms?: number;
  bathrooms?: number;
  image: string;
  images: string[];
  description: string;
  descriptionId: string;
  features: string[];
  featuresId: string[];
  nearbyPlaces: string[];
  yearBuilt?: number;
  leaseYears?: number; // for leasehold
  furnished?: boolean;
  parking?: number;
  pool?: boolean;
  coordinates: { lat: number; lng: number };
}

// CDN image URLs
const IMG = {
  villa1: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663358289825/NRKMfBnxaEjmOhTx.jpg?Expires=1802710733&Signature=J9oHAAqNO2etSXDGot8ekbLlbsiTs28DbjkTnBJP6FEKW1BHo41U2-lqjjoWu4VCc5wCAhNKFmxYWL~gnTIEtd83IhIkjdkO7klKEhYghish-g-19is6INc1GCO4aFPmE7BCL7RAT2nZzeC-6hRotMYbMfjWk9JNPdZolkM6AIjr39IrFoTZ2hmDaSb6GhLirHqTqHlEpc6zArjTypDo6HaaSvABsZ2SRPKr3dcdZ7PgYcIttMI-gdPV1mvHLDfIIQqv~NbYP1f2qQRhugvFczKC3pXb6P5LTMf~FIdnbpmYXT4LYzuMwmxQxAO3MkmLSODaLaAtJiSz-v8K7KAxzA__&Key-Pair-Id=K2HSFNDJXOU9YS",
  villa2: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663358289825/DZfWMhqnVAOZhJaK.jpg?Expires=1802710733&Signature=pYg8iknOPfsOqddh0FC5nBATEfR~aiBOTHM5QpTNb-uEeWkLYdn2S6B~NTaHE1uvkH~AN6P-XSkv-0BbxLrWvpXs4ilBPZDkwhp4IW1jWyaI1volmoaf7aoZXCeExq7tAISEd8j4Jfm5a1RIr3azC6~2EPFTIDOcgZT6Dm1wNbgWeMJodbx-gC39pnGUqJeFIyfTVEIycXAfSldjINRTZYIXhic2eft1hmdDuhqrmZP4nH-k65f19y24AirCCYZAf8ajkJtCl2InXNPPplRYZ8P84n7D2q-YxJW1MTKM94rsEyWBuWhkpCIUOLAsZemqteEJFELus9Fp8eOqHtuLjA__&Key-Pair-Id=K2HSFNDJXOU9YS",
  villa3: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663358289825/WGxvenZrfjxslPxj.jpg?Expires=1802710733&Signature=r~80XMS4OSmrco3TVXxM-ytHMZR6CTOvC2JeBXI75NgD4MAV9HqTKybTSaz8kw1xZzrbcJjY8AG5zjy3LUwoc2i5OUZRckrzMo7jfcKp2By7VNsKMCyhYdAp0iY~LPEBfjOzxHSxXFYmW~L4ANa3dwqJvxWRaj074Oeee5MVQWmStGiKRVTg4INeiJHVvbXW88aLE1WPXfn2yYWC~zw4UBnqhIpyXfP0RVLb5NLZe7ZnJQfL2AYKWEpUrR-Wirb3qMfqxaUXs4NfBclrppC5ctKC0WbLpLXbJsv-hBNUFHzsW1faP60q-4h223W6pjNJzN83fufCE-ZJzNxTJSm0vQ__&Key-Pair-Id=K2HSFNDJXOU9YS",
  restaurant: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663358289825/JcAGiSJbYwUKROXA.jpg?Expires=1802710734&Signature=LQjtAl4bOgwU8qM~~EUfAST7u4NSqBnb4FBx~UUlVWEqwGnjzYFfQsrdJ2xicio3A8nLXm5MNykOuKbDsuWY5XbnH7cTWSgzLxTMln6VuN5kILg6-ZHOexC96h78-kt1NiTGC~PoB1BoH8RBgew53zqzz2UYe-~3dZz2EP5BpwGYloxIFDGp~PATBgLKDer9Nj~waEs368F-6nNYjqWjRmVL~kSK8tm0I0PMgyGotXJ7dEwvk5kZ6nN692-DUarzdmMLGDhssDQOwEW6fTwXWPwIbs807yZrdv0VEEBcfiwiSp2iWu3mBZw3mj71IxAk--2ZDZQwpNCIaeXpd7EiWQ__&Key-Pair-Id=K2HSFNDJXOU9YS",
  cafe: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663358289825/ORViDWDahizCeVEc.jpg?Expires=1802710734&Signature=a9K4-9f38HCU8SMeuhtbGTbhmv1Rqjkw-pyufuYDKvlOI7SzeGrycM40-fCcH0LWqIqUEy-i6u0BNw6bUm2Pi1VYybAjp197FhuaVp97zzhmhvG26e7jhBVzFiyUx5fWBQdymO6vb4zuBLjICd250o0nlvtDSe0h~lYx2XlLzmcTcnGVkMlrJ~DMMy2ccQaWiPpoaZajkFsXcpgNtILLsOgEES54TK3U4IrYCuFDCme9qd8H7uT5eWqmG-Q~z5wN48OY-MlCW2gJl6yjLf7rgwB~lpjsL-h4zG~kEXPbIEI-2whYWu5D9V0CkHakYmIglUT1snBbCPnYFdwGqX0Fzg__&Key-Pair-Id=K2HSFNDJXOU9YS",
  coworking: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663358289825/DTqoKwGXDGQNVWdf.png?Expires=1802710733&Signature=VC2LFN8CS3362L3ePWyoZ~lMG~0KiESF6XSIno1yqamD2k32LqwIW0PpfJvT8OgILZH~uW9qX4Y8CN2uPP97vPosmaw6UDKzWNsfBDGYfGf9pwOUPSeQbjlDb6LJVGI3KGiGw9hYzBhbCqst5L1f7zJc1msWVgRCGnWLjpwQZF1CTg0yllqSIOTZsGn3NPCS2feLu1cw4U9w6NEowsfRh9wHXpLYyXj641vVWpwUmP2V8Sh-44gPkTP~xzAtncQfDl2eZRnBiBhCkapAmnR7fRhIJvOgq~VrMBAzbhjNxHc6W3YvjNnrX~c552lP81W0zD2HGno0FHN0YwhLGISBZg__&Key-Pair-Id=K2HSFNDJXOU9YS",
  office: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663358289825/gzfasBAQdiOMFnTU.jpg?Expires=1802710734&Signature=E1Mw2IFklI2SCLpMipJr~KDa~FSZytNYBFvWBeI1j8fuPhmckrqHI-KKDtpa6a5vjya5P5Od9wBp6-puRiho5lwKQtJ7~OPMJlQmZuY-uLAlp~6ysupzfEN7IosGMST5j4goBvQPXuNdbf8clNqEgrzbMm9DXogfqFs02zNQeySomyQPDmo13KWKox4z8l-WEXWWPHfK8mhpSnOZfVABTtRZEQKy6tvNiwm-500HpAvVbNSjEoAMqL5P8sHUYMspwPQmPDagp6WRxf8GnKI-tW2kbezIX8MVIFpgtSWu69JUHkFONnZeF3OhKKB8a69PJlo5MIsofPOGH9qBXUdRAg__&Key-Pair-Id=K2HSFNDJXOU9YS",
  land: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663358289825/qHkMhBySGHSJYiya.jpg?Expires=1802710734&Signature=lDbRxHMLfgE9ycf50RMJFDjH2WQQCD8-683SAlEbDum9tjRSoHFZZKn5m3cGMaQwXGDuWtHwHQ3eEGp4gXkkjBXZiGU3hBXbO428tQUPdE1KXxCuhn3v52B6tvusLaqNRrGJ1Q2pTzwF77GJFL-fdHLo7B4rXDpMeDqa0eLhMBsZY9cO~YzcJC5FzgmXtwLVRaSq5wqb1j0jk~KY1X4azytKabQqU2OezwwqIhshPYn5BymD6KAiswEoc9-Hbv-8GjJdRmfmdilL-fcxKrtspxB3LoshXGujnySfzfSejHP-eyDDdD~av-ktcvmYkBdos6ejQtUCMjKDXWBVqvSanw__&Key-Pair-Id=K2HSFNDJXOU9YS",
  warehouse: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663358289825/pblpLlvPwCVkRUpt.jpg?Expires=1802710734&Signature=IvkTNVlANsdcSVC4vR2PfuNt0ADjAyDF-D7CzgqIW~c-rYt8Lprowmpgan8eOThxdof0UBgXS4iuUWg3txsuI9M~z5sKR0~fpD~X3mTTeeH~7NQ144xLTes0PY~hqjTjxKCQXRrISL55duOGr6kqmmxR5S-8im2LrtyRui2dGQJFUlsExGXdkobVmw247WPyETjc1acx30clrVWFK01Usw0kJDguT-5uLnPJI2sEJP1~rSSWr2kWSWbRKekki8Vh2jzOwi~hEaYVR7l4hNU4kiTQSVnAOb-RBis3dVDfsRzRs3~AsTBwA~zVzhM2jGSKfYpDARiCc-~qzGwDjgmvlA__&Key-Pair-Id=K2HSFNDJXOU9YS",
};

export const PROPERTIES: Property[] = [
  // === VILLAS ===
  {
    id: "villa-canggu-modern",
    title: "Modern Minimalist Villa with Pool — Canggu",
    titleId: "Villa Modern Minimalis dengan Kolam — Canggu",
    type: "villa",
    listingType: "rent",
    region: "canggu",
    priceUSD: 2800,
    priceIDR: 44200000,
    priceLabel: "/month",
    area: 250,
    bedrooms: 3,
    bathrooms: 3,
    image: IMG.villa1,
    images: [IMG.villa1, IMG.villa2, IMG.villa3],
    description: "Stunning modern villa in the heart of Canggu, just 5 minutes from Echo Beach. Open-plan living with floor-to-ceiling windows, private infinity pool, and a rooftop terrace with rice field views. Fully furnished with premium appliances and high-speed fiber internet. Perfect for digital nomads or families seeking a tropical lifestyle.",
    descriptionId: "Villa modern yang menakjubkan di jantung Canggu, hanya 5 menit dari Echo Beach. Ruang tamu terbuka dengan jendela dari lantai ke langit-langit, kolam renang infinity pribadi, dan teras atap dengan pemandangan sawah. Dilengkapi sepenuhnya dengan peralatan premium dan internet fiber berkecepatan tinggi.",
    features: ["Private infinity pool", "Rooftop terrace", "Fiber internet 100Mbps", "Fully furnished", "Air conditioning", "Security 24/7", "Parking 2 cars", "Garden"],
    featuresId: ["Kolam renang infinity pribadi", "Teras atap", "Internet fiber 100Mbps", "Fully furnished", "AC", "Keamanan 24/7", "Parkir 2 mobil", "Taman"],
    nearbyPlaces: ["Echo Beach (5 min)", "Batu Bolong (8 min)", "Finns Beach Club (10 min)", "Canggu Shortcut (3 min)"],
    yearBuilt: 2023,
    furnished: true,
    parking: 2,
    pool: true,
    coordinates: { lat: -8.6478, lng: 115.1385 },
  },
  {
    id: "villa-seminyak-luxury",
    title: "Luxury Tropical Villa — Seminyak",
    titleId: "Villa Tropis Mewah — Seminyak",
    type: "villa",
    listingType: "sale",
    region: "seminyak",
    priceUSD: 385000,
    priceIDR: 6080000000,
    priceLabel: "",
    area: 400,
    bedrooms: 4,
    bathrooms: 4,
    image: IMG.villa2,
    images: [IMG.villa2, IMG.villa1, IMG.villa3],
    description: "Exquisite 4-bedroom luxury villa in prime Seminyak location. Balinese-modern architecture with lush tropical gardens, large swimming pool, and outdoor living pavilion. Walking distance to Seminyak Beach, Ku De Ta, and Potato Head. 25-year leasehold with extension option. Ideal investment property with proven rental income of $4,500/month.",
    descriptionId: "Villa mewah 4 kamar tidur di lokasi utama Seminyak. Arsitektur Bali-modern dengan taman tropis yang rimbun, kolam renang besar, dan paviliun outdoor. Jarak jalan kaki ke Pantai Seminyak, Ku De Ta, dan Potato Head. Hak sewa 25 tahun dengan opsi perpanjangan.",
    features: ["Large swimming pool", "Tropical garden", "Outdoor pavilion", "Staff quarters", "Laundry room", "Full kitchen", "Smart home system", "Gated compound"],
    featuresId: ["Kolam renang besar", "Taman tropis", "Paviliun outdoor", "Kamar staf", "Ruang laundry", "Dapur lengkap", "Sistem smart home", "Komplek berpagar"],
    nearbyPlaces: ["Seminyak Beach (7 min walk)", "Ku De Ta (10 min walk)", "Potato Head (12 min walk)", "Seminyak Square (5 min)"],
    yearBuilt: 2021,
    leaseYears: 25,
    furnished: true,
    parking: 3,
    pool: true,
    coordinates: { lat: -8.6845, lng: 115.1614 },
  },
  {
    id: "villa-ubud-retreat",
    title: "Traditional Balinese Retreat Villa — Ubud",
    titleId: "Villa Retreat Tradisional Bali — Ubud",
    type: "villa",
    listingType: "rent",
    region: "ubud",
    priceUSD: 1800,
    priceIDR: 28400000,
    priceLabel: "/month",
    area: 320,
    bedrooms: 2,
    bathrooms: 2,
    image: IMG.villa3,
    images: [IMG.villa3, IMG.villa1, IMG.villa2],
    description: "Charming traditional Balinese villa surrounded by rice terraces in Ubud. Hand-carved wooden details, open-air bathroom, and a serene private pool overlooking the jungle. Perfect for wellness retreats, yoga practitioners, or those seeking authentic Bali living. Includes a separate guest house and meditation pavilion.",
    descriptionId: "Villa tradisional Bali yang menawan dikelilingi sawah terasering di Ubud. Detail kayu ukiran tangan, kamar mandi terbuka, dan kolam renang pribadi yang tenang menghadap hutan. Termasuk rumah tamu terpisah dan paviliun meditasi.",
    features: ["Rice terrace views", "Private pool", "Meditation pavilion", "Guest house", "Open-air bathroom", "Hand-carved details", "Organic garden", "Yoga deck"],
    featuresId: ["Pemandangan sawah terasering", "Kolam renang pribadi", "Paviliun meditasi", "Rumah tamu", "Kamar mandi terbuka", "Detail ukiran tangan", "Kebun organik", "Deck yoga"],
    nearbyPlaces: ["Tegallalang Rice Terrace (10 min)", "Ubud Monkey Forest (15 min)", "Ubud Market (12 min)", "Yoga Barn (8 min)"],
    yearBuilt: 2019,
    furnished: true,
    parking: 1,
    pool: true,
    coordinates: { lat: -8.5069, lng: 115.2625 },
  },
  {
    id: "villa-uluwatu-cliff",
    title: "Clifftop Ocean View Villa — Uluwatu",
    titleId: "Villa Tebing Pemandangan Laut — Uluwatu",
    type: "villa",
    listingType: "sale",
    region: "uluwatu",
    priceUSD: 520000,
    priceIDR: 8210000000,
    priceLabel: "",
    area: 500,
    bedrooms: 5,
    bathrooms: 5,
    image: IMG.villa1,
    images: [IMG.villa1, IMG.villa3, IMG.villa2],
    description: "Breathtaking clifftop villa with panoramic Indian Ocean views in Uluwatu. Five en-suite bedrooms, infinity edge pool merging with the horizon, and a private path to a secluded beach. Premium finishes throughout with Italian marble, teak wood, and custom furniture. Proven Airbnb income of $8,000+/month in peak season.",
    descriptionId: "Villa tebing yang menakjubkan dengan pemandangan Samudra Hindia panoramik di Uluwatu. Lima kamar tidur en-suite, kolam renang infinity edge, dan jalur pribadi ke pantai terpencil. Pendapatan Airbnb terbukti $8,000+/bulan di musim puncak.",
    features: ["Panoramic ocean views", "Infinity edge pool", "Private beach access", "Italian marble", "Teak wood finishes", "Home cinema", "Wine cellar", "Helipad"],
    featuresId: ["Pemandangan laut panoramik", "Kolam infinity edge", "Akses pantai pribadi", "Marmer Italia", "Finishing kayu jati", "Home cinema", "Wine cellar", "Helipad"],
    nearbyPlaces: ["Uluwatu Temple (10 min)", "Single Fin (8 min)", "Padang Padang Beach (12 min)", "Sundays Beach Club (15 min)"],
    yearBuilt: 2022,
    leaseYears: 30,
    furnished: true,
    parking: 4,
    pool: true,
    coordinates: { lat: -8.8293, lng: 115.0849 },
  },
  // === COMMERCIAL ===
  {
    id: "commercial-berawa-restaurant",
    title: "Turnkey Restaurant Space — Berawa, Canggu",
    titleId: "Ruang Restoran Siap Pakai — Berawa, Canggu",
    type: "commercial",
    listingType: "rent",
    region: "canggu",
    priceUSD: 3500,
    priceIDR: 55300000,
    priceLabel: "/month",
    area: 180,
    image: IMG.restaurant,
    images: [IMG.restaurant, IMG.cafe, IMG.coworking],
    description: "Prime restaurant space on Berawa's busiest street. Fully equipped commercial kitchen, indoor/outdoor seating for 60 guests, and a stylish bar area. Previous tenant operated a successful Italian restaurant. Includes all kitchen equipment, furniture, and POS system. High foot traffic location with excellent visibility.",
    descriptionId: "Ruang restoran utama di jalan tersibuk Berawa. Dapur komersial lengkap, tempat duduk indoor/outdoor untuk 60 tamu, dan area bar yang stylish. Termasuk semua peralatan dapur, furnitur, dan sistem POS.",
    features: ["Commercial kitchen", "60-seat capacity", "Bar area", "Outdoor terrace", "POS system included", "Storage room", "Staff changing room", "Grease trap installed"],
    featuresId: ["Dapur komersial", "Kapasitas 60 kursi", "Area bar", "Teras outdoor", "Sistem POS termasuk", "Ruang penyimpanan", "Ruang ganti staf", "Grease trap terpasang"],
    nearbyPlaces: ["Berawa Beach (3 min)", "Finns Recreation Club (5 min)", "Atlas Beach Fest (8 min)", "Canggu Shortcut (2 min)"],
    furnished: true,
    parking: 5,
    coordinates: { lat: -8.6550, lng: 115.1420 },
  },
  {
    id: "commercial-seminyak-cafe",
    title: "Boutique Cafe & Bar Space — Seminyak",
    titleId: "Ruang Kafe & Bar Butik — Seminyak",
    type: "commercial",
    listingType: "rent",
    region: "seminyak",
    priceUSD: 4200,
    priceIDR: 66300000,
    priceLabel: "/month",
    area: 150,
    image: IMG.cafe,
    images: [IMG.cafe, IMG.restaurant, IMG.coworking],
    description: "Trendy cafe and bar space in Seminyak's Eat Street (Jl. Kayu Aya). Industrial-chic design with exposed brick, high ceilings, and Instagram-worthy interiors. Fully licensed for alcohol service. Ground floor with mezzanine level. Ideal for specialty coffee, brunch spot, or cocktail bar concept.",
    descriptionId: "Ruang kafe dan bar trendi di Eat Street Seminyak (Jl. Kayu Aya). Desain industrial-chic dengan bata ekspos, langit-langit tinggi, dan interior yang Instagramable. Berlisensi penuh untuk layanan alkohol.",
    features: ["Alcohol license", "Industrial design", "Mezzanine level", "Espresso machine", "Sound system", "Outdoor seating", "High ceilings", "Street frontage"],
    featuresId: ["Lisensi alkohol", "Desain industrial", "Level mezzanine", "Mesin espresso", "Sound system", "Tempat duduk outdoor", "Langit-langit tinggi", "Muka jalan"],
    nearbyPlaces: ["Seminyak Beach (5 min walk)", "Jl. Kayu Aya shops (1 min)", "Bintang Supermarket (3 min)", "Double Six Beach (10 min)"],
    furnished: true,
    parking: 3,
    coordinates: { lat: -8.6900, lng: 115.1680 },
  },
  {
    id: "commercial-nusadua-spa",
    title: "Wellness & Spa Center — Nusa Dua",
    titleId: "Pusat Wellness & Spa — Nusa Dua",
    type: "commercial",
    listingType: "sale",
    region: "nusa-dua",
    priceUSD: 175000,
    priceIDR: 2760000000,
    priceLabel: "",
    area: 300,
    image: IMG.villa3,
    images: [IMG.villa3, IMG.cafe, IMG.restaurant],
    description: "Established wellness and spa center in Nusa Dua's tourism corridor. Six treatment rooms, sauna, jacuzzi, reception area, and retail space. Currently operating with trained staff and existing client base. Includes all spa equipment, product inventory, and brand assets. Near major 5-star resorts.",
    descriptionId: "Pusat wellness dan spa yang sudah mapan di koridor pariwisata Nusa Dua. Enam ruang perawatan, sauna, jacuzzi, area resepsi, dan ruang ritel. Saat ini beroperasi dengan staf terlatih dan basis klien yang ada.",
    features: ["6 treatment rooms", "Sauna & jacuzzi", "Reception area", "Retail space", "Trained staff", "Client database", "All equipment included", "Brand assets"],
    featuresId: ["6 ruang perawatan", "Sauna & jacuzzi", "Area resepsi", "Ruang ritel", "Staf terlatih", "Database klien", "Semua peralatan termasuk", "Aset merek"],
    nearbyPlaces: ["BTDC Nusa Dua (3 min)", "Hilton Bali Resort (5 min)", "Bali Collection (7 min)", "Nusa Dua Beach (10 min)"],
    leaseYears: 15,
    furnished: true,
    parking: 8,
    coordinates: { lat: -8.7980, lng: 115.2310 },
  },
  // === OFFICES ===
  {
    id: "office-canggu-coworking",
    title: "Creative Office Space — Canggu",
    titleId: "Ruang Kantor Kreatif — Canggu",
    type: "office",
    listingType: "rent",
    region: "canggu",
    priceUSD: 1200,
    priceIDR: 18900000,
    priceLabel: "/month",
    area: 120,
    image: IMG.coworking,
    images: [IMG.coworking, IMG.office, IMG.cafe],
    description: "Open-plan creative office in Canggu's startup hub. Natural light, tropical courtyard, meeting room, and a shared kitchen. Fiber internet with backup connection. Suitable for tech startups, digital agencies, or remote teams of 8-12 people. Includes utility costs and weekly cleaning.",
    descriptionId: "Kantor kreatif open-plan di hub startup Canggu. Cahaya alami, halaman tropis, ruang meeting, dan dapur bersama. Internet fiber dengan koneksi cadangan. Cocok untuk startup teknologi, agensi digital, atau tim remote 8-12 orang.",
    features: ["Open-plan layout", "Meeting room", "Tropical courtyard", "Fiber internet + backup", "Shared kitchen", "Weekly cleaning", "Utilities included", "24/7 access"],
    featuresId: ["Layout open-plan", "Ruang meeting", "Halaman tropis", "Internet fiber + cadangan", "Dapur bersama", "Kebersihan mingguan", "Utilitas termasuk", "Akses 24/7"],
    nearbyPlaces: ["Canggu Deli (2 min)", "Echo Beach (7 min)", "Batu Bolong (10 min)", "Berawa (5 min)"],
    furnished: true,
    parking: 4,
    coordinates: { lat: -8.6520, lng: 115.1350 },
  },
  {
    id: "office-denpasar-corporate",
    title: "Corporate Office Suite — Denpasar CBD",
    titleId: "Suite Kantor Korporat — CBD Denpasar",
    type: "office",
    listingType: "rent",
    region: "denpasar",
    priceUSD: 2500,
    priceIDR: 39500000,
    priceLabel: "/month",
    area: 200,
    image: IMG.office,
    images: [IMG.office, IMG.coworking, IMG.cafe],
    description: "Professional corporate office suite in Denpasar's central business district. Modern building with elevator, lobby reception, and underground parking. Three private offices, open workspace for 15 staff, conference room with video conferencing, and server room. Ideal for PMA companies needing a formal registered address.",
    descriptionId: "Suite kantor korporat profesional di pusat bisnis Denpasar. Gedung modern dengan lift, resepsi lobby, dan parkir bawah tanah. Tiga kantor privat, workspace terbuka untuk 15 staf, ruang konferensi, dan server room.",
    features: ["3 private offices", "Conference room", "Server room", "Elevator access", "Underground parking", "Lobby reception", "Video conferencing", "Generator backup"],
    featuresId: ["3 kantor privat", "Ruang konferensi", "Server room", "Akses lift", "Parkir bawah tanah", "Resepsi lobby", "Video conferencing", "Generator cadangan"],
    nearbyPlaces: ["Renon Square (3 min)", "Bali Governor Office (5 min)", "Sanglah Hospital (10 min)", "Immigration Office (8 min)"],
    furnished: true,
    parking: 6,
    coordinates: { lat: -8.6705, lng: 115.2126 },
  },
  // === LAND ===
  {
    id: "land-canggu-ricefield",
    title: "Rice Field Land — Canggu, Berawa",
    titleId: "Tanah Sawah — Canggu, Berawa",
    type: "land",
    listingType: "sale",
    region: "canggu",
    priceUSD: 180000,
    priceIDR: 2840000000,
    priceLabel: "",
    area: 500,
    image: IMG.land,
    images: [IMG.land, IMG.villa1, IMG.villa2],
    description: "Prime 500m² land plot in Berawa, Canggu with rice field frontage. Zoned for residential/commercial development. Ideal for villa project (2-3 units) or boutique hotel. All permits available for immediate construction. Leasehold 25 years with extension option. One of the last available plots in this rapidly developing area.",
    descriptionId: "Tanah premium 500m² di Berawa, Canggu dengan muka sawah. Zona untuk pengembangan residensial/komersial. Ideal untuk proyek villa (2-3 unit) atau hotel butik. Semua izin tersedia untuk konstruksi segera. Hak sewa 25 tahun.",
    features: ["Rice field frontage", "Residential/commercial zone", "All permits ready", "Flat terrain", "Road access", "Electricity available", "Water connection", "Near main road"],
    featuresId: ["Muka sawah", "Zona residensial/komersial", "Semua izin siap", "Tanah datar", "Akses jalan", "Listrik tersedia", "Sambungan air", "Dekat jalan utama"],
    nearbyPlaces: ["Berawa Beach (5 min)", "Finns Recreation Club (7 min)", "Canggu Shortcut (3 min)", "Atlas Beach Fest (10 min)"],
    leaseYears: 25,
    coordinates: { lat: -8.6480, lng: 115.1400 },
  },
  {
    id: "land-ubud-jungle",
    title: "Jungle View Land — Ubud, Tegallalang",
    titleId: "Tanah Pemandangan Hutan — Ubud, Tegallalang",
    type: "land",
    listingType: "sale",
    region: "ubud",
    priceUSD: 95000,
    priceIDR: 1500000000,
    priceLabel: "",
    area: 800,
    image: IMG.land,
    images: [IMG.land, IMG.villa3, IMG.villa1],
    description: "Spectacular 800m² land with panoramic jungle and river valley views near Tegallalang. Perfect for eco-resort, wellness retreat, or luxury villa development. Gentle slope with natural terracing. Access road completed. Surrounded by nature but only 15 minutes from Ubud center.",
    descriptionId: "Tanah spektakuler 800m² dengan pemandangan hutan dan lembah sungai panoramik dekat Tegallalang. Sempurna untuk eco-resort, retreat wellness, atau pengembangan villa mewah. Lereng landai dengan terasering alami.",
    features: ["Panoramic jungle views", "River valley", "Natural terracing", "Access road", "Electricity nearby", "Quiet location", "Surrounded by nature", "Development potential"],
    featuresId: ["Pemandangan hutan panoramik", "Lembah sungai", "Terasering alami", "Jalan akses", "Listrik terdekat", "Lokasi tenang", "Dikelilingi alam", "Potensi pengembangan"],
    nearbyPlaces: ["Tegallalang Rice Terrace (5 min)", "Ubud Center (15 min)", "Tirta Empul Temple (10 min)", "Gunung Kawi (12 min)"],
    leaseYears: 30,
    coordinates: { lat: -8.4200, lng: 115.3050 },
  },
  {
    id: "land-sanur-beachside",
    title: "Beachside Development Land — Sanur",
    titleId: "Tanah Pengembangan Tepi Pantai — Sanur",
    type: "land",
    listingType: "sale",
    region: "sanur",
    priceUSD: 320000,
    priceIDR: 5050000000,
    priceLabel: "",
    area: 1200,
    image: IMG.land,
    images: [IMG.land, IMG.villa2, IMG.villa1],
    description: "Rare 1,200m² beachside land in Sanur, just 200 meters from the beach. Zoned for hotel/resort development. Existing building foundation can be utilized. Freehold title available for Indonesian entity (PMA eligible). Prime location in Sanur's established tourism corridor with steady year-round demand.",
    descriptionId: "Tanah tepi pantai langka 1.200m² di Sanur, hanya 200 meter dari pantai. Zona untuk pengembangan hotel/resort. Fondasi bangunan yang ada dapat dimanfaatkan. Hak milik tersedia untuk entitas Indonesia (PMA eligible).",
    features: ["200m from beach", "Hotel/resort zone", "Existing foundation", "Freehold available", "1,200m² plot", "Main road access", "All utilities", "Tourism corridor"],
    featuresId: ["200m dari pantai", "Zona hotel/resort", "Fondasi yang ada", "Hak milik tersedia", "Lahan 1.200m²", "Akses jalan utama", "Semua utilitas", "Koridor pariwisata"],
    nearbyPlaces: ["Sanur Beach (2 min walk)", "Hardy's Supermarket (5 min)", "Sanur Night Market (3 min)", "Bali Hyatt (5 min)"],
    coordinates: { lat: -8.7080, lng: 115.2620 },
  },
  // === WAREHOUSES ===
  {
    id: "warehouse-denpasar-industrial",
    title: "Industrial Warehouse — Denpasar, Gatsu",
    titleId: "Gudang Industri — Denpasar, Gatsu",
    type: "warehouse",
    listingType: "rent",
    region: "denpasar",
    priceUSD: 1500,
    priceIDR: 23700000,
    priceLabel: "/month",
    area: 450,
    image: IMG.warehouse,
    images: [IMG.warehouse, IMG.office, IMG.coworking],
    description: "Spacious 450m² warehouse on Jl. Gatot Subroto, Denpasar's main industrial corridor. 6-meter ceiling height, loading dock for trucks, 3-phase electricity, and office mezzanine. Suitable for import/export storage, manufacturing, or distribution center. Easy access to Ngurah Rai Airport cargo terminal.",
    descriptionId: "Gudang luas 450m² di Jl. Gatot Subroto, koridor industri utama Denpasar. Tinggi langit-langit 6 meter, loading dock untuk truk, listrik 3 fase, dan mezzanine kantor. Cocok untuk penyimpanan impor/ekspor, manufaktur, atau pusat distribusi.",
    features: ["6m ceiling height", "Loading dock", "3-phase electricity", "Office mezzanine", "Security guard", "CCTV system", "Fire suppression", "Truck access"],
    featuresId: ["Tinggi langit-langit 6m", "Loading dock", "Listrik 3 fase", "Mezzanine kantor", "Satpam", "Sistem CCTV", "Pemadam kebakaran", "Akses truk"],
    nearbyPlaces: ["Ngurah Rai Airport (25 min)", "Benoa Harbor (20 min)", "Denpasar Center (10 min)", "Sanur (15 min)"],
    parking: 10,
    coordinates: { lat: -8.6530, lng: 115.2200 },
  },
  {
    id: "warehouse-kuta-logistics",
    title: "Logistics Hub Warehouse — Kuta",
    titleId: "Gudang Hub Logistik — Kuta",
    type: "warehouse",
    listingType: "rent",
    region: "kuta",
    priceUSD: 2200,
    priceIDR: 34700000,
    priceLabel: "/month",
    area: 600,
    image: IMG.warehouse,
    images: [IMG.warehouse, IMG.office, IMG.coworking],
    description: "Strategic 600m² warehouse near Ngurah Rai Airport, ideal for logistics and e-commerce fulfillment. Climate-controlled section for sensitive goods, automated inventory system, and direct highway access. Currently used as a distribution center for imported goods. Includes cold storage room and packaging area.",
    descriptionId: "Gudang strategis 600m² dekat Bandara Ngurah Rai, ideal untuk logistik dan fulfillment e-commerce. Bagian ber-AC untuk barang sensitif, sistem inventaris otomatis, dan akses langsung jalan tol.",
    features: ["Climate-controlled section", "Cold storage room", "Packaging area", "Highway access", "Inventory system", "Loading bays x3", "Office space", "Generator"],
    featuresId: ["Bagian ber-AC", "Ruang cold storage", "Area pengemasan", "Akses jalan tol", "Sistem inventaris", "Loading bay x3", "Ruang kantor", "Generator"],
    nearbyPlaces: ["Ngurah Rai Airport (10 min)", "Benoa Harbor (15 min)", "Kuta Center (8 min)", "Bypass Ngurah Rai (2 min)"],
    parking: 15,
    coordinates: { lat: -8.7480, lng: 115.1780 },
  },
  {
    id: "villa-nusadua-beachfront",
    title: "Beachfront Executive Villa — Nusa Dua",
    titleId: "Villa Eksekutif Tepi Pantai — Nusa Dua",
    type: "villa",
    listingType: "rent",
    region: "nusa-dua",
    priceUSD: 5500,
    priceIDR: 86800000,
    priceLabel: "/month",
    area: 600,
    bedrooms: 5,
    bathrooms: 6,
    image: IMG.villa2,
    images: [IMG.villa2, IMG.villa1, IMG.villa3],
    description: "Ultra-luxury beachfront villa in Nusa Dua's exclusive BTDC area. Direct beach access, 20-meter lap pool, home theater, chef's kitchen, and manicured tropical gardens. Full staff included (housekeeper, gardener, pool attendant). Perfect for corporate retreats or high-net-worth individuals seeking privacy and prestige.",
    descriptionId: "Villa tepi pantai ultra-mewah di area eksklusif BTDC Nusa Dua. Akses pantai langsung, kolam renang lap 20 meter, home theater, dapur chef, dan taman tropis terawat. Staf lengkap termasuk (pembantu rumah tangga, tukang kebun, petugas kolam).",
    features: ["Direct beach access", "20m lap pool", "Home theater", "Chef's kitchen", "Full staff included", "Tropical gardens", "Wine room", "Gym"],
    featuresId: ["Akses pantai langsung", "Kolam lap 20m", "Home theater", "Dapur chef", "Staf lengkap termasuk", "Taman tropis", "Wine room", "Gym"],
    nearbyPlaces: ["Nusa Dua Beach (1 min walk)", "Bali Golf & Country Club (5 min)", "Bali Collection (8 min)", "Water Blow (10 min)"],
    yearBuilt: 2024,
    furnished: true,
    parking: 4,
    pool: true,
    coordinates: { lat: -8.7950, lng: 115.2280 },
  },
];

// Filter helpers
export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "villa", label: "Villa" },
  { value: "commercial", label: "Commercial Space" },
  { value: "office", label: "Office" },
  { value: "land", label: "Land" },
  { value: "warehouse", label: "Warehouse" },
];

export const REGIONS: { value: Region; label: string }[] = [
  { value: "canggu", label: "Canggu" },
  { value: "seminyak", label: "Seminyak" },
  { value: "ubud", label: "Ubud" },
  { value: "uluwatu", label: "Uluwatu" },
  { value: "nusa-dua", label: "Nusa Dua" },
  { value: "sanur", label: "Sanur" },
  { value: "denpasar", label: "Denpasar" },
  { value: "kuta", label: "Kuta" },
];

export const RENT_PRICE_RANGES = [
  { value: "0-1000", label: "$500 - $1,000/mo", min: 0, max: 1000 },
  { value: "1000-2000", label: "$1,000 - $2,000/mo", min: 1000, max: 2000 },
  { value: "2000-5000", label: "$2,000 - $5,000/mo", min: 2000, max: 5000 },
  { value: "5000-10000", label: "$5,000 - $10,000/mo", min: 5000, max: 10000 },
  { value: "10000+", label: "$10,000+/mo", min: 10000, max: Infinity },
];

export const SALE_PRICE_RANGES = [
  { value: "0-100000", label: "$50K - $100K", min: 0, max: 100000 },
  { value: "100000-250000", label: "$100K - $250K", min: 100000, max: 250000 },
  { value: "250000-500000", label: "$250K - $500K", min: 250000, max: 500000 },
  { value: "500000+", label: "$500K+", min: 500000, max: Infinity },
];

export function getPropertyById(id: string): Property | undefined {
  return PROPERTIES.find((p) => p.id === id);
}

export function formatPriceUSD(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
  return `$${price.toLocaleString()}`;
}

export function formatPriceIDR(price: number): string {
  if (price >= 1000000000) return `Rp ${(price / 1000000000).toFixed(1)}B`;
  if (price >= 1000000) return `Rp ${(price / 1000000).toFixed(0)}M`;
  return `Rp ${price.toLocaleString()}`;
}
