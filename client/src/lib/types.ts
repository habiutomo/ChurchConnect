// User types
export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  email?: string;
  createdAt: Date;
}

// Member types
export interface Member {
  id: number;
  name: string;
  gender: string;
  dateOfBirth: Date;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  category: string;
  baptismStatus: boolean;
  baptismDate?: Date;
  photo?: string;
  createdAt: Date;
}

// Attendance types
export interface Attendance {
  id: number;
  memberId: number;
  eventId: number;
  date: Date;
  status: boolean;
  notes?: string;
}

export interface AttendanceWithMember extends Attendance {
  member?: Member;
}

// Devotional types
export interface Devotional {
  id: number;
  title: string;
  content: string;
  scripture: string;
  scriptureCitation: string;
  category?: string;
  mediaType: 'text' | 'audio' | 'video';
  mediaUrl?: string;
  date: Date;
  authorId: number;
  createdAt: Date;
}

// Bookmark types
export interface Bookmark {
  id: number;
  userId: number;
  devotionalId: number;
  createdAt: Date;
  devotional?: Devotional;
}

// Event types
export interface Event {
  id: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location?: string;
  status: 'scheduled' | 'preparation' | 'registration' | 'ongoing' | 'completed' | 'cancelled';
  category?: string;
  createdBy: number;
  createdAt: Date;
}

// Room Booking types
export interface RoomBooking {
  id: number;
  roomName: string;
  eventId: number;
  bookedBy: number;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

// Equipment Booking types
export interface EquipmentBooking {
  id: number;
  equipmentName: string;
  eventId: number;
  bookedBy: number;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

// Finance Transaction types
export interface FinanceTransaction {
  id: number;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  recordedBy: number;
  createdAt: Date;
}

// Notification Template types
export interface NotificationTemplate {
  id: number;
  name: string;
  type: string;
  content: string;
  createdBy: number;
  createdAt: Date;
}

// Sent Notification types
export interface SentNotification {
  id: number;
  templateId: number;
  targetId?: number;
  targetType?: string;
  sentTo: string;
  status: 'sent' | 'failed';
  sentAt: Date;
}

// Dashboard types
export interface DashboardData {
  stats: {
    totalMembers: number;
    attendanceThisWeek: number;
    devotionalsRead: number;
    monthlyIncome: number;
  };
  devotional: Devotional;
  events: Event[];
  birthdayMembers: Member[];
  finances: {
    income: number;
    expenses: number;
    expensesByCategory: Record<string, number>;
  };
}

// Finance summary types
export interface FinanceSummary {
  income: number;
  expenses: number;
  balance: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
}

export interface FinanceReportData {
  transactions: FinanceTransaction[];
  summary: FinanceSummary;
}

// Activity log entry type
export interface ActivityLogEntry {
  id: number;
  type: 'devotional' | 'member' | 'notification' | 'finance' | 'event';
  action: string;
  user: {
    name: string;
    role: string;
  };
  target?: string;
  timestamp: Date;
  details?: string;
}
