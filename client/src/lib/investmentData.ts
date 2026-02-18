/* ============================================================
 * BaseOne Bali — Investment Data Layer
 * Design: "Golden Archipelago" — Swiss Finance meets Island Warmth
 * All data sourced from batch1_analiz.md & batch2_analiz.md
 * ============================================================ */

export const HERO_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/koNVJV37gahmeKOo0W8cRX/sandbox/bIevyCH7aYm5RxNpzWbqMV-img-1_1771167339000_na1fn_aGVyby1iYWxp.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva29OVkpWMzdnYWhtZUtPbzBXOGNSWC9zYW5kYm94L2JJZXZ5Q0g3YVltNVJ4TnB6V2JxTVYtaW1nLTFfMTc3MTE2NzMzOTAwMF9uYTFmbl9hR1Z5YnkxaVlXeHAuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=lvaht~EvTujKsjHQQcelfbGmRF0oNrBd1D45y~VAEh95DQpqvvrSL-YRc2k~6bPrxdV09DL93zXJ1iH-BxWdDwrscrUA0kR-JTyIh1L76QkDxrgwAm7ncmQljec2AlVY2bbowioQ3TE50xJYKlGDBgjp7Fp8ohcdtQ9Yf-d-7Dmdd2vIQx8O5oEmXoieIrBpGC5VhVGrTsIPBsrIVv0s~u0MBmthLwPUG0C1MVwqhrOqjlED8oAOxKgnB2cg7l8Mg~-lqzJRRu8vbwMkJYY2vzgGNM53ZLUHYIoQ2CCeVrrECfSB9mnwPqBhMaH3FbBYwLKibYCQZBsQsw5vp-f4Vg__";

export const AI_ADVISOR_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/koNVJV37gahmeKOo0W8cRX/sandbox/bIevyCH7aYm5RxNpzWbqMV-img-2_1771167341000_na1fn_YWktYWR2aXNvci1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva29OVkpWMzdnYWhtZUtPbzBXOGNSWC9zYW5kYm94L2JJZXZ5Q0g3YVltNVJ4TnB6V2JxTVYtaW1nLTJfMTc3MTE2NzM0MTAwMF9uYTFmbl9ZV2t0WVdSMmFYTnZjaTFpWncuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ln3awLx89HVeKWX~weUrGCAV5E7KFMDNxdArVvamyx5qWHDuBgDoHjIN9NjfxeUnDkgCwAcUvlRAq1JP4HK5KnXoAnmtCJcjr4BsRkIeW8FMqqzR6oAOFkONQx~7Ew8taVMj3O1ahkR6OHMt-J-ZRTue88kDOe4xXPBzGkCw57kPAioaXBShYJ7mFHrnMawsUqvmUsE-mqv-Xtw49nH3BTlonP3h4EfwAAgQtZVkWH7G78XSgfzsFNkHaai-zcQUcKd~SfUcBg16BSPlspUzz1vpc3-j5mak~DWAU0U8ZD5PvHqjmuYmbU6xVncbWCT0~7KKrfCaKWRHR8ptR9L~-w__";

export const WIZARD_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/koNVJV37gahmeKOo0W8cRX/sandbox/bIevyCH7aYm5RxNpzWbqMV-img-3_1771167343000_na1fn_d2l6YXJkLWJn.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva29OVkpWMzdnYWhtZUtPbzBXOGNSWC9zYW5kYm94L2JJZXZ5Q0g3YVltNVJ4TnB6V2JxTVYtaW1nLTNfMTc3MTE2NzM0MzAwMF9uYTFmbl9kMmw2WVhKa0xXSm4uanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=U0nEGBB3a3XVl93Ul69WbJd81kn2cjSsiwvSwFLDtnniSIHkRZkZwv4j~8Q8qz8lubFjSX5YewvnCtLCcw8vYbitQS0HLffNo35A8Jn2AhsWFEsyth415rxaGohxyLjAriB53Q5sk~rsdxufq4zBSHUhjBjAoQt-~SbgjsdOTpr184QL43Wiy6mnjh0Oq-En6WXueooOuYkNUYQAaqQ9Ax01h6opW2e0Lz97gNjKL2BLj3LZSv-4bAblMHmalxtVUfAmfATADB26XBSe-OkEnPERaEBa6OuoneuZACTAQJqBLfdafgG-LoQZ4oCwtgqaDeVFnfq~olO-QaNGFWy2iw__";

