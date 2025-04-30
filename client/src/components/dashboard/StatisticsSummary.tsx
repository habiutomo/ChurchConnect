import { Users, CheckIcon, BookOpenIcon, BanknoteIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatisticsSummaryProps {
  totalMembers: number;
  attendance: number;
  devotionalsRead: number;
  monthlyIncome: number;
}

const StatisticsSummary = ({ 
  totalMembers, 
  attendance, 
  devotionalsRead, 
  monthlyIncome 
}: StatisticsSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Jemaat Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Jemaat</p>
            <p className="text-2xl font-bold mt-1">{totalMembers}</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">+5 minggu ini</span>
        </div>
      </div>
      
      {/* Kehadiran Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Kehadiran Minggu Ini</p>
            <p className="text-2xl font-bold mt-1">{attendance}</p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <CheckIcon className="w-6 h-6 text-accent" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {Math.round((attendance / totalMembers) * 100)}% dari total
          </span>
        </div>
      </div>
      
      {/* Renungan Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Renungan Dibaca</p>
            <p className="text-2xl font-bold mt-1">{devotionalsRead}</p>
          </div>
          <div className="p-2 bg-yellow-50 rounded-lg">
            <BookOpenIcon className="w-6 h-6 text-secondary" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">+12% dari minggu lalu</span>
        </div>
      </div>
      
      {/* Persembahan Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pemasukan Bulan Ini</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(monthlyIncome)}</p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <BanknoteIcon className="w-6 h-6 text-secondary-dark" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">+8% dari bulan lalu</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSummary;
