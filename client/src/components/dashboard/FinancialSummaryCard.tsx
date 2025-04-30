import { Link } from "wouter";
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  BadgePercentIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface FinancialSummaryCardProps {
  income: number;
  expenses: number;
  expensesByCategory: Record<string, number>;
}

const formatCategoryName = (category: string): string => {
  // Convert snake_case to Title Case
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const calculatePercentage = (value: number, total: number): number => {
  return Math.round((value / total) * 100);
};

const FinancialSummaryCard = ({ 
  income, 
  expenses, 
  expensesByCategory 
}: FinancialSummaryCardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("juli_2023");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-medium font-heading text-neutral-darkest">Ringkasan Keuangan</h3>
        <Link href="/finance">
          <a className="text-sm text-primary font-medium hover:text-primary-dark">Laporan Lengkap</a>
        </Link>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <span className="text-xs text-gray-500">Periode</span>
            <h4 className="text-sm font-semibold">Juli 2023</h4>
          </div>
          <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="juli_2023">Juli 2023</SelectItem>
              <SelectItem value="juni_2023">Juni 2023</SelectItem>
              <SelectItem value="mei_2023">Mei 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-green-50 rounded-lg p-4">
            <span className="text-xs text-gray-500">Total Pemasukan</span>
            <p className="text-lg font-bold text-status-success">{formatCurrency(income)}</p>
            <span className="text-xs inline-flex items-center text-green-800">
              <ArrowUpIcon className="w-3 h-3 mr-1" />
              8% dari bulan lalu
            </span>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <span className="text-xs text-gray-500">Total Pengeluaran</span>
            <p className="text-lg font-bold text-status-error">{formatCurrency(expenses)}</p>
            <span className="text-xs inline-flex items-center text-red-800">
              <ArrowDownIcon className="w-3 h-3 mr-1" />
              12% dari bulan lalu
            </span>
          </div>
        </div>
        
        <div>
          <h5 className="text-sm font-medium mb-3">Kategori Pengeluaran</h5>
          <div className="space-y-3">
            {Object.entries(expensesByCategory).map(([category, amount]) => {
              const percentage = calculatePercentage(amount, expenses);
              const colors = {
                operasional: 'bg-primary',
                bantuan_sosial: 'bg-secondary',
                pembangunan: 'bg-accent',
                default: 'bg-gray-400'
              };
              
              // Determine the color based on category or use default
              const barColor = colors[category as keyof typeof colors] || colors.default;
              
              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">{formatCategoryName(category)}</span>
                    <span className="text-xs font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryCard;
