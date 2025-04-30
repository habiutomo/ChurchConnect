import { Link } from "wouter";
import { 
  MessageSquareIcon,
  UserPlusIcon,
  BellIcon,
  BanknoteIcon
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ActivityLogEntry {
  id: number;
  type: 'devotional' | 'member' | 'notification' | 'finance';
  user: {
    name: string;
    role: string;
  };
  action: string;
  details?: string;
  timestamp: Date;
}

// This would typically come from API, but for now it's hardcoded
const activityLog: ActivityLogEntry[] = [
  {
    id: 1,
    type: 'devotional',
    user: {
      name: 'Pendeta Daniel',
      role: 'admin'
    },
    action: 'mengunggah renungan baru',
    details: 'Renungan harian "Kekuatan dalam Kelemahan" telah diterbitkan dan siap dibaca oleh jemaat.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    type: 'member',
    user: {
      name: 'Maria Kusuma',
      role: 'member'
    },
    action: 'mendaftar sebagai jemaat baru',
    details: 'Data jemaat baru telah ditambahkan. Hari ini ulang tahunnya!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: 3,
    type: 'notification',
    user: {
      name: 'Sistem',
      role: 'system'
    },
    action: 'mengirim pengingat jadwal ibadah',
    details: 'Notifikasi WhatsApp telah dikirim ke 213 anggota jemaat untuk ibadah hari Minggu.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: 4,
    type: 'finance',
    user: {
      name: 'Bendahara Gereja',
      role: 'staff'
    },
    action: 'menambahkan catatan keuangan',
    details: 'Persembahan Minggu 23 Juli telah dicatat sebesar Rp 3.750.000',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  }
];

const getActivityIcon = (type: string) => {
  switch(type) {
    case 'devotional':
      return (
        <div className="h-10 w-10 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center ring-8 ring-white">
          <MessageSquareIcon className="h-5 w-5 text-primary" />
        </div>
      );
    case 'member':
      return (
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
          <UserPlusIcon className="h-5 w-5 text-accent" />
        </div>
      );
    case 'notification':
      return (
        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center ring-8 ring-white">
          <BellIcon className="h-5 w-5 text-secondary" />
        </div>
      );
    case 'finance':
      return (
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
          <BanknoteIcon className="h-5 w-5 text-blue-600" />
        </div>
      );
    default:
      return (
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
          <MessageSquareIcon className="h-5 w-5 text-gray-600" />
        </div>
      );
  }
};

const ActivityLogCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-medium font-heading text-neutral-darkest">Aktivitas Terbaru</h3>
        <Link href="#">
          <a className="text-sm text-primary font-medium hover:text-primary-dark">Lihat Semua</a>
        </Link>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activityLog.map((activity, index) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {index < activityLog.length - 1 && (
                    <span 
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" 
                      aria-hidden="true"
                    ></span>
                  )}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a href="#" className="font-medium text-neutral-darkest">
                            {activity.user.name}
                          </a>
                          <span className="text-gray-500"> {activity.action} </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                      {activity.details && (
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{activity.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogCard;
