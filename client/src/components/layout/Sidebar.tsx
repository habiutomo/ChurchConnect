import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  BookOpenIcon, 
  UsersIcon, 
  BellIcon, 
  BanknoteIcon, 
  CalendarIcon, 
  LogOutIcon,
  HelpCircleIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { IntroductionDialog } from "./IntroductionDialog";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ href, icon, children, isActive }: NavItemProps) => {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-md", 
        isActive 
          ? "text-white bg-primary" 
          : "text-neutral-dark hover:text-primary hover:bg-gray-50"
      )}
    >
      <span className="w-5 h-5 mr-3">{icon}</span>
      {children}
    </Link>
  );
};

const Sidebar = () => {
  const [location] = useLocation();
  const [openIntroDialog, setOpenIntroDialog] = useState(false);

  // Auto-show intro dialog for first-time users
  useEffect(() => {
    // Read status from localStorage
    const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
    
    // If first time, show dialog after a delay
    if (!hasSeenIntro) {
      const timer = setTimeout(() => {
        setOpenIntroDialog(true);
        localStorage.setItem('hasSeenIntro', 'true');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 flex-col fixed h-full bg-white border-r border-gray-200 z-10">
        <div className="flex items-center justify-center h-20 border-b border-gray-200 px-4">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <h1 className="font-heading font-bold text-xl text-primary">IMMANUEL</h1>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto pt-4 px-2">
          <div className="space-y-1">
            <NavItem 
              href="/" 
              icon={<HomeIcon className="w-5 h-5" />} 
              isActive={location === "/"}
            >
              Dashboard
            </NavItem>
            
            <NavItem 
              href="/devotional" 
              icon={<BookOpenIcon className="w-5 h-5" />} 
              isActive={location === "/devotional"}
            >
              Renungan Harian
            </NavItem>
            
            <NavItem 
              href="/members" 
              icon={<UsersIcon className="w-5 h-5" />} 
              isActive={location === "/members"}
            >
              Data Jemaat
            </NavItem>
            
            <NavItem 
              href="/notifications" 
              icon={<BellIcon className="w-5 h-5" />} 
              isActive={location === "/notifications"}
            >
              Notifikasi
            </NavItem>
            
            <NavItem 
              href="/finance" 
              icon={<BanknoteIcon className="w-5 h-5" />} 
              isActive={location === "/finance"}
            >
              Keuangan
            </NavItem>
            
            <NavItem 
              href="/calendar" 
              icon={<CalendarIcon className="w-5 h-5" />} 
              isActive={location === "/calendar"}
            >
              Agenda & Jadwal
            </NavItem>
          </div>
        </nav>
        
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              PD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Pendeta Daniel</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <button 
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => setOpenIntroDialog(true)}
            >
              <HelpCircleIcon className="w-4 h-4 mr-2" />
              Memulai
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <IntroductionDialog open={openIntroDialog} onOpenChange={setOpenIntroDialog} />
    </>
  );
};

export default Sidebar;