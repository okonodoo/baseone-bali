import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { executeKw, getOdooConfig } from "../odoo";
import { sendDocumentRequestEmail } from "../email";

// ==================== Zod Schemas ====================

const OdooCrmStageSchema = z.object({
  id: z.number(),
  name: z.string(),
  sequence: z.number(),
  team_ids: z.array(z.number()),
  is_won: z.boolean(),
});

const OdooCrmLeadSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  partner_name: z.string().nullable().optional(),
  email_from: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  stage_id: z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  team_id: z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  expected_revenue: z.number().nullable().optional(),
  x_contract_status: z.union([z.string(), z.literal(false)]).nullable().optional(),
  x_company_name_custom: z.union([z.string(), z.literal(false)]).nullable().optional(),
  x_investment_amount: z.number().nullable().optional(),
  create_date: z.string().nullable().optional(),
  write_date: z.string().nullable().optional(),
});

const OdooProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  list_price: z.number(),
  categ_id: z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  x_is_real_estate: z.boolean().optional(),
  x_location_lat: z.number().optional(),
  x_location_long: z.number().optional(),
  x_projected_roi: z.number().optional(),
  x_total_units: z.number().optional(),
  x_available_units: z.number().optional(),
  x_documents_link: z.union([z.string(), z.literal(false)]).nullable().optional(),
  active: z.boolean().optional(),
  description_sale: z.union([z.string(), z.literal(false)]).nullable().optional(),
});

const OdooTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  stage_id: z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  x_portal_status_percentage: z.number().optional(),
  date_deadline: z.union([z.string(), z.literal(false)]).nullable().optional(),
  description: z.union([z.string(), z.literal(false)]).nullable().optional(),
});

// ==================== Constants ====================

const VGR_TEAM_ID = 5;
const REAL_ESTATE_CATEGORY_ID = 4;
const ADMIN_UID = 2;

/** VGR Pipeline Stage IDs */
const VGR_STAGES = {
  KYC_CHECK: 9,
  DUE_DILIGENCE: 10,
  CONTRACT_DRAFTING: 11,
  WAITING_SIGNATURE: 12,
  PT_PMA_SETUP: 13,
  KITAS_PROCESS: 14,
  COMPLETED: 15,
} as const;

/** crm.lead model ID in ir.model */
const CRM_LEAD_MODEL_ID = 436;

// ==================== Helper ====================

async function getOdooUid() {
  const config = getOdooConfig();
  return { config, uid: ADMIN_UID };
}

// ==================== Router ====================

