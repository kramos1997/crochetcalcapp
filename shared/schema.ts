import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Project categories
export const projectCategories = pgTable("project_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project templates
export const projectTemplates = pgTable("project_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => projectCategories.id),
  avgMaterialCost: decimal("avg_material_cost", { precision: 10, scale: 2 }),
  avgHours: decimal("avg_hours", { precision: 5, scale: 2 }),
  suggestedPrice: decimal("suggested_price", { precision: 10, scale: 2 }),
  complexity: varchar("complexity", { length: 20 }).default("simple"),
  materials: jsonb("materials").$type<Array<{ name: string; quantity: number; unitCost: number }>>(),
  isPublic: boolean("is_public").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => projectCategories.id),
  templateId: integer("template_id").references(() => projectTemplates.id),
  
  // Materials
  materials: jsonb("materials").$type<{ name: string; quantity: number; unitCost: number; totalCost: number }[]>(),
  
  // Labor
  hourlyRate: decimal("hourly_rate", { precision: 5, scale: 2 }),
  hoursSpent: decimal("hours_spent", { precision: 5, scale: 2 }),
  complexityFactor: decimal("complexity_factor", { precision: 3, scale: 2 }).default("1.00"),
  
  // Business costs
  businessExpenses: jsonb("business_expenses").$type<Array<{ name: string; cost: number }>>(),
  
  // Pricing factors
  profitMargin: decimal("profit_margin", { precision: 5, scale: 2 }),
  shippingCost: decimal("shipping_cost", { precision: 8, scale: 2 }),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }),
  
  // Calculated prices
  materialsCost: decimal("materials_cost", { precision: 10, scale: 2 }),
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }),
  businessCost: decimal("business_cost", { precision: 10, scale: 2 }),
  baseCost: decimal("base_cost", { precision: 10, scale: 2 }),
  profitAmount: decimal("profit_amount", { precision: 10, scale: 2 }),
  wholesalePrice: decimal("wholesale_price", { precision: 10, scale: 2 }),
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }),
  
  status: varchar("status", { length: 20 }).default("draft"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  templates: many(projectTemplates),
}));

export const projectCategoriesRelations = relations(projectCategories, ({ many }) => ({
  projects: many(projects),
  templates: many(projectTemplates),
}));

export const projectTemplatesRelations = relations(projectTemplates, ({ one, many }) => ({
  category: one(projectCategories, {
    fields: [projectTemplates.categoryId],
    references: [projectCategories.id],
  }),
  createdByUser: one(users, {
    fields: [projectTemplates.createdBy],
    references: [users.id],
  }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  category: one(projectCategories, {
    fields: [projects.categoryId],
    references: [projectCategories.id],
  }),
  template: one(projectTemplates, {
    fields: [projects.templateId],
    references: [projectTemplates.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertProjectCategorySchema = createInsertSchema(projectCategories).omit({
  id: true,
  createdAt: true,
});

export const insertProjectTemplateSchema = createInsertSchema(projectTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = insertProjectSchema.partial().extend({
  updatedAt: z.date().default(new Date()),
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type ProjectCategory = typeof projectCategories.$inferSelect;
export type InsertProjectCategory = z.infer<typeof insertProjectCategorySchema>;
export type ProjectTemplate = typeof projectTemplates.$inferSelect;
export type InsertProjectTemplate = z.infer<typeof insertProjectTemplateSchema>;
