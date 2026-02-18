/**
 * Zod Validation Schemas for Odoo V19 JSON-RPC Responses
 * Ensures type safety and catches schema mismatches early
 */
import { z } from "zod";

// ==================== PRODUCT SCHEMA ====================
export const OdooProductSchema = z.object({
  id: z.number().int().positive("Product ID must be positive"),
  name: z.string().min(1, "Product name is required"),
  list_price: z.number().nonnegative("List price cannot be negative"),
  default_code: z.string().optional(),
  type: z.enum(["consu", "service", "product"]).optional(),
  categ_id: z.array(z.number()).optional(),
});

export type OdooProduct = z.infer<typeof OdooProductSchema>;

// ==================== LEAD SCHEMA ====================
export const OdooLeadSchema = z.object({
  id: z.number().int().positive("Lead ID must be positive"),
  name: z.string().min(1, "Lead name is required"),
  email_from: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  stage_id: z.array(z.number()).optional(),
  partner_id: z.array(z.number()).optional(),
  x_budget: z.number().optional(),
  x_sector: z.string().optional(),
  x_affiliate_code: z.string().optional(),
});

export type OdooLead = z.infer<typeof OdooLeadSchema>;

// ==================== CONTACT (RES.PARTNER) SCHEMA ====================
export const OdooContactSchema = z.object({
  id: z.number().int().positive("Contact ID must be positive"),
  name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  country_id: z.array(z.number()).optional(),
  type: z.enum(["contact", "invoice", "delivery", "other"]).optional(),
  is_company: z.boolean().optional(),
  x_is_affiliate: z.boolean().optional(),
  x_affiliate_code: z.string().optional(),
});

export type OdooContact = z.infer<typeof OdooContactSchema>;

// ==================== EXCHANGE RATE SCHEMA ====================
export const OdooExchangeRateSchema = z.object({
  id: z.number().int().positive("Exchange rate ID must be positive"),
  name: z.string().min(1, "Currency name is required"),
  rate: z.number().positive("Exchange rate must be positive"),
  currency_id: z.array(z.number()).optional(),
  company_id: z.array(z.number()).optional(),
});

export type OdooExchangeRate = z.infer<typeof OdooExchangeRateSchema>;

// ==================== SALE ORDER SCHEMA ====================
export const OdooSaleOrderSchema = z.object({
  id: z.number().int().positive("Sale order ID must be positive"),
  name: z.string().min(1, "Order name is required"),
  partner_id: z.array(z.number()).optional(),
  amount_total: z.number().nonnegative("Amount cannot be negative"),
  state: z.enum(["draft", "sent", "sale", "done", "cancel"]).optional(),
  order_line: z.array(z.number()).optional(),
});

export type OdooSaleOrder = z.infer<typeof OdooSaleOrderSchema>;

// ==================== USER SCHEMA ====================
export const OdooUserSchema = z.object({
  id: z.number().int().positive("User ID must be positive"),
  name: z.string().min(1, "User name is required"),
  login: z.string().email("Login must be an email"),
  email: z.string().email("Invalid email format").optional(),
  active: z.boolean().optional(),
  groups_id: z.array(z.number()).optional(),
});

export type OdooUser = z.infer<typeof OdooUserSchema>;

// ==================== VALIDATION HELPERS ====================

/**
 * Safely parse Odoo response with schema validation
 * Throws descriptive error if validation fails
 */
export function validateOdooResponse<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  context: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`).join("; ");
      throw new Error(`Odoo ${context} validation failed: ${issues}`);
    }
    throw error;
  }
}

/**
 * Safely parse array of Odoo responses
 */
export function validateOdooResponseArray<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  context: string
): T[] {
  if (!Array.isArray(data)) {
    throw new Error(`Odoo ${context} response must be an array, got ${typeof data}`);
  }

  return data.map((item, index) => {
    try {
      return schema.parse(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`).join("; ");
        throw new Error(`Odoo ${context}[${index}] validation failed: ${issues}`);
      }
      throw error;
    }
  });
}
