import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, 
  BookOpenIcon, 
  UsersIcon, 
  BellIcon, 
  BanknoteIcon, 
  CalendarIcon,
  X
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ href, icon, children, isActive, onClick }: NavItemProps) => {
  return (
    <Link href={href}>
      <a 
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-md", 
          isActive 
            ? "text-white bg-primary" 
            : "text-neutral-dark hover:text-primary hover:bg-gray-50"
        )}
        onClick={onClick}
      >
        <span className="w-5 h-5 mr-3">{icon}</span>
        {children}
      </a>
    </Link>
  );
};

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile slide-in menu */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                <h1 className="font-heading font-bold text-lg text-primary">IMMANUEL</h1>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-2">
              <div className="space-y-1">
                <NavItem 
                  href="/" 
                  icon={<HomeIcon className="w-5 h-5" />} 
                  isActive={location === "/"}
                  onClick={onClose}
                >
                  Dashboard
                </NavItem>
                
                <NavItem 
                  href="/devotional" 
                  icon={<BookOpenIcon className="w-5 h-5" />} 
                  isActive={location === "/devotional"}
                  onClick={onClose}
                >
                  Renungan Harian
                </NavItem>
                
                <NavItem 
                  href="/members" 
                  icon={<UsersIcon className="w-5 h-5" />} 
                  isActive={location === "/members"}
                  onClick={onClose}
                >
                  Data Jemaat
                </NavItem>
                
                <NavItem 
                  href="/notifications" 
                  icon={<BellIcon className="w-5 h-5" />} 
                  isActive={location === "/notifications"}
                  onClick={onClose}
                >
                  Notifikasi
                </NavItem>
                
                <NavItem 
                  href="/finance" 
                  icon={<BanknoteIcon className="w-5 h-5" />} 
                  isActive={location === "/finance"}
                  onClick={onClose}
                >
                  Keuangan
                </NavItem>
                
                <NavItem 
                  href="/calendar" 
                  icon={<CalendarIcon className="w-5 h-5" />} 
                  isActive={location === "/calendar"}
                  onClick={onClose}
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
              <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Logout
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 lg:hidden z-10">
        <Link href="/">
          <a className={cn(
            "flex flex-col items-center justify-center w-20 h-16",
            location === "/" ? "text-primary" : "text-neutral-dark hover:text-primary"
          )}>
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </a>
        </Link>
        
        <Link href="/devotional">
          <a className={cn(
            "flex flex-col items-center justify-center w-20 h-16",
            location === "/devotional" ? "text-primary" : "text-neutral-dark hover:text-primary"
          )}>
            <BookOpenIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Renungan</span>
          </a>
        </Link>
        
        <Link href="/members">
          <a className={cn(
            "flex flex-col items-center justify-center w-20 h-16",
            location === "/members" ? "text-primary" : "text-neutral-dark hover:text-primary"
          )}>
            <UsersIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Jemaat</span>
          </a>
        </Link>
        
        <Link href="/calendar">
          <a className={cn(
            "flex flex-col items-center justify-center w-20 h-16",
            location === "/calendar" ? "text-primary" : "text-neutral-dark hover:text-primary"
          )}>
            <CalendarIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Agenda</span>
          </a>
        </Link>
      </div>
    </>
  );
};

export default MobileNav;