export const CTA_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/koNVJV37gahmeKOo0W8cRX/sandbox/bIevyCH7aYm5RxNpzWbqMV-img-4_1771167343000_na1fn_Y3RhLXNlY3Rpb24.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva29OVkpWMzdnYWhtZUtPbzBXOGNSWC9zYW5kYm94L2JJZXZ5Q0g3YVltNVJ4TnB6V2JxTVYtaW1nLTRfMTc3MTE2NzM0MzAwMF9uYTFmbl9ZM1JoTFhObFkzUnBiMjQuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=He49beNwfgj81Dt8aaAKMt85alg1805txJHPTbzXApLfNit7h8t251~k17FvH0gdzyDRZ4QhGhEKUVeLz7XN2OXZl3aQf-EhV~EE-C0DAczx5Uza1FshscPBiG2Gq1tB-yqNJoVd7F5NtGdDki~YlScKdyZL4EZJEi-gjFxy-x8oUrj9HPh517C5F7wNypKJJw9WzFU-bU5fHKldIUyMnmrM3~DOsTdfRFIyc1FN13G~bivBf-uI79v9nzij1AKL-Ig-anCAj0raP9CmfxpqKJ70KJhwK4~OpTw81HT3ybXRLEACQAl8wt2P8W8wyB4PalJiaO9HsSNFnSGgVdHOgg__";

export const SECTORS_IMAGE = "https://private-us-east-1.manuscdn.com/sessionFile/koNVJV37gahmeKOo0W8cRX/sandbox/bIevyCH7aYm5RxNpzWbqMV-img-5_1771167348000_na1fn_c2VjdG9ycy1wYXR0ZXJu.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUva29OVkpWMzdnYWhtZUtPbzBXOGNSWC9zYW5kYm94L2JJZXZ5Q0g3YVltNVJ4TnB6V2JxTVYtaW1nLTVfMTc3MTE2NzM0ODAwMF9uYTFmbl9jMlZqZEc5eWN5MXdZWFIwWlhKdS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=PUY3c7Sf0zho~NpfTRZCmS6vEmRqEm1l2Ir-cQ41zjmDGYeqRfEL34WXvUqdY9DGSvjCmABNskhATmReDLbuYhMc8ZogRr0ghPCqdLJu7QyKHYygS0362NRaRVkxbobPCGsPOfY7in8bfTCuHvXg2Vqslu5xIxkD2QjTJrAyNBCwiRV5sXmgCsHS6uUdz7Z3sZvhHAoLJCVdfz2vYOVjf-WdS5tZVpdBAbDfZBdRiw~jt8xrFC5zMk8gXCL11IN1iXGOxl-eV487Jj1k4JWC~RgBpbbnBdFH1Ei4WXBP0IwKm4jl4YVZJ6Al1VzgmGPbT1iZ13jLPpgk~RsEmvIs2g__";

// Budget ranges for Wizard
export const BUDGET_RANGES = [
  { id: "25k-50k", label: "$25,000 - $50,000", min: 25000, max: 50000 },
  { id: "50k-100k", label: "$50,000 - $100,000", min: 50000, max: 100000 },
  { id: "100k-150k", label: "$100,000 - $150,000", min: 100000, max: 150000 },
  { id: "150k-200k", label: "$150,000 - $200,000", min: 150000, max: 200000 },
  { id: "200k-300k", label: "$200,000 - $300,000+", min: 200000, max: 300000 },
] as const;

// Sectors for Wizard
export const SECTORS = [
  { id: "restaurant", label: "Restaurant & Cafe", icon: "UtensilsCrossed", kbli: "56101", description: "F&B operations in Bali's thriving culinary scene" },
  { id: "villa", label: "Villa Rental", icon: "Building2", kbli: "55120", description: "Short & long-term villa rental business" },
  { id: "digital", label: "Digital Agency", icon: "Globe", kbli: "62019", description: "IT consulting and digital services" },
  { id: "wellness", label: "Wellness & Spa", icon: "Heart", kbli: "96122", description: "Spa, wellness retreats and health tourism" },
  { id: "import-export", label: "Import / Export", icon: "Ship", kbli: "46100", description: "Trading and distribution operations" },
  { id: "construction", label: "Construction", icon: "HardHat", kbli: "41011", description: "Building and property development" },
  { id: "education", label: "Education", icon: "GraduationCap", kbli: "85499", description: "Training centers and educational services" },
  { id: "crypto", label: "Crypto & Fintech", icon: "Cpu", kbli: "64199", description: "Financial technology and digital assets" },
] as const;