export const partnerRouter = router({
  // ==================== VGR CRM PIPELINE ====================

  /** Get VGR Operations CRM stages */
  getVgrStages: protectedProcedure.query(async () => {
    try {
      const { config, uid } = await getOdooUid();
      const stages = await executeKw(
        config, uid, "crm.stage", "search_read",
        [[["team_ids", "in", [VGR_TEAM_ID]]]],
        { fields: ["id", "name", "sequence", "team_ids", "is_won"], order: "sequence asc" }
      );
      return { success: true, stages: (stages || []).map((s: unknown) => OdooCrmStageSchema.parse(s)) };
    } catch (error) {
      console.error("[Partner] Error fetching VGR stages:", error);
      return { success: false, stages: [], error: error instanceof Error ? error.message : "Unknown error" };
    }
  }),

  /** Get VGR Operations CRM leads/opportunities */
  getVgrLeads: protectedProcedure
    .input(z.object({
      stageId: z.number().optional(),
      limit: z.number().optional().default(50),
    }).optional())
    .query(async ({ input }) => {
      try {
        const { config, uid } = await getOdooUid();
        const domain: unknown[][] = [["team_id", "=", VGR_TEAM_ID]];
        if (input?.stageId) {
          domain.push(["stage_id", "=", input.stageId]);
        }
        const leads = await executeKw(
          config, uid, "crm.lead", "search_read",
          [domain],
          {
            fields: [
              "id", "name", "partner_name", "email_from", "phone",
              "stage_id", "team_id", "expected_revenue",
              "x_contract_status", "x_company_name_custom", "x_investment_amount",
              "create_date", "write_date"
            ],
            limit: input?.limit || 50,
            order: "create_date desc",
          }
        );
        return {
          success: true,
          leads: (leads || []).map((l: unknown) => OdooCrmLeadSchema.parse(l)),
        };
      } catch (error) {
        console.error("[Partner] Error fetching VGR leads:", error);
        return { success: false, leads: [], error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /** Get VGR pipeline summary (count per stage) */
  getVgrPipelineSummary: protectedProcedure.query(async () => {
    try {
      const { config, uid } = await getOdooUid();

      // Get stages
      const stages = await executeKw(
        config, uid, "crm.stage", "search_read",
        [[["team_ids", "in", [VGR_TEAM_ID]]]],
        { fields: ["id", "name", "sequence", "is_won"], order: "sequence asc" }
      );

      // Get lead counts per stage
      const summary: Array<{ stageId: number; stageName: string; count: number; isWon: boolean }> = [];
      for (const stage of (stages || [])) {
        const count = await executeKw(
          config, uid, "crm.lead", "search_count",
          [[["team_id", "=", VGR_TEAM_ID], ["stage_id", "=", stage.id]]]
        );
        summary.push({
          stageId: stage.id,
          stageName: stage.name,
          count: count || 0,
          isWon: stage.is_won || false,
        });
      }

      return { success: true, summary };
    } catch (error) {
      console.error("[Partner] Error fetching VGR pipeline summary:", error);
      return { success: false, summary: [], error: error instanceof Error ? error.message : "Unknown error" };
    }
  }),

  /** Update a CRM lead's stage — with blocking activity checks */
  updateLeadStage: adminProcedure
    .input(z.object({
      leadId: z.number(),
      stageId: z.number(),
      contractStatus: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { config, uid } = await getOdooUid();

        // ── BLOCKING CHECK: KYC → Due Diligence requires passport ──
        if (input.stageId === VGR_STAGES.DUE_DILIGENCE) {
          // Get current stage of the lead
          const leadData = await executeKw(
            config, uid, "crm.lead", "read",
            [[input.leadId], ["stage_id"]]
          );
          const currentStageId = Array.isArray(leadData?.[0]?.stage_id)
            ? leadData[0].stage_id[0]
            : null;

          if (currentStageId === VGR_STAGES.KYC_CHECK) {
            // Check for passport attachment on this lead
            const attachments = await executeKw(
              config, uid, "ir.attachment", "search_read",
              [[
                ["res_model", "=", "crm.lead"],
                ["res_id", "=", input.leadId],
                ["name", "ilike", "passport"],
              ]],
              { fields: ["id", "name"], limit: 1 }
            );

            if (!attachments || attachments.length === 0) {
              throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: "Hata: Müşteri pasaportu yüklenmeden Due Diligence aşamasına geçilemez! Lütfen önce pasaport belgesini yükleyin.",
              });
            }
          }
        }

        // ── Write the stage change ──
        const vals: Record<string, unknown> = { stage_id: input.stageId };
        if (input.contractStatus) {
          vals.x_contract_status = input.contractStatus;
        }
        await executeKw(config, uid, "crm.lead", "write", [[input.leadId], vals]);

        // ── DOCUMENT REQUEST FLOW: Auto-email on KYC Check entry ──
        if (input.stageId === VGR_STAGES.KYC_CHECK) {
          try {
            // Get lead details for email
            const leadInfo = await executeKw(
              config, uid, "crm.lead", "read",
              [[input.leadId], ["partner_name", "email_from", "user_id"]]
            );
            const lead = leadInfo?.[0];
            if (lead?.email_from) {
              // Send document request email to customer
              await sendDocumentRequestEmail({
                name: lead.partner_name || "Valued Client",
                email: lead.email_from,
                leadId: input.leadId,
              });
              console.log(`[VGR] Document request email sent to ${lead.email_from} for lead ${input.leadId}`);
            }

            // Create "Document Request Sent" activity for the advisor
            const advisorUserId = Array.isArray(lead?.user_id) ? lead.user_id[0] : uid;
            await executeKw(
              config, uid, "mail.activity", "create",
              [[{
                res_model_id: CRM_LEAD_MODEL_ID,
                res_id: input.leadId,
                activity_type_id: 5, // Document type
                summary: "KYC Document Request Sent",
                note: `<p>Müşteriye pasaport yükleme talebi gönderildi. Evrak geldiğinde bu aktiviteyi tamamlayın.</p>`,
                user_id: advisorUserId,
                date_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              }]]
            );
            console.log(`[VGR] Document activity created for lead ${input.leadId}`);
          } catch (emailErr) {
            // Don't block stage change if email/activity fails
            console.error("[VGR] Failed to send document request:", emailErr);
          }
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Partner] Error updating lead stage:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /** Upload passport attachment to a CRM lead */
  uploadLeadAttachment: protectedProcedure
    .input(z.object({
      leadId: z.number(),
      fileName: z.string().min(1),
      fileBase64: z.string().min(1),
      mimeType: z.string().default("application/pdf"),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { config, uid } = await getOdooUid();

        // Create attachment on the CRM lead
        const attachmentId = await executeKw(
          config, uid, "ir.attachment", "create",
          [[{
            name: `Passport - ${input.fileName}`,
            res_model: "crm.lead",
            res_id: input.leadId,
            datas: input.fileBase64,
            mimetype: input.mimeType,
            description: `Uploaded by user ${ctx.user.email || ctx.user.name} via BaseOne portal`,
          }]]
        );

        console.log(`[VGR] Attachment ${attachmentId} created on lead ${input.leadId}: ${input.fileName}`);

        // Create "Document Received" activity for the advisor
        try {
          const leadInfo = await executeKw(
            config, uid, "crm.lead", "read",
            [[input.leadId], ["user_id"]]
          );
          const advisorUserId = Array.isArray(leadInfo?.[0]?.user_id) ? leadInfo[0].user_id[0] : uid;

          await executeKw(
            config, uid, "mail.activity", "create",
            [[{
              res_model_id: CRM_LEAD_MODEL_ID,
              res_id: input.leadId,
              activity_type_id: 5, // Document type
              summary: "Evrak Geldi — Passport Uploaded",
              note: `<p>Müşteri pasaportunu yükledi: <strong>${input.fileName}</strong>. Lütfen kontrol edin ve KYC sürecini ilerletin.</p>`,
              user_id: advisorUserId,
              date_deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            }]]
          );
          console.log(`[VGR] Document received activity created for lead ${input.leadId}`);
        } catch (actErr) {
          console.error("[VGR] Failed to create document received activity:", actErr);
        }

        return { success: true, attachmentId: attachmentId as number };
      } catch (error) {
        console.error("[Partner] Error uploading lead attachment:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /** Get attachments for a CRM lead */
  getLeadAttachments: protectedProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ input }) => {
      try {
        const { config, uid } = await getOdooUid();
        const attachments = await executeKw(
          config, uid, "ir.attachment", "search_read",
          [[
            ["res_model", "=", "crm.lead"],
            ["res_id", "=", input.leadId],
          ]],
          { fields: ["id", "name", "mimetype", "file_size", "create_date"], order: "create_date desc" }
        );
        return { success: true, attachments: attachments || [] };
      } catch (error) {
        console.error("[Partner] Error fetching lead attachments:", error);
        return { success: false, attachments: [], error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /** Get the current user's CRM lead (by email match) */
  getMyLead: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { config, uid } = await getOdooUid();
      const email = ctx.user.email;
      if (!email) return { success: false, lead: null, error: "No email on user" };

      const leads = await executeKw(
        config, uid, "crm.lead", "search_read",
        [[
          ["email_from", "=", email],
          ["team_id", "=", VGR_TEAM_ID],
        ]],
        {
          fields: [
            "id", "name", "partner_name", "email_from", "phone",
            "stage_id", "team_id", "expected_revenue",
            "x_contract_status", "x_company_name_custom", "x_investment_amount",
            "create_date", "write_date"
          ],
          limit: 1,
          order: "create_date desc",
        }
      );

      if (!leads || leads.length === 0) {
        return { success: true, lead: null };
      }

      return { success: true, lead: OdooCrmLeadSchema.parse(leads[0]) };
    } catch (error) {
      console.error("[Partner] Error fetching user's lead:", error);
      return { success: false, lead: null, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }),

  // ==================== SUPPLIER PRODUCT MANAGEMENT ====================

  /** Get all real estate products from Odoo */
  getSupplierProducts: protectedProcedure
    .input(z.object({
      onlyRealEstate: z.boolean().optional().default(true),
      limit: z.number().optional().default(50),
    }).optional())
    .query(async ({ input }) => {
      try {
        const { config, uid } = await getOdooUid();
        const domain: unknown[][] = input?.onlyRealEstate !== false
          ? [["x_is_real_estate", "=", true]]
          : [];
        const products = await executeKw(
          config, uid, "product.template", "search_read",
          [domain],
          {
            fields: [
              "id", "name", "list_price", "categ_id",
              "x_is_real_estate", "x_location_lat", "x_location_long",
              "x_projected_roi", "x_total_units", "x_available_units",
              "x_documents_link", "active", "description_sale"
            ],
            limit: input?.limit || 50,
            order: "create_date desc",
          }
        );
        return {
          success: true,
          products: (products || []).map((p: unknown) => OdooProductSchema.parse(p)),
        };
      } catch (error) {
        console.error("[Partner] Error fetching supplier products:", error);
        return { success: false, products: [], error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /** Create a new real estate product in Odoo */
  createSupplierProduct: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      listPrice: z.number().min(0),
      locationLat: z.number().optional(),
      locationLong: z.number().optional(),
      projectedRoi: z.number().optional(),
      totalUnits: z.number().optional(),
      availableUnits: z.number().optional(),
      documentsLink: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { config, uid } = await getOdooUid();
        const vals: Record<string, unknown> = {
          name: input.name,
          list_price: input.listPrice,
          categ_id: REAL_ESTATE_CATEGORY_ID,
          x_is_real_estate: true,
          type: "service",
        };
        if (input.locationLat !== undefined) vals.x_location_lat = input.locationLat;
        if (input.locationLong !== undefined) vals.x_location_long = input.locationLong;
        if (input.projectedRoi !== undefined) vals.x_projected_roi = input.projectedRoi;
        if (input.totalUnits !== undefined) vals.x_total_units = input.totalUnits;
        if (input.availableUnits !== undefined) vals.x_available_units = input.availableUnits;
        if (input.documentsLink) vals.x_documents_link = input.documentsLink;
        if (input.description) vals.description_sale = input.description;

        const result = await executeKw(config, uid, "product.template", "create", [[vals]]);
        const productId = Array.isArray(result) ? result[0] : result;
        return { success: true, productId };
      } catch (error) {
        console.error("[Partner] Error creating supplier product:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /** Update a real estate product in Odoo */
  updateSupplierProduct: adminProcedure
    .input(z.object({
      productId: z.number(),
      name: z.string().optional(),
      listPrice: z.number().optional(),
      locationLat: z.number().optional(),
      locationLong: z.number().optional(),
      projectedRoi: z.number().optional(),
      totalUnits: z.number().optional(),
      availableUnits: z.number().optional(),
      documentsLink: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { config, uid } = await getOdooUid();
        const vals: Record<string, unknown> = {};
        if (input.name !== undefined) vals.name = input.name;
        if (input.listPrice !== undefined) vals.list_price = input.listPrice;
        if (input.locationLat !== undefined) vals.x_location_lat = input.locationLat;
        if (input.locationLong !== undefined) vals.x_location_long = input.locationLong;
        if (input.projectedRoi !== undefined) vals.x_projected_roi = input.projectedRoi;
        if (input.totalUnits !== undefined) vals.x_total_units = input.totalUnits;
        if (input.availableUnits !== undefined) vals.x_available_units = input.availableUnits;
        if (input.documentsLink !== undefined) vals.x_documents_link = input.documentsLink;
        if (input.description !== undefined) vals.description_sale = input.description;

        await executeKw(config, uid, "product.template", "write", [[input.productId], vals]);
        return { success: true };
      } catch (error) {
        console.error("[Partner] Error updating supplier product:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  // ==================== PROJECT TASKS (EXISTING) ====================

  /** Get tasks assigned to the current user's partner */
  getTasks: protectedProcedure
    .input(z.object({ partnerId: z.number().optional() }))
    .query(async ({ ctx }) => {
      try {
        const { config, uid } = await getOdooUid();
        const tasks = await executeKw(
          config, uid, "project.task", "search_read",
          [[["partner_id", "=", ctx.user.id]]],
          { fields: ["id", "name", "stage_id", "x_portal_status_percentage", "date_deadline", "description"] }
        );
        return {
          success: true,
          result: (tasks || []).map((t: unknown) => OdooTaskSchema.parse(t)),
        };
      } catch (error) {
        console.error("[Partner] Error fetching partner tasks:", error);
        return { success: false, result: [], error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /** Get documents for the current user's partner */
  getDocuments: protectedProcedure
    .input(z.object({ partnerId: z.number().optional() }))
    .query(async ({ ctx }) => {
      try {
        const { config, uid } = await getOdooUid();
        const documents = await executeKw(
          config, uid, "documents.document", "search_read",
          [[["partner_id", "=", ctx.user.id]]],
          { fields: ["id", "name", "attachment_id", "create_date"] }
        );
        return { success: true, result: documents || [] };
      } catch (error) {
        console.error("[Partner] Error fetching partner documents:", error);
        return { success: false, result: [], error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),

  /** Update a task's stage and percentage */
  updateTaskStatus: protectedProcedure
    .input(z.object({
      taskId: z.number(),
      stageId: z.number(),
      percentage: z.number().min(0).max(100).optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { config, uid } = await getOdooUid();
        const updateData: Record<string, unknown> = { stage_id: input.stageId };
        if (input.percentage !== undefined) {
          updateData.x_portal_status_percentage = input.percentage;
        }
        await executeKw(config, uid, "project.task", "write", [[input.taskId], updateData]);
        return { success: true, message: "Task updated successfully" };
      } catch (error) {
        console.error("[Partner] Error updating task:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
      }
    }),
});
