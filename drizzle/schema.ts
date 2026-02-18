import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with subscription tier, Stripe customer ID, and profile fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  subscriptionTier: mysqlEnum("subscriptionTier", ["free", "premium", "vip"]).default("free").notNull(),
  passwordHash: varchar("passwordHash", { length: 256 }),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  phone: varchar("phone", { length: 32 }),
  country: varchar("country", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Properties table for real estate listings managed via admin panel.
 */
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  titleId: varchar("titleId", { length: 256 }),
  type: mysqlEnum("type", ["villa", "commercial", "office", "land", "warehouse"]).notNull(),
  listingType: mysqlEnum("listingType", ["rent", "sale"]).notNull(),
  region: varchar("region", { length: 64 }).notNull(),
  priceUSD: int("priceUSD").notNull(),
  priceIDR: int("priceIDR").notNull(),
  priceLabel: varchar("priceLabel", { length: 32 }).default("/month"),
  area: int("area").notNull(),
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  description: text("description"),
  descriptionId: text("descriptionId"),
  features: text("features"), // JSON array
  featuresId: text("featuresId"), // JSON array
  nearbyPlaces: text("nearbyPlaces"), // JSON array
  image: varchar("image", { length: 512 }).notNull(),
  images: text("images"), // JSON array of URLs
  yearBuilt: int("yearBuilt"),
  leaseYears: int("leaseYears"),
  furnished: boolean("furnished").default(false),
  parking: int("parking"),
  pool: boolean("pool").default(false),
  lat: decimal("lat", { precision: 10, scale: 7 }),
  lng: decimal("lng", { precision: 10, scale: 7 }),
  status: mysqlEnum("status", ["active", "inactive", "draft"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

/**
 * Leads table for tracking CRM leads locally.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 256 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }),
  country: varchar("country", { length: 64 }),
  budget: varchar("budget", { length: 64 }),
  sector: varchar("sector", { length: 128 }),
  source: varchar("source", { length: 128 }),
  notes: text("notes"),
  odooLeadId: int("odooLeadId"),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "lost"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Blog posts table for content management.
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  title: varchar("title", { length: 512 }).notNull(),
  titleTr: varchar("titleTr", { length: 512 }),
  titleId: varchar("titleId", { length: 512 }),
  titleRu: varchar("titleRu", { length: 512 }),
  excerpt: text("excerpt"),
  excerptTr: text("excerptTr"),
  excerptId: text("excerptId"),
  excerptRu: text("excerptRu"),
  content: text("content").notNull(),
  contentTr: text("contentTr"),
  contentId: text("contentId"),
  contentRu: text("contentRu"),
  category: mysqlEnum("category", ["investment-guide", "legal-tax", "real-estate", "lifestyle", "news"]).notNull(),
  image: varchar("image", { length: 512 }),
  author: varchar("author", { length: 128 }).default("BaseOne Bali Team"),
  metaTitle: varchar("metaTitle", { length: 256 }),
  metaDescription: text("metaDescription"),
  status: mysqlEnum("blogStatus", ["published", "draft"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Vendor property submissions (pending review by admin).
 */
export const vendorSubmissions = mysqlTable("vendorSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  type: mysqlEnum("vendorType", ["villa", "commercial", "office", "land", "warehouse"]).notNull(),
  listingType: mysqlEnum("vendorListingType", ["rent", "sale"]).notNull(),
  region: varchar("region", { length: 64 }).notNull(),
  priceUSD: int("priceUSD").notNull(),
  area: int("area").notNull(),
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  features: text("features"),
  imageUrls: text("imageUrls"),
  contactName: varchar("contactName", { length: 128 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 32 }),
  companyName: varchar("companyName", { length: 256 }),
  status: mysqlEnum("vendorStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
  odooLeadId: int("odooLeadId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VendorSubmission = typeof vendorSubmissions.$inferSelect;
export type InsertVendorSubmission = typeof vendorSubmissions.$inferInsert;