// Regions in Bali
export const REGIONS = [
  { id: "canggu", name: "Canggu", type: "Trending", description: "Digital nomad hub, surf culture, rapidly growing F&B scene", avgRent: "$1,200-2,500/mo" },
  { id: "seminyak", name: "Seminyak", type: "Premium", description: "Upscale dining, nightlife, established tourist area", avgRent: "$1,500-3,500/mo" },
  { id: "ubud", name: "Ubud", type: "Cultural", description: "Art, wellness, rice terraces, spiritual tourism", avgRent: "$800-1,800/mo" },
  { id: "uluwatu", name: "Uluwatu", type: "Luxury", description: "Cliff-top villas, high-end resorts, surf breaks", avgRent: "$2,000-5,000/mo" },
] as const;

// PMA Setup costs
export const PMA_COSTS = {
  notary: { label: "Notary & Akta", cost: 800, description: "Company deed and notarization" },
  oss: { label: "OSS Registration", cost: 350, description: "Online Single Submission for business licenses" },
  npwp: { label: "NPWP (Tax ID)", cost: 150, description: "Tax identification number" },
  nib: { label: "NIB (Business ID)", cost: 200, description: "Business identification number" },
  virtualOffice: { label: "Virtual Office (1yr)", cost: 600, description: "Registered business address" },
  bankAccount: { label: "Bank Account Setup", cost: 150, description: "Corporate bank account opening" },
  total: 2250,
} as const;

// Tax & Regulation info
export const REGULATIONS = {
  ppn: { rate: 11, label: "PPN (VAT)", description: "Pajak Pertambahan Nilai — Indonesian Value Added Tax" },
  pph21: { rate: 5, label: "PPh 21", description: "Employee income tax (up to IDR 60M/year)" },
  pph25: { rate: 22, label: "PPh 25", description: "Corporate income tax" },
  withholding: { rate: 2, label: "PPh 23", description: "Withholding tax on services" },
} as const;

// AI Advisor mock responses based on budget
export interface AIAdvisorResponse {
  summary: string;
  breakdown: { item: string; cost: string; description: string }[];
  recommendations: string[];
  remainingBudget: string;
  riskLevel: string;
  estimatedROI: string;
}

