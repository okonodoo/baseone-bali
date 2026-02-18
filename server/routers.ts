import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { storagePut } from "./storage";
import { createOdooLead, syncOdooContact, createOdooSaleOrder, validateAffiliateCode, setAffiliateReferral, createScoutingFeeOrder, getOdooPrices, getOdooPricelist, clearPriceCache, createOdooProductFromVendor, activateOdooProduct, deactivateOdooProduct, activatePortalAccess } from "./odoo";
import { createXenditInvoice, getExchangeRateInfo } from "./xendit";
import { sendNewLeadNotification, sendVendorSubmissionNotification } from "./email";
import { partnerRouter } from "./routers/partner";
import { authRouter } from "./routers/auth";
import {
  getUserById, updateUserProfile, getAllUsers, updateUserRole, adminUpdateUserTier,
  getAllProperties, getPropertyById as getDbPropertyById, createProperty, updateProperty, deleteProperty,
  createLead, getRecentLeads, getDashboardStats, updateLeadStatus,
  getPublishedBlogPosts, getBlogPostBySlug, getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost,
  createVendorSubmission, getAllVendorSubmissions, getPendingVendorSubmissions, updateVendorSubmissionStatus,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  partner: partnerRouter,

  auth: router({
    me: publicProcedure.query((opts) => {
      if (!opts.ctx.user) return null;
      const { passwordHash, ...safeUser } = opts.ctx.user;
      return safeUser;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    register: authRouter._def.procedures.register,
    login: authRouter._def.procedures.login,
  }),

  // ==================== PROFILE ====================
  profile: router({
    update: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        country: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, input);
        
        if ((input.name || input.phone || input.country) && ctx.user.email) {
          try {
            await syncOdooContact({
              email: ctx.user.email || "",
              name: input.name || ctx.user.name || "",
              phone: input.phone,
              country: input.country,
            });
          } catch (e) {
            console.warn("[Profile] Odoo sync failed:", e);
          }
        }
        
        return { success: true };
      }),
  }),

  // ==================== LEAD ====================
  lead: router({
    create: publicProcedure
      .input(z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional().default(""),
        country: z.string().min(1),
        budget: z.string(),
        sector: z.string(),
        notes: z.string().optional(),
        source: z.string().optional(),
        language: z.string().optional(),
        aiRecommendations: z.string().optional(),
        wizardResults: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Save to local DB
        try {
          await createLead({
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            country: input.country,
            budget: input.budget,
            sector: input.sector,
            source: input.source || "website",
            notes: [input.notes, input.aiRecommendations, input.wizardResults].filter(Boolean).join("\n\n"),
          });
        } catch (e) {
          console.warn("[Lead] Failed to save to local DB:", e);
        }

        // Send email notification to admin
        sendNewLeadNotification({
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          budget: input.budget,
          sector: input.sector,
          source: input.source,
          notes: input.notes,
        }).catch((e) => console.warn("[Email] Failed to send lead notification:", e));

        // Send to Odoo CRM
        const result = await createOdooLead(input);
        if (!result.success) {
          console.warn("[Lead] Odoo CRM failed, but acknowledging user:", result.error);
        }
        return {
          success: true,
          message: result.success
            ? "Lead created successfully in CRM"
            : "Request received — our team will follow up",
        };
      }),
  }),

  // ==================== SUBSCRIPTION ====================
  subscription: router({
    status: publicProcedure.query(({ ctx }) => {
      if (!ctx.user) {
        return { tier: "free" as const, isAuthenticated: false };
      }
      return {
        tier: (ctx.user.subscriptionTier || "free") as "free" | "premium" | "vip",
        isAuthenticated: true,
      };
    }),
    checkout: protectedProcedure
      .input(z.object({
        productKey: z.enum(["premium", "vip", "scoutingFee"]),
        affiliateCode: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = ctx.user;
        const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.headers.host}`;
        return createXenditInvoice({
          productKey: input.productKey,
          userId: user.id,
          userEmail: user.email || "",
          userName: user.name || "",
          origin,
          affiliateCode: input.affiliateCode,
          userCountry: user.country,
        });
      }),
    exchangeRate: publicProcedure.query(async () => {
      return getExchangeRateInfo();
    }),
    // Dynamic pricing from Odoo
    prices: publicProcedure.query(async () => {
      const odooPrices = await getOdooPrices();
      const exchangeRate = await getExchangeRateInfo();
      return { prices: odooPrices, exchangeRate };
    }),
    pricelist: publicProcedure
      .input(z.object({ name: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getOdooPricelist(input?.name);
      }),
    clearPriceCache: adminProcedure.mutation(async () => {
      clearPriceCache();
      return { success: true, message: 'Price and rate caches cleared' };
    }),
  }),

  // ==================== BLOG ====================
  blog: router({
    list: publicProcedure.query(async () => {
      return getPublishedBlogPosts();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getBlogPostBySlug(input.slug);
      }),
  }),

  // ==================== VENDOR PORTAL ====================
  vendor: router({
    uploadImage: publicProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
        fileSize: z.number(),
      }))
      .mutation(async ({ input }) => {
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (input.fileSize > MAX_FILE_SIZE) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "File size exceeds 5MB limit" });
        }
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(input.mimeType)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Only JPEG, PNG, WebP and GIF images are allowed" });
        }
        const buffer = Buffer.from(input.fileData, "base64");
        const ext = input.mimeType.split("/")[1] || "jpg";
        const randomSuffix = Math.random().toString(36).substring(2, 10);
        const fileKey = `vendor-images/${Date.now()}-${randomSuffix}.${ext}`;
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        return { url, fileKey };
      }),
    submit: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(["villa", "commercial", "office", "land", "warehouse"]),
        listingType: z.enum(["rent", "sale"]),
        region: z.string().min(1),
        priceUSD: z.number().min(0),
        area: z.number().min(0),
        bedrooms: z.number().optional(),
        bathrooms: z.number().optional(),
        features: z.string().optional(),
        imageUrls: z.string().optional(),
        contactName: z.string().min(1),
        contactEmail: z.string().email(),
        contactPhone: z.string().optional(),
        companyName: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Save to DB as pending
        const id = await createVendorSubmission({
          ...input,
          status: "pending",
        });

        // Send email notifications
        sendVendorSubmissionNotification({
          contactName: input.contactName,
          contactEmail: input.contactEmail,
          title: input.title,
          type: input.type,
          region: input.region,
          priceUSD: input.priceUSD,
        }).catch((e) => console.warn("[Email] Failed to send vendor notification:", e));

        // Create Odoo lead for vendor
        createOdooLead({
          fullName: input.contactName,
          email: input.contactEmail,
          phone: input.contactPhone || "",
          country: "Indonesia",
          budget: `$${input.priceUSD.toLocaleString()}`,
          sector: input.type,
          notes: `Vendor Submission: ${input.title}\nType: ${input.type}\nRegion: ${input.region}\nPrice: $${input.priceUSD.toLocaleString()}\nArea: ${input.area}m²\nCompany: ${input.companyName || "N/A"}`,
          source: "vendor-portal",
        }).catch((e) => console.warn("[Odoo] Failed to create vendor lead:", e));

        // Create product.template in Odoo as inactive (pending approval)
        createOdooProductFromVendor({
          title: input.title,
          description: input.description,
          type: input.type,
          region: input.region,
          priceUSD: input.priceUSD,
          area: input.area,
          bedrooms: input.bedrooms,
          bathrooms: input.bathrooms,
          contactName: input.contactName,
          contactEmail: input.contactEmail,
        }).catch((e) => console.warn("[Odoo] Failed to create vendor product:", e));

        return { success: true, id };
      }),
  }),

  // ==================== ADMIN ====================
  admin: router({
    // Dashboard stats
    dashboard: adminProcedure.query(async () => {
      const stats = await getDashboardStats();
      const recentLeads = await getRecentLeads(10);
      return { stats, recentLeads };
    }),

    // User management
    users: router({
      list: adminProcedure.query(async () => {
        return getAllUsers();
      }),
      updateRole: adminProcedure
        .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
        .mutation(async ({ input }) => {
          await updateUserRole(input.userId, input.role);
          return { success: true };
        }),
      updateTier: adminProcedure
        .input(z.object({ userId: z.number(), tier: z.enum(["free", "premium", "vip"]) }))
        .mutation(async ({ input }) => {
          await adminUpdateUserTier(input.userId, input.tier);
          return { success: true };
        }),
    }),

    // Property management
    properties: router({
      list: adminProcedure.query(async () => {
        return getAllProperties();
      }),
      get: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return getDbPropertyById(input.id);
        }),
      create: adminProcedure
        .input(z.object({
          title: z.string().min(1),
          titleId: z.string().optional(),
          type: z.enum(["villa", "commercial", "office", "land", "warehouse"]),
          listingType: z.enum(["rent", "sale"]),
          region: z.string().min(1),
          priceUSD: z.number().min(0),
          priceIDR: z.number().min(0),
          priceLabel: z.string().optional(),
          area: z.number().min(0),
          bedrooms: z.number().optional(),
          bathrooms: z.number().optional(),
          description: z.string().optional(),
          descriptionId: z.string().optional(),
          features: z.string().optional(),
          featuresId: z.string().optional(),
          nearbyPlaces: z.string().optional(),
          image: z.string().min(1),
          images: z.string().optional(),
          yearBuilt: z.number().optional(),
          leaseYears: z.number().optional(),
          furnished: z.boolean().optional(),
          parking: z.number().optional(),
          pool: z.boolean().optional(),
          lat: z.string().optional(),
          lng: z.string().optional(),
          status: z.enum(["active", "inactive", "draft"]).optional(),
        }))
        .mutation(async ({ input }) => {
          const id = await createProperty({
            ...input,
            priceLabel: input.priceLabel || (input.listingType === "rent" ? "/month" : ""),
            status: input.status || "active",
          });
          return { success: true, id };
        }),
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          title: z.string().optional(),
          titleId: z.string().optional(),
          type: z.enum(["villa", "commercial", "office", "land", "warehouse"]).optional(),
          listingType: z.enum(["rent", "sale"]).optional(),
          region: z.string().optional(),
          priceUSD: z.number().optional(),
          priceIDR: z.number().optional(),
          priceLabel: z.string().optional(),
          area: z.number().optional(),
          bedrooms: z.number().optional(),
          bathrooms: z.number().optional(),
          description: z.string().optional(),
          descriptionId: z.string().optional(),
          features: z.string().optional(),
          featuresId: z.string().optional(),
          nearbyPlaces: z.string().optional(),
          image: z.string().optional(),
          images: z.string().optional(),
          yearBuilt: z.number().optional(),
          leaseYears: z.number().optional(),
          furnished: z.boolean().optional(),
          parking: z.number().optional(),
          pool: z.boolean().optional(),
          lat: z.string().optional(),
          lng: z.string().optional(),
          status: z.enum(["active", "inactive", "draft"]).optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await updateProperty(id, data);
          return { success: true };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteProperty(input.id);
          return { success: true };
        }),
    }),

    // Lead management
    leads: router({
      list: adminProcedure
        .input(z.object({ limit: z.number().optional() }).optional())
        .query(async ({ input }) => {
          return getRecentLeads(input?.limit || 100);
        }),
      updateStatus: adminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["new", "contacted", "qualified", "lost"]),
        }))
        .mutation(async ({ input }) => {
          await updateLeadStatus(input.id, input.status);
          return { success: true };
        }),
    }),

    // Blog management
    blog: router({
      list: adminProcedure.query(async () => {
        return getAllBlogPosts();
      }),
      create: adminProcedure
        .input(z.object({
          slug: z.string().min(1),
          title: z.string().min(1),
          titleTr: z.string().optional(),
          titleId: z.string().optional(),
          titleRu: z.string().optional(),
          excerpt: z.string().optional(),
          excerptTr: z.string().optional(),
          excerptId: z.string().optional(),
          excerptRu: z.string().optional(),
          content: z.string().min(1),
          contentTr: z.string().optional(),
          contentId: z.string().optional(),
          contentRu: z.string().optional(),
          category: z.enum(["investment-guide", "legal-tax", "real-estate", "lifestyle", "news"]),
          image: z.string().optional(),
          author: z.string().optional(),
          metaTitle: z.string().optional(),
          metaDescription: z.string().optional(),
          status: z.enum(["published", "draft"]).optional(),
        }))
        .mutation(async ({ input }) => {
          const id = await createBlogPost({
            ...input,
            status: input.status || "draft",
            publishedAt: input.status === "published" ? new Date() : undefined,
          });
          return { success: true, id };
        }),
      update: adminProcedure
        .input(z.object({
          id: z.number(),
          slug: z.string().optional(),
          title: z.string().optional(),
          titleTr: z.string().optional(),
          titleId: z.string().optional(),
          titleRu: z.string().optional(),
          excerpt: z.string().optional(),
          excerptTr: z.string().optional(),
          excerptId: z.string().optional(),
          excerptRu: z.string().optional(),
          content: z.string().optional(),
          contentTr: z.string().optional(),
          contentId: z.string().optional(),
          contentRu: z.string().optional(),
          category: z.enum(["investment-guide", "legal-tax", "real-estate", "lifestyle", "news"]).optional(),
          image: z.string().optional(),
          author: z.string().optional(),
          metaTitle: z.string().optional(),
          metaDescription: z.string().optional(),
          status: z.enum(["published", "draft"]).optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          if (data.status === "published") {
            (data as any).publishedAt = new Date();
          }
          await updateBlogPost(id, data);
          return { success: true };
        }),
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteBlogPost(input.id);
          return { success: true };
        }),
    }),

    // Odoo sync
    odooSync: router({
      syncContact: adminProcedure
        .input(z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          country: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const result = await syncOdooContact(input);
          return result;
        }),
      createSaleOrder: adminProcedure
        .input(z.object({
          email: z.string().email(),
          name: z.string().min(1),
          tier: z.enum(["premium", "vip"]),
        }))
        .mutation(async ({ input }) => {
          const result = await createOdooSaleOrder(input);
          return result;
        }),
      activatePortalAccess: adminProcedure
        .input(z.object({
          email: z.string().email(),
        }))
        .mutation(async ({ input }) => {
          const result = await activatePortalAccess(input.email);
          return result;
        }),
    }),

    // Affiliate management
    affiliates: router({
      validate: publicProcedure
        .input(z.object({ code: z.string() }))
        .query(async ({ input }) => {
          return validateAffiliateCode(input.code);
        }),
    }),

    // Vendor submissions management
    vendors: router({
      list: adminProcedure.query(async () => {
        return getAllVendorSubmissions();
      }),
      updateStatus: adminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["pending", "approved", "rejected"]),
          odooProductId: z.number().optional(),
        }))
        .mutation(async ({ input }) => {
          await updateVendorSubmissionStatus(input.id, input.status);

          // Sync approval/rejection to Odoo product.template
          if (input.odooProductId) {
            if (input.status === "approved") {
              activateOdooProduct(input.odooProductId).catch((e) =>
                console.warn("[Odoo] Failed to activate vendor product:", e)
              );
            } else if (input.status === "rejected") {
              deactivateOdooProduct(input.odooProductId).catch((e) =>
                console.warn("[Odoo] Failed to deactivate vendor product:", e)
              );
            }
          }

          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
