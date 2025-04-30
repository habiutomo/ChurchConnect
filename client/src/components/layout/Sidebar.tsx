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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

interface IntroductionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IntroductionDialog = ({ open, onOpenChange }: IntroductionDialogProps) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onOpenChange(false);
      setStep(1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Selamat Datang di Aplikasi Manajemen Gereja Immanuel</DialogTitle>
              <DialogDescription>
                Aplikasi ini dibuat untuk memudahkan pengelolaan kegiatan gereja. Mari kita lihat apa saja fitur-fitur yang tersedia.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-20 h-20 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
              </div>
              <p className="text-center text-muted-foreground">
                Aplikasi Manajemen Gereja Immanuel dilengkapi dengan 6 modul utama untuk memudahkan pengelolaan kegiatan gereja.
              </p>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Dashboard</DialogTitle>
              <DialogDescription>
                Halaman dashboard menyediakan ringkasan informasi penting gereja.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-4">
                <HomeIcon className="w-16 h-16 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Di halaman dashboard Anda dapat melihat:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Statistik jumlah jemaat, kehadiran, dan keuangan</li>
                  <li>Renungan harian terbaru</li>
                  <li>Jadwal acara mendatang</li>
                  <li>Pengingat ulang tahun jemaat</li>
                </ul>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Renungan Harian</DialogTitle>
              <DialogDescription>
                Renungan harian untuk jemaat dengan konten yang bisa disimpan.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-4">
                <BookOpenIcon className="w-16 h-16 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Fitur-fitur pada modul Renungan Harian:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Tambah dan kelola renungan harian</li>
                  <li>Sertakan ayat Alkitab dan penjelasan</li>
                  <li>Dukung format media audio dan video</li>
                  <li>Notifikasi WhatsApp untuk konten baru</li>
                  <li>Bookmark renungan favorit</li>
                </ul>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Data Jemaat</DialogTitle>
              <DialogDescription>
                Manajemen data jemaat dan kehadiran ibadah.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-4">
                <UsersIcon className="w-16 h-16 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Fitur-fitur pada modul Data Jemaat:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Pendaftaran dan manajemen data jemaat</li>
                  <li>Pencatatan status baptis dan informasi kontak</li>
                  <li>Sistem presensi kehadiran pada kegiatan</li>
                  <li>Filter jemaat berdasarkan kategori (anak, remaja, dewasa, lansia)</li>
                  <li>Laporan keaktifan dan statistik kehadiran</li>
                </ul>
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Keuangan</DialogTitle>
              <DialogDescription>
                Pencatatan dan laporan keuangan gereja.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-4">
                <BanknoteIcon className="w-16 h-16 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Fitur-fitur pada modul Keuangan:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Pencatatan pemasukan (persembahan, perpuluhan, donasi)</li>
                  <li>Pencatatan pengeluaran dengan kategori</li>
                  <li>Laporan keuangan dengan grafik dan tampilan visual</li>
                  <li>Filter laporan berdasarkan periode waktu</li>
                  <li>Export laporan ke format PDF</li>
                </ul>
              </div>
            </div>
          </>
        );
      case 6:
        return (
          <>
            <DialogHeader>
              <DialogTitle>Agenda & Jadwal dan Notifikasi</DialogTitle>
              <DialogDescription>
                Manajemen kegiatan gereja dan sistem notifikasi WhatsApp.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-8 h-8 text-primary" />
                  <h3 className="font-semibold">Agenda & Jadwal</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-10">
                  <li>Penjadwalan kegiatan gereja</li>
                  <li>Booking ruangan dan perlengkapan</li>
                  <li>Kalender dengan tampilan bulanan dan daftar</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BellIcon className="w-8 h-8 text-primary" />
                  <h3 className="font-semibold">Notifikasi WhatsApp</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-10">
                  <li>Kirim notifikasi WhatsApp ke jemaat</li>
                  <li>Template pesan untuk berbagai kegiatan</li>
                  <li>Notifikasi otomatis untuk kegiatan, renungan, dan pengingat</li>
                </ul>
              </div>
              
              <p className="text-center text-muted-foreground mt-4">
                Anda sekarang siap menggunakan aplikasi Manajemen Gereja Immanuel!
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {getStepContent()}
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            Sebelumnya
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <span
                key={index}
                className={`block h-2 w-2 rounded-full ${
                  index + 1 === step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          
          <Button onClick={handleNext}>
            {step === totalSteps ? "Selesai" : "Lanjut"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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