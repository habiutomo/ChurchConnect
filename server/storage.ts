import {
  User,
  InsertUser,
  Member,
  InsertMember,
  Attendance,
  InsertAttendance,
  Devotional,
  InsertDevotional,
  Bookmark,
  InsertBookmark,
  Event,
  InsertEvent,
  RoomBooking,
  InsertRoomBooking,
  EquipmentBooking,
  InsertEquipmentBooking,
  FinanceTransaction,
  InsertFinanceTransaction,
  NotificationTemplate,
  InsertNotificationTemplate,
  SentNotification,
  InsertSentNotification,
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Member operations
  getMember(id: number): Promise<Member | undefined>;
  getMembers(): Promise<Member[]>;
  getMembersByCategory(category: string): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, member: Partial<InsertMember>): Promise<Member | undefined>;
  deleteMember(id: number): Promise<boolean>;
  getBirthdayMembers(month: number, day?: number): Promise<Member[]>;
  getAnniversaryMembers(month: number, day?: number): Promise<Member[]>;
  
  // Attendance operations
  getAttendance(id: number): Promise<Attendance | undefined>;
  getAttendanceByEvent(eventId: number): Promise<Attendance[]>;
  getAttendanceByMember(memberId: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  
  // Devotional operations
  getDevotional(id: number): Promise<Devotional | undefined>;
  getDevotionals(): Promise<Devotional[]>;
  getDevotionalByDate(date: Date): Promise<Devotional | undefined>;
  createDevotional(devotional: InsertDevotional): Promise<Devotional>;
  updateDevotional(id: number, devotional: Partial<InsertDevotional>): Promise<Devotional | undefined>;
  deleteDevotional(id: number): Promise<boolean>;
  
  // Bookmark operations
  getBookmark(id: number): Promise<Bookmark | undefined>;
  getBookmarksByUser(userId: number): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(id: number): Promise<boolean>;
  
  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Room booking operations
  getRoomBooking(id: number): Promise<RoomBooking | undefined>;
  getRoomBookingsByEvent(eventId: number): Promise<RoomBooking[]>;
  createRoomBooking(booking: InsertRoomBooking): Promise<RoomBooking>;
  updateRoomBooking(id: number, booking: Partial<InsertRoomBooking>): Promise<RoomBooking | undefined>;
  
  // Equipment booking operations
  getEquipmentBooking(id: number): Promise<EquipmentBooking | undefined>;
  getEquipmentBookingsByEvent(eventId: number): Promise<EquipmentBooking[]>;
  createEquipmentBooking(booking: InsertEquipmentBooking): Promise<EquipmentBooking>;
  updateEquipmentBooking(id: number, booking: Partial<InsertEquipmentBooking>): Promise<EquipmentBooking | undefined>;
  
  // Finance operations
  getFinanceTransaction(id: number): Promise<FinanceTransaction | undefined>;
  getFinanceTransactions(): Promise<FinanceTransaction[]>;
  getFinanceTransactionsByType(type: string): Promise<FinanceTransaction[]>;
  getFinanceTransactionsByCategory(category: string): Promise<FinanceTransaction[]>;
  getFinanceTransactionsByDate(startDate: Date, endDate: Date): Promise<FinanceTransaction[]>;
  createFinanceTransaction(transaction: InsertFinanceTransaction): Promise<FinanceTransaction>;
  
  // Notification template operations
  getNotificationTemplate(id: number): Promise<NotificationTemplate | undefined>;
  getNotificationTemplates(): Promise<NotificationTemplate[]>;
  getNotificationTemplatesByType(type: string): Promise<NotificationTemplate[]>;
  createNotificationTemplate(template: InsertNotificationTemplate): Promise<NotificationTemplate>;
  
  // Sent notification operations
  getSentNotification(id: number): Promise<SentNotification | undefined>;
  getSentNotifications(): Promise<SentNotification[]>;
  getScheduledNotifications(): Promise<SentNotification[]>;
  createSentNotification(notification: InsertSentNotification): Promise<SentNotification>;
  scheduleNotification(notification: InsertSentNotification, scheduleDate: Date): Promise<SentNotification>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private members: Map<number, Member>;
  private attendances: Map<number, Attendance>;
  private devotionals: Map<number, Devotional>;
  private bookmarks: Map<number, Bookmark>;
  private events: Map<number, Event>;
  private roomBookings: Map<number, RoomBooking>;
  private equipmentBookings: Map<number, EquipmentBooking>;
  private financeTransactions: Map<number, FinanceTransaction>;
  private notificationTemplates: Map<number, NotificationTemplate>;
  private sentNotifications: Map<number, SentNotification>;
  
  private userIdCounter: number;
  private memberIdCounter: number;
  private attendanceIdCounter: number;
  private devotionalIdCounter: number;
  private bookmarkIdCounter: number;
  private eventIdCounter: number;
  private roomBookingIdCounter: number;
  private equipmentBookingIdCounter: number;
  private financeTransactionIdCounter: number;
  private notificationTemplateIdCounter: number;
  private sentNotificationIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.members = new Map();
    this.attendances = new Map();
    this.devotionals = new Map();
    this.bookmarks = new Map();
    this.events = new Map();
    this.roomBookings = new Map();
    this.equipmentBookings = new Map();
    this.financeTransactions = new Map();
    this.notificationTemplates = new Map();
    this.sentNotifications = new Map();
    
    this.userIdCounter = 1;
    this.memberIdCounter = 1;
    this.attendanceIdCounter = 1;
    this.devotionalIdCounter = 1;
    this.bookmarkIdCounter = 1;
    this.eventIdCounter = 1;
    this.roomBookingIdCounter = 1;
    this.equipmentBookingIdCounter = 1;
    this.financeTransactionIdCounter = 1;
    this.notificationTemplateIdCounter = 1;
    this.sentNotificationIdCounter = 1;
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123",  // In a real app, this would be hashed
      fullName: "Pendeta Daniel",
      role: "admin",
      email: "admin@immanuel.church",
    });

    // Add sample data for demonstration
    this.initSampleData();
  }

  // Initialize sample data for demonstration
  private async initSampleData() {
    // Sample members
    const member1 = await this.createMember({
      name: "Maria Kusuma",
      gender: "female",
      dateOfBirth: new Date("1990-07-25"),
      address: "Jl. Merdeka No. 123, Jakarta",
      phone: "081234567890",
      email: "maria@example.com",
      whatsapp: "081234567890",
      category: "dewasa",
      baptismStatus: true,
      baptismDate: new Date("2005-03-15"),
      maritalStatus: "Married",
      anniversaryDate: new Date("2015-10-15"),
      spouseName: "Budi Santoso",
      photo: "",
    });

    await this.createMember({
      name: "Andreas Wijaya",
      gender: "male",
      dateOfBirth: new Date("2008-07-26"),
      address: "Jl. Sudirman No. 45, Jakarta",
      phone: "081234567891",
      email: "andreas@example.com",
      whatsapp: "081234567891",
      category: "remaja",
      baptismStatus: false,
      baptismDate: undefined,
      maritalStatus: "Single",
      photo: "",
    });

    await this.createMember({
      name: "Samuel Budiman",
      gender: "male",
      dateOfBirth: new Date("1981-07-28"),
      address: "Jl. Gatot Subroto No. 87, Jakarta",
      phone: "081234567892",
      email: "samuel@example.com",
      whatsapp: "081234567892",
      category: "dewasa",
      baptismStatus: true,
      baptismDate: new Date("1997-05-20"),
      maritalStatus: "Married",
      anniversaryDate: new Date("2010-05-28"),
      spouseName: "Debora Wijaya",
      photo: "",
    });

    // Sample devotional
    await this.createDevotional({
      title: "Kekuatan dalam Kelemahan",
      content: "Ketika kita mengakui kelemahan kita di hadapan Tuhan, justru di saat itulah kekuatan-Nya nyata dalam hidup kita.",
      scripture: "Tetapi jawab Tuhan kepadaku: 'Cukuplah kasih karunia-Ku bagimu, sebab justru dalam kelemahanlah kuasa-Ku menjadi sempurna.' Sebab itu terlebih suka aku bermegah atas kelemahanku.",
      scriptureCitation: "2 Korintus 12:9",
      category: "Iman",
      mediaType: "text",
      mediaUrl: "",
      date: new Date(),
      authorId: 1,
    });

    // Sample events
    await this.createEvent({
      title: "Ibadah Minggu Pagi",
      description: "Ibadah minggu pagi untuk seluruh jemaat",
      startDate: new Date("2023-07-28"),
      endDate: new Date("2023-07-28"),
      startTime: "08:00",
      endTime: "10:00",
      location: "Ruang Utama",
      status: "scheduled",
      category: "Ibadah",
      createdBy: 1,
    });

    await this.createEvent({
      title: "Doa Syafaat",
      description: "Pertemuan doa untuk kebutuhan gereja dan jemaat",
      startDate: new Date("2023-07-30"),
      endDate: new Date("2023-07-30"),
      startTime: "19:00",
      endTime: "21:00",
      location: "Ruang Doa",
      status: "preparation",
      category: "Doa",
      createdBy: 1,
    });

    await this.createEvent({
      title: "Pemahaman Alkitab",
      description: "Penelaahan Alkitab bersama",
      startDate: new Date("2023-08-02"),
      endDate: new Date("2023-08-02"),
      startTime: "18:30",
      endTime: "20:30",
      location: "Aula Serbaguna",
      status: "registration",
      category: "Belajar Alkitab",
      createdBy: 1,
    });

    // Sample finance transactions
    await this.createFinanceTransaction({
      date: new Date("2023-07-23"),
      type: "income",
      category: "persembahan",
      amount: 3750000,
      description: "Persembahan Minggu 23 Juli",
      recordedBy: 1,
    });

    await this.createFinanceTransaction({
      date: new Date("2023-07-20"),
      type: "expense",
      category: "operasional",
      amount: 2450000,
      description: "Biaya operasional gereja Juli 2023",
      recordedBy: 1,
    });

    await this.createFinanceTransaction({
      date: new Date("2023-07-15"),
      type: "expense",
      category: "bantuan_sosial",
      amount: 1750000,
      description: "Bantuan untuk jemaat yang sakit",
      recordedBy: 1,
    });

    await this.createFinanceTransaction({
      date: new Date("2023-07-10"),
      type: "expense",
      category: "pembangunan",
      amount: 1640000,
      description: "Proyek renovasi atap gereja",
      recordedBy: 1,
    });

    // Sample notification templates
    await this.createNotificationTemplate({
      name: "Pengingat Ibadah",
      type: "event",
      content: "Salam, {name}. Kami mengingatkan bahwa besok akan diadakan {event} pada pukul {time} di {location}. Tuhan memberkati.",
      createdBy: 1,
    });

    await this.createNotificationTemplate({
      name: "Ucapan Ulang Tahun",
      type: "birthday",
      content: "Selamat ulang tahun, {name}! Semoga Tuhan memberkati dan membimbing langkahmu di tahun yang baru ini. Tuhan kasih kamu!",
      createdBy: 1,
    });

    await this.createNotificationTemplate({
      name: "Ucapan Ulang Tahun Pernikahan",
      type: "anniversary",
      content: "Selamat ulang tahun pernikahan yang ke-{years} untuk {name} & {spouse}! Semoga kasih Kristus semakin nyata dalam pernikahan Anda. Tuhan memberkati!",
      createdBy: 1,
    });

    await this.createNotificationTemplate({
      name: "Renungan Harian",
      type: "devotional",
      content: "Renungan hari ini: {title}\n\n{scripture} - {citation}\n\nBaca selengkapnya di aplikasi IMMANUEL.",
      createdBy: 1,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  // Member operations
  async getMember(id: number): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }

  async getMembersByCategory(category: string): Promise<Member[]> {
    return Array.from(this.members.values()).filter(
      (member) => member.category === category
    );
  }

  async createMember(member: InsertMember): Promise<Member> {
    const id = this.memberIdCounter++;
    const newMember: Member = { ...member, id, createdAt: new Date() };
    this.members.set(id, newMember);
    return newMember;
  }

  async updateMember(id: number, updatedMember: Partial<InsertMember>): Promise<Member | undefined> {
    const member = await this.getMember(id);
    if (!member) return undefined;

    const updated: Member = { ...member, ...updatedMember };
    this.members.set(id, updated);
    return updated;
  }

  async deleteMember(id: number): Promise<boolean> {
    return this.members.delete(id);
  }

  async getBirthdayMembers(month: number, day?: number): Promise<Member[]> {
    return Array.from(this.members.values()).filter((member) => {
      const dob = new Date(member.dateOfBirth);
      return dob.getMonth() + 1 === month && (day ? dob.getDate() === day : true);
    });
  }

  async getAnniversaryMembers(month: number, day?: number): Promise<Member[]> {
    return Array.from(this.members.values()).filter((member) => {
      if (!member.anniversaryDate) return false;
      const anniversaryDate = new Date(member.anniversaryDate);
      return anniversaryDate.getMonth() + 1 === month && (day ? anniversaryDate.getDate() === day : true);
    });
  }

  // Attendance operations
  async getAttendance(id: number): Promise<Attendance | undefined> {
    return this.attendances.get(id);
  }

  async getAttendanceByEvent(eventId: number): Promise<Attendance[]> {
    return Array.from(this.attendances.values()).filter(
      (attendance) => attendance.eventId === eventId
    );
  }

  async getAttendanceByMember(memberId: number): Promise<Attendance[]> {
    return Array.from(this.attendances.values()).filter(
      (attendance) => attendance.memberId === memberId
    );
  }

  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const id = this.attendanceIdCounter++;
    const newAttendance: Attendance = { ...attendance, id };
    this.attendances.set(id, newAttendance);
    return newAttendance;
  }

  // Devotional operations
  async getDevotional(id: number): Promise<Devotional | undefined> {
    return this.devotionals.get(id);
  }

  async getDevotionals(): Promise<Devotional[]> {
    return Array.from(this.devotionals.values());
  }

  async getDevotionalByDate(date: Date): Promise<Devotional | undefined> {
    return Array.from(this.devotionals.values()).find((devotional) => {
      const devotionalDate = new Date(devotional.date);
      return (
        devotionalDate.getFullYear() === date.getFullYear() &&
        devotionalDate.getMonth() === date.getMonth() &&
        devotionalDate.getDate() === date.getDate()
      );
    });
  }

  async createDevotional(devotional: InsertDevotional): Promise<Devotional> {
    const id = this.devotionalIdCounter++;
    const newDevotional: Devotional = { ...devotional, id, createdAt: new Date() };
    this.devotionals.set(id, newDevotional);
    return newDevotional;
  }

  async updateDevotional(id: number, updatedDevotional: Partial<InsertDevotional>): Promise<Devotional | undefined> {
    const devotional = await this.getDevotional(id);
    if (!devotional) return undefined;

    const updated: Devotional = { ...devotional, ...updatedDevotional };
    this.devotionals.set(id, updated);
    return updated;
  }

  async deleteDevotional(id: number): Promise<boolean> {
    return this.devotionals.delete(id);
  }

  // Bookmark operations
  async getBookmark(id: number): Promise<Bookmark | undefined> {
    return this.bookmarks.get(id);
  }

  async getBookmarksByUser(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      (bookmark) => bookmark.userId === userId
    );
  }

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.bookmarkIdCounter++;
    const newBookmark: Bookmark = { ...bookmark, id, createdAt: new Date() };
    this.bookmarks.set(id, newBookmark);
    return newBookmark;
  }

  async deleteBookmark(id: number): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    const today = new Date();
    return Array.from(this.events.values())
      .filter((event) => new Date(event.startDate) >= today)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const newEvent: Event = { ...event, id, createdAt: new Date() };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: number, updatedEvent: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = await this.getEvent(id);
    if (!event) return undefined;

    const updated: Event = { ...event, ...updatedEvent };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Room booking operations
  async getRoomBooking(id: number): Promise<RoomBooking | undefined> {
    return this.roomBookings.get(id);
  }

  async getRoomBookingsByEvent(eventId: number): Promise<RoomBooking[]> {
    return Array.from(this.roomBookings.values()).filter(
      (booking) => booking.eventId === eventId
    );
  }

  async createRoomBooking(booking: InsertRoomBooking): Promise<RoomBooking> {
    const id = this.roomBookingIdCounter++;
    const newBooking: RoomBooking = { ...booking, id, createdAt: new Date() };
    this.roomBookings.set(id, newBooking);
    return newBooking;
  }

  async updateRoomBooking(id: number, updatedBooking: Partial<InsertRoomBooking>): Promise<RoomBooking | undefined> {
    const booking = await this.getRoomBooking(id);
    if (!booking) return undefined;

    const updated: RoomBooking = { ...booking, ...updatedBooking };
    this.roomBookings.set(id, updated);
    return updated;
  }

  // Equipment booking operations
  async getEquipmentBooking(id: number): Promise<EquipmentBooking | undefined> {
    return this.equipmentBookings.get(id);
  }

  async getEquipmentBookingsByEvent(eventId: number): Promise<EquipmentBooking[]> {
    return Array.from(this.equipmentBookings.values()).filter(
      (booking) => booking.eventId === eventId
    );
  }

  async createEquipmentBooking(booking: InsertEquipmentBooking): Promise<EquipmentBooking> {
    const id = this.equipmentBookingIdCounter++;
    const newBooking: EquipmentBooking = { ...booking, id, createdAt: new Date() };
    this.equipmentBookings.set(id, newBooking);
    return newBooking;
  }

  async updateEquipmentBooking(id: number, updatedBooking: Partial<InsertEquipmentBooking>): Promise<EquipmentBooking | undefined> {
    const booking = await this.getEquipmentBooking(id);
    if (!booking) return undefined;

    const updated: EquipmentBooking = { ...booking, ...updatedBooking };
    this.equipmentBookings.set(id, updated);
    return updated;
  }

  // Finance operations
  async getFinanceTransaction(id: number): Promise<FinanceTransaction | undefined> {
    return this.financeTransactions.get(id);
  }

  async getFinanceTransactions(): Promise<FinanceTransaction[]> {
    return Array.from(this.financeTransactions.values());
  }

  async getFinanceTransactionsByType(type: string): Promise<FinanceTransaction[]> {
    return Array.from(this.financeTransactions.values()).filter(
      (transaction) => transaction.type === type
    );
  }

  async getFinanceTransactionsByCategory(category: string): Promise<FinanceTransaction[]> {
    return Array.from(this.financeTransactions.values()).filter(
      (transaction) => transaction.category === category
    );
  }

  async getFinanceTransactionsByDate(startDate: Date, endDate: Date): Promise<FinanceTransaction[]> {
    return Array.from(this.financeTransactions.values()).filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  async createFinanceTransaction(transaction: InsertFinanceTransaction): Promise<FinanceTransaction> {
    const id = this.financeTransactionIdCounter++;
    const newTransaction: FinanceTransaction = { ...transaction, id, createdAt: new Date() };
    this.financeTransactions.set(id, newTransaction);
    return newTransaction;
  }

  // Notification template operations
  async getNotificationTemplate(id: number): Promise<NotificationTemplate | undefined> {
    return this.notificationTemplates.get(id);
  }

  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    return Array.from(this.notificationTemplates.values());
  }

  async getNotificationTemplatesByType(type: string): Promise<NotificationTemplate[]> {
    return Array.from(this.notificationTemplates.values()).filter(
      (template) => template.type === type
    );
  }

  async createNotificationTemplate(template: InsertNotificationTemplate): Promise<NotificationTemplate> {
    const id = this.notificationTemplateIdCounter++;
    const newTemplate: NotificationTemplate = { ...template, id, createdAt: new Date() };
    this.notificationTemplates.set(id, newTemplate);
    return newTemplate;
  }

  // Sent notification operations
  async getSentNotification(id: number): Promise<SentNotification | undefined> {
    return this.sentNotifications.get(id);
  }

  async getSentNotifications(): Promise<SentNotification[]> {
    return Array.from(this.sentNotifications.values());
  }

  async getScheduledNotifications(): Promise<SentNotification[]> {
    return Array.from(this.sentNotifications.values()).filter(
      (notification) => notification.status === "scheduled" && notification.scheduledFor
    );
  }

  async createSentNotification(notification: InsertSentNotification): Promise<SentNotification> {
    const id = this.sentNotificationIdCounter++;
    const newNotification: SentNotification = { ...notification, id, sentAt: new Date() };
    this.sentNotifications.set(id, newNotification);
    return newNotification;
  }

  async scheduleNotification(notification: InsertSentNotification, scheduleDate: Date): Promise<SentNotification> {
    const id = this.sentNotificationIdCounter++;
    const newNotification: SentNotification = { 
      ...notification, 
      id, 
      status: "scheduled",
      scheduledFor: scheduleDate,
      sentAt: new Date() 
    };
    this.sentNotifications.set(id, newNotification);
    return newNotification;
  }
}

export const storage = new MemStorage();
