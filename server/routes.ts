import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { 
  insertDevotionalSchema, 
  insertMemberSchema, 
  insertEventSchema, 
  insertFinanceTransactionSchema,
  insertNotificationTemplateSchema,
  insertSentNotificationSchema,
  insertBookmarkSchema,
  insertAttendanceSchema,
  insertRoomBookingSchema,
  insertEquipmentBookingSchema
} from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API ROUTES
  // All API routes are prefixed with /api

  // Dashboard Routes
  app.get("/api/dashboard", async (req, res) => {
    try {
      const members = await storage.getMembers();
      const devotionals = await storage.getDevotionals();
      const events = await storage.getUpcomingEvents(3);
      
      // Get current month financial transactions
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const transactions = await storage.getFinanceTransactionsByDate(firstDay, lastDay);
      
      // Calculate total income and expenses
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0);
      
      // Group expenses by category
      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((categories, t) => {
          const category = t.category;
          if (!categories[category]) {
            categories[category] = 0;
          }
          categories[category] += t.amount;
          return categories;
        }, {} as Record<string, number>);
      
      // Get birthday members for current month or today
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();
      const birthdayMembers = await storage.getBirthdayMembers(currentMonth);
      
      // Sort birthday members by day
      birthdayMembers.sort((a, b) => {
        const aDate = new Date(a.dateOfBirth).getDate();
        const bDate = new Date(b.dateOfBirth).getDate();
        return aDate - bDate;
      });
      
      // Get anniversary members for current month
      const anniversaryMembers = await storage.getAnniversaryMembers(currentMonth);
      
      // Sort anniversary members by day
      anniversaryMembers.sort((a, b) => {
        const aDate = a.anniversaryDate ? new Date(a.anniversaryDate).getDate() : 0;
        const bDate = b.anniversaryDate ? new Date(b.anniversaryDate).getDate() : 0;
        return aDate - bDate;
      });
      
      // Get today's devotional
      const todayDevotional = await storage.getDevotionalByDate(today);
      
      res.json({
        stats: {
          totalMembers: members.length,
          attendanceThisWeek: 187, // Placeholder - would calculate from attendance records
          devotionalsRead: 152, // Placeholder - would calculate from user analytics
          monthlyIncome: income
        },
        devotional: todayDevotional,
        events,
        birthdayMembers,
        anniversaryMembers,
        finances: {
          income,
          expenses,
          expensesByCategory
        }
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Devotional Routes
  app.get("/api/devotionals", async (req, res) => {
    try {
      const devotionals = await storage.getDevotionals();
      res.json(devotionals);
    } catch (error) {
      console.error("Error fetching devotionals:", error);
      res.status(500).json({ error: "Failed to fetch devotionals" });
    }
  });

  app.get("/api/devotionals/today", async (req, res) => {
    try {
      const today = new Date();
      const devotional = await storage.getDevotionalByDate(today);
      
      if (!devotional) {
        return res.status(404).json({ error: "No devotional found for today" });
      }
      
      res.json(devotional);
    } catch (error) {
      console.error("Error fetching today's devotional:", error);
      res.status(500).json({ error: "Failed to fetch today's devotional" });
    }
  });

  app.get("/api/devotionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const devotional = await storage.getDevotional(id);
      
      if (!devotional) {
        return res.status(404).json({ error: "Devotional not found" });
      }
      
      res.json(devotional);
    } catch (error) {
      console.error("Error fetching devotional:", error);
      res.status(500).json({ error: "Failed to fetch devotional" });
    }
  });

  app.post("/api/devotionals", async (req, res) => {
    try {
      const devotionalData = insertDevotionalSchema.parse(req.body);
      const devotional = await storage.createDevotional(devotionalData);
      res.status(201).json(devotional);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating devotional:", error);
        res.status(500).json({ error: "Failed to create devotional" });
      }
    }
  });

  app.put("/api/devotionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const devotionalData = insertDevotionalSchema.partial().parse(req.body);
      const devotional = await storage.updateDevotional(id, devotionalData);
      
      if (!devotional) {
        return res.status(404).json({ error: "Devotional not found" });
      }
      
      res.json(devotional);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error updating devotional:", error);
        res.status(500).json({ error: "Failed to update devotional" });
      }
    }
  });

  app.delete("/api/devotionals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const success = await storage.deleteDevotional(id);
      
      if (!success) {
        return res.status(404).json({ error: "Devotional not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting devotional:", error);
      res.status(500).json({ error: "Failed to delete devotional" });
    }
  });

  // Bookmark Routes
  app.get("/api/bookmarks/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const bookmarks = await storage.getBookmarksByUser(userId);
      
      // Fetch devotional details for each bookmark
      const bookmarksWithDevotionals = await Promise.all(
        bookmarks.map(async (bookmark) => {
          const devotional = await storage.getDevotional(bookmark.devotionalId);
          return {
            ...bookmark,
            devotional
          };
        })
      );
      
      res.json(bookmarksWithDevotionals);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const bookmarkData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.createBookmark(bookmarkData);
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating bookmark:", error);
        res.status(500).json({ error: "Failed to create bookmark" });
      }
    }
  });

  app.delete("/api/bookmarks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const success = await storage.deleteBookmark(id);
      
      if (!success) {
        return res.status(404).json({ error: "Bookmark not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      res.status(500).json({ error: "Failed to delete bookmark" });
    }
  });

  // Member Routes
  app.get("/api/members", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      let members;
      if (category) {
        members = await storage.getMembersByCategory(category);
      } else {
        members = await storage.getMembers();
      }
      
      res.json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.get("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const member = await storage.getMember(id);
      
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      
      res.json(member);
    } catch (error) {
      console.error("Error fetching member:", error);
      res.status(500).json({ error: "Failed to fetch member" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const memberData = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating member:", error);
        res.status(500).json({ error: "Failed to create member" });
      }
    }
  });

  app.put("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const memberData = insertMemberSchema.partial().parse(req.body);
      const member = await storage.updateMember(id, memberData);
      
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      
      res.json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error updating member:", error);
        res.status(500).json({ error: "Failed to update member" });
      }
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const success = await storage.deleteMember(id);
      
      if (!success) {
        return res.status(404).json({ error: "Member not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ error: "Failed to delete member" });
    }
  });

  // Attendance Routes
  app.get("/api/attendance/event/:eventId", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const attendances = await storage.getAttendanceByEvent(eventId);
      
      // Fetch member details for each attendance
      const attendancesWithMembers = await Promise.all(
        attendances.map(async (attendance) => {
          const member = await storage.getMember(attendance.memberId);
          return {
            ...attendance,
            member
          };
        })
      );
      
      res.json(attendancesWithMembers);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      res.status(500).json({ error: "Failed to fetch attendance records" });
    }
  });

  app.get("/api/attendance/member/:memberId", async (req, res) => {
    try {
      const memberId = parseInt(req.params.memberId);
      if (isNaN(memberId)) {
        return res.status(400).json({ error: "Invalid member ID" });
      }
      
      const attendances = await storage.getAttendanceByMember(memberId);
      
      // Fetch event details for each attendance
      const attendancesWithEvents = await Promise.all(
        attendances.map(async (attendance) => {
          const event = await storage.getEvent(attendance.eventId);
          return {
            ...attendance,
            event
          };
        })
      );
      
      res.json(attendancesWithEvents);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      res.status(500).json({ error: "Failed to fetch attendance records" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error recording attendance:", error);
        res.status(500).json({ error: "Failed to record attendance" });
      }
    }
  });

  // Event Routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const events = await storage.getUpcomingEvents(limit);
      res.json(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      res.status(500).json({ error: "Failed to fetch upcoming events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Failed to create event" });
      }
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const eventData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(id, eventData);
      
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Failed to update event" });
      }
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const success = await storage.deleteEvent(id);
      
      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Room Booking Routes
  app.get("/api/room-bookings/event/:eventId", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const bookings = await storage.getRoomBookingsByEvent(eventId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching room bookings:", error);
      res.status(500).json({ error: "Failed to fetch room bookings" });
    }
  });

  app.post("/api/room-bookings", async (req, res) => {
    try {
      const bookingData = insertRoomBookingSchema.parse(req.body);
      const booking = await storage.createRoomBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating room booking:", error);
        res.status(500).json({ error: "Failed to create room booking" });
      }
    }
  });

  app.put("/api/room-bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const bookingData = insertRoomBookingSchema.partial().parse(req.body);
      const booking = await storage.updateRoomBooking(id, bookingData);
      
      if (!booking) {
        return res.status(404).json({ error: "Room booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error updating room booking:", error);
        res.status(500).json({ error: "Failed to update room booking" });
      }
    }
  });

  // Equipment Booking Routes
  app.get("/api/equipment-bookings/event/:eventId", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const bookings = await storage.getEquipmentBookingsByEvent(eventId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching equipment bookings:", error);
      res.status(500).json({ error: "Failed to fetch equipment bookings" });
    }
  });

  app.post("/api/equipment-bookings", async (req, res) => {
    try {
      const bookingData = insertEquipmentBookingSchema.parse(req.body);
      const booking = await storage.createEquipmentBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating equipment booking:", error);
        res.status(500).json({ error: "Failed to create equipment booking" });
      }
    }
  });

  app.put("/api/equipment-bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const bookingData = insertEquipmentBookingSchema.partial().parse(req.body);
      const booking = await storage.updateEquipmentBooking(id, bookingData);
      
      if (!booking) {
        return res.status(404).json({ error: "Equipment booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error updating equipment booking:", error);
        res.status(500).json({ error: "Failed to update equipment booking" });
      }
    }
  });

  // Scheduled Notifications Routes

  // Member Anniversary Routes
  app.get("/api/members/anniversary", async (req, res) => {
    try {
      const month = req.query.month ? parseInt(req.query.month as string) : new Date().getMonth() + 1;
      const day = req.query.day ? parseInt(req.query.day as string) : undefined;
      
      if (isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: "Invalid month. Must be between 1 and 12" });
      }
      
      if (day !== undefined && (isNaN(day) || day < 1 || day > 31)) {
        return res.status(400).json({ error: "Invalid day. Must be between 1 and 31" });
      }
      
      const members = await storage.getAnniversaryMembers(month, day);
      res.json(members);
    } catch (error) {
      console.error("Error fetching anniversary members:", error);
      res.status(500).json({ error: "Failed to fetch anniversary members" });
    }
  });

  // Scheduled Notifications Routes
  app.get("/api/notifications/scheduled", async (req, res) => {
    try {
      const notifications = await storage.getScheduledNotifications();
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching scheduled notifications:", error);
      res.status(500).json({ error: "Failed to fetch scheduled notifications" });
    }
  });

  app.post("/api/notifications/schedule", async (req, res) => {
    try {
      const notificationSchema = z.object({
        templateId: z.number(),
        targetId: z.number().optional(),
        targetType: z.string().optional(),
        sentTo: z.string(),
        scheduledFor: z.string().transform(val => new Date(val))
      });

      const data = notificationSchema.parse(req.body);
      const notification = await storage.scheduleNotification(
        {
          templateId: data.templateId,
          targetId: data.targetId,
          targetType: data.targetType,
          sentTo: data.sentTo,
          status: "scheduled"
        },
        data.scheduledFor
      );
      
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error scheduling notification:", error);
        res.status(500).json({ error: "Failed to schedule notification" });
      }
    }
  });

  // Invoice Route
  app.get("/api/invoice", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client", "public", "invoice.html"));
  });

  // Finance Routes
  app.get("/api/finance", async (req, res) => {
    try {
      const transactions = await storage.getFinanceTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching finance transactions:", error);
      res.status(500).json({ error: "Failed to fetch finance transactions" });
    }
  });

  app.get("/api/finance/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      if (!type || (type !== 'income' && type !== 'expense')) {
        return res.status(400).json({ error: "Invalid type. Must be 'income' or 'expense'" });
      }
      
      const transactions = await storage.getFinanceTransactionsByType(type);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching finance transactions by type:", error);
      res.status(500).json({ error: "Failed to fetch finance transactions" });
    }
  });

  app.get("/api/finance/period", async (req, res) => {
    try {
      const startDateStr = req.query.startDate as string;
      const endDateStr = req.query.endDate as string;
      
      if (!startDateStr || !endDateStr) {
        return res.status(400).json({ error: "Both startDate and endDate are required" });
      }
      
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }
      
      const transactions = await storage.getFinanceTransactionsByDate(startDate, endDate);
      
      // Calculate summary
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + t.amount, 0);
      
      // Group transactions by category
      const incomeByCategory = transactions
        .filter(t => t.type === 'income')
        .reduce((categories, t) => {
          const category = t.category;
          if (!categories[category]) {
            categories[category] = 0;
          }
          categories[category] += t.amount;
          return categories;
        }, {} as Record<string, number>);
      
      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((categories, t) => {
          const category = t.category;
          if (!categories[category]) {
            categories[category] = 0;
          }
          categories[category] += t.amount;
          return categories;
        }, {} as Record<string, number>);
      
      res.json({
        transactions,
        summary: {
          income,
          expenses,
          balance: income - expenses,
          incomeByCategory,
          expensesByCategory
        }
      });
    } catch (error) {
      console.error("Error fetching finance transactions by period:", error);
      res.status(500).json({ error: "Failed to fetch finance transactions" });
    }
  });

  app.post("/api/finance", async (req, res) => {
    try {
      const transactionData = insertFinanceTransactionSchema.parse(req.body);
      const transaction = await storage.createFinanceTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating finance transaction:", error);
        res.status(500).json({ error: "Failed to create finance transaction" });
      }
    }
  });

  // Notification Template Routes
  app.get("/api/notification-templates", async (req, res) => {
    try {
      const templates = await storage.getNotificationTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching notification templates:", error);
      res.status(500).json({ error: "Failed to fetch notification templates" });
    }
  });

  app.get("/api/notification-templates/type/:type", async (req, res) => {
    try {
      const type = req.params.type;
      const templates = await storage.getNotificationTemplatesByType(type);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching notification templates by type:", error);
      res.status(500).json({ error: "Failed to fetch notification templates" });
    }
  });

  app.post("/api/notification-templates", async (req, res) => {
    try {
      const templateData = insertNotificationTemplateSchema.parse(req.body);
      const template = await storage.createNotificationTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating notification template:", error);
        res.status(500).json({ error: "Failed to create notification template" });
      }
    }
  });

  // WhatsApp Notification Routes
  app.post("/api/send-notification", async (req, res) => {
    try {
      const { templateId, targetId, targetType, whatsappNumber, message } = req.body;
      
      if (!templateId || !whatsappNumber) {
        return res.status(400).json({ error: "TemplateId and whatsappNumber are required" });
      }
      
      // In a real implementation, this would connect to WhatsApp API
      // For this demo, we'll simulate successful sending
      const notification = await storage.createSentNotification({
        templateId,
        targetId,
        targetType,
        sentTo: whatsappNumber,
        status: "sent"
      });
      
      res.status(201).json({
        success: true,
        notification,
        message: "WhatsApp notification sent successfully"
      });
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error);
      res.status(500).json({ error: "Failed to send WhatsApp notification" });
    }
  });

  app.post("/api/send-batch-notification", async (req, res) => {
    try {
      const { templateId, members, message } = req.body;
      
      if (!templateId || !members || !Array.isArray(members) || members.length === 0) {
        return res.status(400).json({ error: "TemplateId and members array are required" });
      }
      
      // In a real implementation, this would connect to WhatsApp API
      // For this demo, we'll simulate successful sending to all members
      const sentNotifications = await Promise.all(
        members.map(async (memberId: number) => {
          const member = await storage.getMember(memberId);
          
          if (!member || !member.whatsapp) {
            return {
              memberId,
              success: false,
              error: "Member not found or missing WhatsApp number"
            };
          }
          
          const notification = await storage.createSentNotification({
            templateId,
            targetId: memberId,
            targetType: "member",
            sentTo: member.whatsapp,
            status: "sent"
          });
          
          return {
            memberId,
            success: true,
            notification
          };
        })
      );
      
      res.status(201).json({
        success: true,
        sentNotifications,
        message: `Batch WhatsApp notifications sent to ${sentNotifications.filter(n => n.success).length}/${members.length} members`
      });
    } catch (error) {
      console.error("Error sending batch WhatsApp notifications:", error);
      res.status(500).json({ error: "Failed to send batch WhatsApp notifications" });
    }
  });

  return httpServer;
}