export function getAIAdvisorResponse(budget: number, locale: string = 'en'): AIAdvisorResponse {
  const isTR = locale === 'tr';

  if (budget < 25000) {
    return {
      summary: isTR
        ? `$${budget.toLocaleString()} bütçe ile Bali'de hafif bir dijital varlık kurabilirsiniz. Bu bütçe danışmanlık, freelance veya küçük çevrimiçi işler için idealdir.`
        : `With a budget of $${budget.toLocaleString()}, you can establish a lightweight digital presence in Bali. This budget is ideal for consulting, freelancing, or a small online business.`,
      breakdown: [
        { item: "PT PMA Setup", cost: "$2,250", description: "Company registration, notary, OSS, NPWP, NIB" },
        { item: "KITAS Visa (1yr)", cost: "$1,800", description: "Investor/Director work permit" },
        { item: "Virtual Office", cost: "$600/yr", description: "Registered business address in Bali" },
        { item: "Legal Consultation", cost: "$500", description: "Initial legal advisory on KBLI codes & compliance" },
        { item: "Operational Reserve", cost: `$${(budget - 5150).toLocaleString()}`, description: "Working capital for first 6 months" },
      ],
      recommendations: [
        "Consider a Digital Agency (KBLI 62019) or Consulting (KBLI 70209) model",
        "Start with a virtual office in Canggu or Ubud for lower costs",
        "Focus on remote/digital services to minimize overhead",
        "Build local network before scaling to physical operations",
      ],
      remainingBudget: `$${(budget - 5150).toLocaleString()}`,
      riskLevel: "Low",
      estimatedROI: "15-25% annually",
    };
  }

  if (budget < 50000) {
    return {
      summary: isTR
        ? `$${budget.toLocaleString()} ile Bali'de küçük-orta ölçekli bir işletme başlatabilirsiniz. Bu, F&B, wellness veya butik villa kiralama operasyonlarına kapı açar.`
        : `With $${budget.toLocaleString()}, you can launch a small-to-medium business in Bali. This opens doors to F&B, wellness, or a boutique villa rental operation.`,
      breakdown: isTR ? [
        { item: "PT PMA Kurulumu", cost: "$2,250", description: "Tam şirket kayıt paketi" },
        { item: "KITAS Vize (1 yıl)", cost: "$1,800", description: "Yatırımcı/Direktör çalışma izni" },
        { item: "İşletme Lisansları", cost: "$1,500", description: "Sektöre özel izinler ve KBLI kaydı" },
        { item: "Lokasyon Kiralama (1 yıl)", cost: "$8,000-15,000", description: "Canggu veya Ubud'da ticari alan" },
        { item: "İç Tasarım & Kurulum", cost: "$10,000-15,000", description: "Tadilat ve ekipman" },
        { item: "İşletme Sermayesi", cost: `$${(budget - 30550).toLocaleString()}`, description: "6 aylık operasyonel rezerv" },
      ] : [
        { item: "PT PMA Setup", cost: "$2,250", description: "Full company registration package" },
        { item: "KITAS Visa (1yr)", cost: "$1,800", description: "Investor/Director work permit" },
        { item: "Business Licenses", cost: "$1,500", description: "Sector-specific permits and KBLI registration" },
        { item: "Location Lease (1yr)", cost: "$8,000-15,000", description: "Commercial space in Canggu or Ubud" },
        { item: "Interior & Setup", cost: "$10,000-15,000", description: "Renovation and equipment" },
        { item: "Working Capital", cost: `$${(budget - 30550).toLocaleString()}`, description: "6-month operational runway" },
      ],
      recommendations: isTR ? [
        "Canggu'da Restoran/Kafe (KBLI 56101) güçlü bir başlangıç noktasıdır",
        "Ubud'da Wellness/Spa (KBLI 96122) için talep artıyor",
        "Daha iyi fiyatlar için 3-5 yıllık kira güvence altına alın",
        "Beklenmedik düzenleyici maliyetler için bütçenin %15'ini ayırın",
        "Operasyonel destek için yerel biriyle ortaklık kurmayı düşünün",
      ] : [
        "Restaurant/Cafe (KBLI 56101) in Canggu is a strong entry point",
        "Wellness/Spa (KBLI 96122) in Ubud has growing demand",
        "Secure a 3-5 year lease for better rates",
        "Budget 15% for unexpected regulatory costs",
        "Consider partnering with a local for operational support",
      ],
      remainingBudget: `$${(budget - 30550).toLocaleString()}`,
      riskLevel: isTR ? "Orta" : "Medium",
      estimatedROI: isTR ? "Yıllık %20-30" : "20-30% annually",
    };
  }

  if (budget < 100000) {
    return {
      summary: `A budget of $${budget.toLocaleString()} positions you well for a mid-scale investment in Bali. You can operate a restaurant, manage villa rentals, or launch a multi-service business.`,
      breakdown: [
        { item: "PT PMA Setup", cost: "$2,250", description: "Full company registration package" },
        { item: "KITAS Visa (1yr)", cost: "$1,800", description: "Investor/Director work permit" },
        { item: "Business Licenses", cost: "$2,500", description: "Multiple KBLI codes and sector permits" },
        { item: "Location Lease (2yr)", cost: "$20,000-35,000", description: "Premium commercial space" },
        { item: "Build-out & Equipment", cost: "$20,000-30,000", description: "Full renovation and professional setup" },
        { item: "Staff (6 months)", cost: "$8,000-12,000", description: "4-6 local employees" },
        { item: "Marketing Launch", cost: "$5,000", description: "Digital marketing and brand setup" },
        { item: "Working Capital", cost: `$${Math.max(0, budget - 85550).toLocaleString()}`, description: "Operational reserve" },
      ],
      recommendations: [
        "Villa Rental (KBLI 55120) in Seminyak or Uluwatu for premium returns",
        "Multi-concept F&B venue in Canggu with strong social media presence",
        "Consider Import/Export (KBLI 46100) for Bali artisan products",
        "Register multiple KBLI codes for business flexibility",
        "Hire a local accountant for PPN (11% VAT) compliance",
      ],
      remainingBudget: `$${Math.max(0, budget - 85550).toLocaleString()}`,
      riskLevel: "Medium",
      estimatedROI: "25-35% annually",
    };
  }

  if (budget < 200000) {
    return {
      summary: `With $${budget.toLocaleString()}, you're entering Bali's premium investment tier. This budget supports villa development, multi-location F&B, or a diversified portfolio approach.`,
      breakdown: [
        { item: "PT PMA Setup", cost: "$2,250", description: "Full company registration package" },
        { item: "KITAS + KITAP Visa", cost: "$3,500", description: "Long-term investor permit (5 years)" },
        { item: "Business Licenses", cost: "$3,500", description: "Comprehensive KBLI portfolio" },
        { item: "Property Lease (5yr)", cost: "$50,000-80,000", description: "Premium location with long-term security" },
        { item: "Construction/Renovation", cost: "$40,000-60,000", description: "High-end build-out" },
        { item: "Staff & Training", cost: "$15,000", description: "Full team with training program" },
        { item: "Marketing & Branding", cost: "$10,000", description: "Professional brand launch" },
        { item: "Legal & Compliance Reserve", cost: "$5,000", description: "Ongoing legal support" },
        { item: "Working Capital", cost: `$${Math.max(0, budget - 169250).toLocaleString()}`, description: "12-month operational runway" },
      ],
      recommendations: [
        "Villa development in Uluwatu — 14-18% projected ROI",
        "Multi-location F&B brand across Canggu and Seminyak",
        "Construction (KBLI 41011) for property development",
        "Consider a holding structure for asset protection",
        "Engage a tax consultant for PPh 25 (22% corporate tax) optimization",
      ],
      remainingBudget: `$${Math.max(0, budget - 169250).toLocaleString()}`,
      riskLevel: "Medium-High",
      estimatedROI: "18-30% annually",
    };
  }

  return {
    summary: `With $${budget.toLocaleString()}, you have access to Bali's top-tier investment opportunities. This budget enables villa portfolios, resort development, or diversified multi-sector operations.`,
    breakdown: [
      { item: "PT PMA Setup (Premium)", cost: "$3,500", description: "Expedited registration with multiple KBLI codes" },
      { item: "KITAP Visa (5yr)", cost: "$4,500", description: "Permanent investor stay permit" },
      { item: "Comprehensive Licenses", cost: "$5,000", description: "Full regulatory compliance package" },
      { item: "Land Lease (10-25yr)", cost: "$80,000-150,000", description: "Prime location long-term lease" },
      { item: "Development & Construction", cost: "$80,000-120,000", description: "Custom build or major renovation" },
      { item: "Operations Setup", cost: "$30,000-50,000", description: "Full team, systems, and equipment" },
      { item: "Marketing & Launch", cost: "$15,000-25,000", description: "Premium brand positioning" },
      { item: "Legal & Advisory", cost: "$10,000", description: "Ongoing legal and tax advisory" },
      { item: "Working Capital", cost: `$${Math.max(0, budget - 358000).toLocaleString()}`, description: "18-month operational reserve" },
    ],
    recommendations: [
      "Villa portfolio in Uluwatu + Ubud for diversified returns",
      "Resort-style accommodation with F&B integration",
      "Consider Crypto/Fintech (KBLI 64199) for high-growth potential",
      "Establish a PT PMA holding company for multiple ventures",
      "Work with international tax advisors for cross-border optimization",
      "Explore construction permits for custom villa development",
    ],
    remainingBudget: `$${Math.max(0, budget - 358000).toLocaleString()}`,
    riskLevel: "High (Diversified)",
    estimatedROI: "20-40% annually",
  };
}

