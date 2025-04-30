import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("member"),
  email: text("email"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Members schema
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  whatsapp: text("whatsapp"),
  category: text("category").notNull(), // anak, remaja, dewasa, lansia
  baptismStatus: boolean("baptism_status").default(false),
  baptismDate: date("baptism_date"),
  photo: text("photo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
});

// Attendance schema
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  eventId: integer("event_id").notNull(),
  date: date("date").notNull(),
  status: boolean("status").notNull().default(true),
  notes: text("notes"),
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
});

// Devotional schema
export const devotionals = pgTable("devotionals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  scripture: text("scripture").notNull(),
  scriptureCitation: text("scripture_citation").notNull(),
  category: text("category"),
  mediaType: text("media_type").default("text"), // text, audio, video
  mediaUrl: text("media_url"),
  date: date("date").notNull(),
  authorId: integer("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDevotionalSchema = createInsertSchema(devotionals).omit({
  id: true,
  createdAt: true,
});

// Bookmarks schema
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  devotionalId: integer("devotional_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

// Events schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location"),
  status: text("status").notNull().default("scheduled"), // scheduled, ongoing, completed, cancelled
  category: text("category"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});

// Room Bookings schema
export const roomBookings = pgTable("room_bookings", {
  id: serial("id").primaryKey(),
  roomName: text("room_name").notNull(),
  eventId: integer("event_id").notNull(),
  bookedBy: integer("booked_by").notNull(),
  date: date("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRoomBookingSchema = createInsertSchema(roomBookings).omit({
  id: true,
  createdAt: true,
});

// Equipment Bookings schema
export const equipmentBookings = pgTable("equipment_bookings", {
  id: serial("id").primaryKey(),
  equipmentName: text("equipment_name").notNull(),
  eventId: integer("event_id").notNull(),
  bookedBy: integer("booked_by").notNull(),
  date: date("date").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEquipmentBookingSchema = createInsertSchema(equipmentBookings).omit({
  id: true,
  createdAt: true,
});

// Finance Transactions schema
export const financeTransactions = pgTable("finance_transactions", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  type: text("type").notNull(), // income, expense
  category: text("category").notNull(), // persembahan, donasi, operasional, bantuan sosial, dll
  amount: integer("amount").notNull(),
  description: text("description"),
  recordedBy: integer("recorded_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFinanceTransactionSchema = createInsertSchema(financeTransactions).omit({
  id: true,
  createdAt: true,
});

// Notification Templates schema
export const notificationTemplates = pgTable("notification_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // birthday, event, devotional, etc.
  content: text("content").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNotificationTemplateSchema = createInsertSchema(notificationTemplates).omit({
  id: true,
  createdAt: true,
});

// Sent Notifications schema
export const sentNotifications = pgTable("sent_notifications", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  targetId: integer("target_id"), // member_id, event_id, etc.
  targetType: text("target_type"), // member, event, etc.
  sentTo: text("sent_to").notNull(), // phone number
  status: text("status").notNull(), // sent, failed
  sentAt: timestamp("sent_at").notNull().defaultNow(),
});

export const insertSentNotificationSchema = createInsertSchema(sentNotifications).omit({
  id: true,
  sentAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type Devotional = typeof devotionals.$inferSelect;
export type InsertDevotional = z.infer<typeof insertDevotionalSchema>;

export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type RoomBooking = typeof roomBookings.$inferSelect;
export type InsertRoomBooking = z.infer<typeof insertRoomBookingSchema>;

export type EquipmentBooking = typeof equipmentBookings.$inferSelect;
export type InsertEquipmentBooking = z.infer<typeof insertEquipmentBookingSchema>;

export type FinanceTransaction = typeof financeTransactions.$inferSelect;
export type InsertFinanceTransaction = z.infer<typeof insertFinanceTransactionSchema>;

export type NotificationTemplate = typeof notificationTemplates.$inferSelect;
export type InsertNotificationTemplate = z.infer<typeof insertNotificationTemplateSchema>;

export type SentNotification = typeof sentNotifications.$inferSelect;
export type InsertSentNotification = z.infer<typeof insertSentNotificationSchema>;
