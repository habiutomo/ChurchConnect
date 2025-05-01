import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Scheduled Notifications schema
export const scheduledNotifications = pgTable("scheduled_notifications", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  targetId: integer("target_id"),  // member_id, event_id, etc.
  targetType: text("target_type"), // member, event, etc.
  recipientIds: integer("recipient_ids").array().notNull(), // member IDs to send to
  content: text("content").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  recurrence: text("recurrence"), // once, daily, weekly, monthly, yearly
  status: text("status").notNull().default("pending"), // pending, sent, failed, cancelled
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertScheduledNotificationSchema = createInsertSchema(scheduledNotifications).omit({
  id: true,
  createdAt: true,
});

export type ScheduledNotification = typeof scheduledNotifications.$inferSelect;
export type InsertScheduledNotification = z.infer<typeof insertScheduledNotificationSchema>;
