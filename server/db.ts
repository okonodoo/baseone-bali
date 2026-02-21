import { eq, desc, sql, count, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, properties, leads, blogPosts, vendorSubmissions, type InsertProperty, type InsertLead, type InsertBlogPost, type InsertVendorSubmission } from "../drizzle/schema";
// server/db.ts (Önerilen Değişiklik)
import { ENV } from './_core/env';
import type { SubscriptionTier } from "./xendit-products";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && ENV.databaseUrl) { // Direkt ENV.databaseUrl kullan
    try {
      // @ts-ignore
      _db = drizzle(ENV.databaseUrl);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER QUERIES ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserTier(userId: number, tier: SubscriptionTier) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ subscriptionTier: tier }).where(eq(users.id, userId));
  console.log(`[DB] User ${userId} tier updated to ${tier}`);
}

export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: { name?: string; phone?: string; country?: string }) {
  const db = await getDb();
  if (!db) return;
  const updateSet: Record<string, unknown> = {};
  if (data.name !== undefined) updateSet.name = data.name;
  if (data.phone !== undefined) updateSet.phone = data.phone;
  if (data.country !== undefined) updateSet.country = data.country;
  if (Object.keys(updateSet).length > 0) {
    await db.update(users).set(updateSet).where(eq(users.id, userId));
  }
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

export async function adminUpdateUserTier(userId: number, tier: "free" | "premium" | "vip") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ subscriptionTier: tier }).where(eq(users.id, userId));
}

// ==================== PROPERTY QUERIES ====================

export async function getAllProperties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties).orderBy(desc(properties.createdAt));
}

export async function getActiveProperties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties).where(eq(properties.status, "active")).orderBy(desc(properties.createdAt));
}

export async function getPropertyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProperty(data: InsertProperty) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(properties).values(data);
  return result[0].insertId;
}

export async function updateProperty(id: number, data: Partial<InsertProperty>) {
  const db = await getDb();
  if (!db) return;
  await db.update(properties).set(data).where(eq(properties.id, id));
}

export async function deleteProperty(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(properties).where(eq(properties.id, id));
}

// ==================== LEAD QUERIES ====================

export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values(data);
  return result[0].insertId;
}

export async function getRecentLeads(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit);
}

// ==================== BLOG QUERIES ====================

export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(data);
  return result[0].insertId;
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) return;
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ==================== VENDOR SUBMISSION QUERIES ====================

export async function createVendorSubmission(data: InsertVendorSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(vendorSubmissions).values(data);
  return result[0].insertId;
}

export async function getAllVendorSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vendorSubmissions).orderBy(desc(vendorSubmissions.createdAt));
}

export async function getPendingVendorSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vendorSubmissions).where(eq(vendorSubmissions.status, "pending")).orderBy(desc(vendorSubmissions.createdAt));
}

export async function updateVendorSubmissionStatus(id: number, status: "pending" | "approved" | "rejected") {
  const db = await getDb();
  if (!db) return;
  await db.update(vendorSubmissions).set({ status }).where(eq(vendorSubmissions.id, id));
}

// ==================== AUTH QUERIES ====================

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function setUserPasswordHash(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, premiumUsers: 0, vipUsers: 0, totalProperties: 0, totalLeads: 0 };

  const [userStats] = await db.select({
    total: count(),
    premium: sql<number>`SUM(CASE WHEN ${users.subscriptionTier} = 'premium' THEN 1 ELSE 0 END)`,
    vip: sql<number>`SUM(CASE WHEN ${users.subscriptionTier} = 'vip' THEN 1 ELSE 0 END)`,
  }).from(users);

  const [propStats] = await db.select({ total: count() }).from(properties);
  const [leadStats] = await db.select({ total: count() }).from(leads);

  return {
    totalUsers: userStats?.total || 0,
    premiumUsers: Number(userStats?.premium) || 0,
    vipUsers: Number(userStats?.vip) || 0,
    totalProperties: propStats?.total || 0,
    totalLeads: leadStats?.total || 0,
  };
}
// ==================== LEAD STATUS UPDATE ====================

export async function updateLeadStatus(id: number, status: "new" | "contacted" | "qualified" | "lost") {
  const db = await getDb();
  if (!db) return;
  await db.update(leads).set({ status }).where(eq(leads.id, id));
}
