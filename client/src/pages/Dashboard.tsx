import { useQuery } from "@tanstack/react-query";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StatisticsSummary from "@/components/dashboard/StatisticsSummary";
import DevotionalCard from "@/components/dashboard/DevotionalCard";
import EventsCard from "@/components/dashboard/EventsCard";
import BirthdayCard from "@/components/dashboard/BirthdayCard";
import FinancialSummaryCard from "@/components/dashboard/FinancialSummaryCard";
import ActivityLogCard from "@/components/dashboard/ActivityLogCard";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard'],
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-lg text-destructive">
        <h1 className="text-2xl font-heading font-bold mb-6">Dashboard</h1>
        <p>Terjadi kesalahan saat memuat data: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Dashboard</h1>
      
      <WelcomeCard />
      
      <StatisticsSummary 
        totalMembers={data.stats.totalMembers}
        attendance={data.stats.attendanceThisWeek}
        devotionalsRead={data.stats.devotionalsRead}
        monthlyIncome={data.stats.monthlyIncome}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DevotionalCard devotional={data.devotional} />
        <EventsCard events={data.events} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <BirthdayCard members={data.birthdayMembers} />
        <FinancialSummaryCard 
          income={data.finances.income}
          expenses={data.finances.expenses}
          expensesByCategory={data.finances.expensesByCategory}
        />
      </div>
      
      <ActivityLogCard />
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Dashboard</h1>
      
      <div className="bg-primary rounded-lg shadow-md overflow-hidden mb-6">
        <div className="md:flex">
          <div className="p-6 md:w-2/3">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-16 w-full mb-5" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="md:w-1/3 relative h-48 md:h-auto">
            <Skeleton className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mt-1" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <div className="flex items-center mt-4">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="p-6">
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