// Wizard result generator
export interface WizardResult {
  capex: { item: string; cost: number; description: string }[];
  totalCapex: number;
  regions: typeof REGIONS[number][];
  regulations: { label: string; rate: number; description: string }[];
  permits: string[];
  kbliCodes: { code: string; description: string }[];
  pmaProcess: { step: string; duration: string; description: string }[];
  monthlyOperational: number;
  estimatedROI: string;
  breakEvenMonths: number;
}

export function getWizardResult(budgetId: string, sectorId: string): WizardResult {
  const budget = BUDGET_RANGES.find(b => b.id === budgetId);
  const sector = SECTORS.find(s => s.id === sectorId);
  if (!budget || !sector) throw new Error("Invalid selection");

  const midBudget = (budget.min + budget.max) / 2;

  // Sector-specific KBLI codes
  const kbliMap: Record<string, { code: string; description: string }[]> = {
    restaurant: [
      { code: "56101", description: "Restaurant operations" },
      { code: "56301", description: "Beverage serving (bar/cafe)" },
      { code: "47221", description: "Retail sale of beverages" },
    ],
    villa: [
      { code: "55120", description: "Short-stay accommodation" },
      { code: "55901", description: "Other accommodation services" },
      { code: "68110", description: "Real estate with own property" },
    ],
    digital: [
      { code: "62019", description: "Computer programming activities" },
      { code: "63110", description: "Data processing and hosting" },
      { code: "73100", description: "Advertising activities" },
    ],
    wellness: [
      { code: "96122", description: "Beauty and spa services" },
      { code: "86901", description: "Health service activities" },
      { code: "93291", description: "Recreation and amusement" },
    ],
    "import-export": [
      { code: "46100", description: "Wholesale on a fee/contract basis" },
      { code: "46499", description: "Wholesale of other goods" },
      { code: "52291", description: "Freight forwarding" },
    ],
    construction: [
      { code: "41011", description: "Residential building construction" },
      { code: "41012", description: "Non-residential building construction" },
      { code: "43210", description: "Electrical installation" },
    ],
    education: [
      { code: "85499", description: "Other education n.e.c." },
      { code: "85410", description: "Post-secondary non-tertiary education" },
      { code: "85500", description: "Educational support activities" },
    ],
    crypto: [
      { code: "64199", description: "Other financial intermediation" },
      { code: "66190", description: "Other financial support activities" },
      { code: "62019", description: "Computer programming activities" },
    ],
  };

  // Region recommendations by sector
  const regionMap: Record<string, string[]> = {
    restaurant: ["canggu", "seminyak"],
    villa: ["uluwatu", "seminyak"],
    digital: ["canggu", "ubud"],
    wellness: ["ubud", "seminyak"],
    "import-export": ["canggu", "seminyak"],
    construction: ["uluwatu", "canggu"],
    education: ["ubud", "canggu"],
    crypto: ["canggu", "seminyak"],
  };

  // CAPEX calculation
  const baseCosts = [
    { item: "PT PMA Registration", cost: 2250, description: "Company setup, notary, OSS, NPWP, NIB" },
    { item: "KITAS Visa (1yr)", cost: 1800, description: "Investor/Director work permit" },
    { item: "Business Licenses", cost: 1500, description: `Sector-specific permits for ${sector.label}` },
  ];

  const sectorCosts: Record<string, { item: string; cost: number; description: string }[]> = {
    restaurant: [
      { item: "Location Lease (1yr)", cost: Math.round(midBudget * 0.25), description: "Commercial space rental" },
      { item: "Kitchen & Equipment", cost: Math.round(midBudget * 0.2), description: "Professional kitchen setup" },
      { item: "Interior Design", cost: Math.round(midBudget * 0.15), description: "Restaurant fit-out" },
      { item: "Initial Inventory", cost: Math.round(midBudget * 0.05), description: "Food & beverage stock" },
    ],
    villa: [
      { item: "Property Lease (3-5yr)", cost: Math.round(midBudget * 0.4), description: "Villa or land lease" },
      { item: "Renovation/Furnishing", cost: Math.round(midBudget * 0.25), description: "Interior and exterior upgrade" },
      { item: "Pool & Landscaping", cost: Math.round(midBudget * 0.1), description: "Outdoor amenities" },
    ],
    digital: [
      { item: "Office Space (1yr)", cost: Math.round(midBudget * 0.15), description: "Co-working or private office" },
      { item: "Equipment & Software", cost: Math.round(midBudget * 0.1), description: "Computers, licenses, tools" },
      { item: "Team Hiring (6mo)", cost: Math.round(midBudget * 0.2), description: "Local developers and designers" },
    ],
    wellness: [
      { item: "Location Lease (1yr)", cost: Math.round(midBudget * 0.25), description: "Spa/wellness center space" },
      { item: "Treatment Rooms Setup", cost: Math.round(midBudget * 0.2), description: "Equipment and furnishing" },
      { item: "Products & Supplies", cost: Math.round(midBudget * 0.08), description: "Spa products and amenities" },
    ],
    "import-export": [
      { item: "Warehouse/Storage", cost: Math.round(midBudget * 0.15), description: "Storage facility" },
      { item: "Initial Inventory", cost: Math.round(midBudget * 0.3), description: "Product sourcing" },
      { item: "Logistics Setup", cost: Math.round(midBudget * 0.1), description: "Shipping and customs" },
    ],
    construction: [
      { item: "Equipment & Tools", cost: Math.round(midBudget * 0.25), description: "Construction equipment" },
      { item: "Initial Project Materials", cost: Math.round(midBudget * 0.2), description: "Building materials" },
      { item: "Team & Contractors", cost: Math.round(midBudget * 0.15), description: "Skilled labor" },
    ],
    education: [
      { item: "Location Lease (1yr)", cost: Math.round(midBudget * 0.2), description: "Classroom/training space" },
      { item: "Equipment & Materials", cost: Math.round(midBudget * 0.1), description: "Teaching equipment" },
      { item: "Curriculum Development", cost: Math.round(midBudget * 0.08), description: "Course creation" },
    ],
    crypto: [
      { item: "Office & Infrastructure", cost: Math.round(midBudget * 0.15), description: "Secure office space" },
      { item: "Technology Stack", cost: Math.round(midBudget * 0.2), description: "Servers, security, software" },
      { item: "Compliance & Legal", cost: Math.round(midBudget * 0.1), description: "Regulatory compliance" },
    ],
  };

  const capex = [...baseCosts, ...(sectorCosts[sectorId] || [])];
  const totalCapex = capex.reduce((sum, item) => sum + item.cost, 0);

  const recommendedRegions = (regionMap[sectorId] || ["canggu"]).map(
    id => REGIONS.find(r => r.id === id)!
  );

  return {
    capex,
    totalCapex,
    regions: recommendedRegions,
    regulations: [
      { label: "PPN (VAT)", rate: 11, description: "Applied to all goods and services" },
      { label: "PPh 25 (Corporate Tax)", rate: 22, description: "Annual corporate income tax" },
      { label: "PPh 21 (Employee Tax)", rate: 5, description: "Employee income tax (up to IDR 60M/yr)" },
      { label: "PPh 23 (Withholding)", rate: 2, description: "Withholding tax on services" },
    ],
    permits: [
      "NIB (Nomor Induk Berusaha) — Business Identification Number",
      "NPWP (Nomor Pokok Wajib Pajak) — Tax ID",
      `Sector License for ${sector.label}`,
      "OSS (Online Single Submission) Registration",
      "Environmental Permit (if applicable)",
    ],
    kbliCodes: kbliMap[sectorId] || [{ code: sector.kbli, description: sector.description }],
    pmaProcess: [
      { step: "Document Preparation", duration: "2 days", description: "Passport verification, company name check, KBLI selection" },
      { step: "Notary & Akta", duration: "3-5 days", description: "Company deed drafting, approval, and signing" },
      { step: "Ministry Approval", duration: "2-3 days", description: "SK Menkumham — Ministry of Law approval" },
      { step: "OSS & Licenses", duration: "2 days", description: "NIB, NPWP registration via Online Single Submission" },
      { step: "Bank Account", duration: "3-5 days", description: "Corporate bank account opening (BCA/Mandiri)" },
      { step: "Final Delivery", duration: "1 day", description: "Complete document package handover" },
    ],
    monthlyOperational: Math.round(midBudget * 0.05),
    estimatedROI: midBudget < 50000 ? "15-25%" : midBudget < 100000 ? "20-30%" : midBudget < 200000 ? "25-35%" : "20-40%",
    breakEvenMonths: midBudget < 50000 ? 18 : midBudget < 100000 ? 14 : midBudget < 200000 ? 12 : 10,
  };
}
