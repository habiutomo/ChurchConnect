import { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight, ListIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarViewProps {
  events: Event[];
  viewMode: 'month' | 'list';
  onEventClick: (event: Event) => void;
}

const CalendarView = ({ events, viewMode, onEventClick }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [displayMode, setDisplayMode] = useState<'month' | 'list'>(viewMode);
  
  useEffect(() => {
    setDisplayMode(viewMode);
  }, [viewMode]);
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  // Adjust for Sunday as first day of week
  const startDay = firstDayOfMonth.getDay();
  
  // Get events for the current month
  const eventsInMonth = events.filter(event => {
    const eventStartDate = parseISO(event.startDate.toString());
    const eventEndDate = parseISO(event.endDate.toString());
    return (
      (eventStartDate >= firstDayOfMonth && eventStartDate <= lastDayOfMonth) ||
      (eventEndDate >= firstDayOfMonth && eventEndDate <= lastDayOfMonth) ||
      (eventStartDate <= firstDayOfMonth && eventEndDate >= lastDayOfMonth)
    );
  });
  
  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return eventsInMonth.filter(event => {
      const eventStartDate = parseISO(event.startDate.toString());
      const eventEndDate = parseISO(event.endDate.toString());
      return day >= eventStartDate && day <= eventEndDate;
    });
  };
  
  // Function to sort events by start date then time
  const sortEvents = (events: Event[]) => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.startTime.localeCompare(b.startTime);
    });
  };
  
  // All events sorted chronologically for list view
  const allEventsSorted = sortEvents(events);
  
  // Filter upcoming events for list view
  const today = new Date();
  const upcomingEvents = allEventsSorted.filter(event => {
    const eventDate = new Date(event.startDate);
    return eventDate >= today;
  });
  
  // Helper function to get badge color based on event category
  const getCategoryColor = (category: string = 'default') => {
    const categories: Record<string, string> = {
      'Ibadah': 'bg-primary/10 text-primary hover:bg-primary/20',
      'Doa': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'Belajar Alkitab': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Pelayanan': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Rapat': 'bg-amber-100 text-amber-800 hover:bg-amber-200',
      'default': 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    };
    
    return categories[category] || categories.default;
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'preparation': return 'bg-yellow-100 text-yellow-800';
      case 'registration': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'scheduled': return 'Terjadwal';
      case 'preparation': return 'Persiapan';
      case 'registration': return 'Pendaftaran';
      case 'ongoing': return 'Berlangsung';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Bulan sebelumnya</span>
          </Button>
          
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: id })}
          </h2>
          
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Bulan berikutnya</span>
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={displayMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDisplayMode('month')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Kalender
          </Button>
          <Button
            variant={displayMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDisplayMode('list')}
          >
            <ListIcon className="mr-2 h-4 w-4" />
            Daftar
          </Button>
        </div>
      </div>
      
      {displayMode === 'month' ? (
        <div className="bg-white rounded-lg border shadow-sm">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 border-b">
            {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
              <div key={day} className="py-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-100">
            {/* Blank spaces for days before the first day of month */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-white min-h-[100px] p-2" />
            ))}
            
            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const eventsOnDay = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "bg-white min-h-[100px] p-2",
                    isToday && "bg-blue-50"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={cn(
                        "text-sm font-semibold h-6 w-6 flex items-center justify-center rounded-full",
                        isToday && "bg-primary text-white"
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {eventsOnDay.length > 0 && `${eventsOnDay.length} acara`}
                    </span>
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    {eventsOnDay.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "truncate text-xs p-1 rounded cursor-pointer hover:opacity-80",
                          getCategoryColor(event.category)
                        )}
                        onClick={() => onEventClick(event)}
                      >
                        {event.startTime} {event.title}
                      </div>
                    ))}
                    
                    {eventsOnDay.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        + {eventsOnDay.length - 3} lainnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm divide-y">
          <div className="p-4">
            <h3 className="font-medium">Kegiatan Mendatang</h3>
            <p className="text-sm text-gray-500">Daftar kegiatan yang akan datang</p>
          </div>
          
          <ScrollArea className="h-[500px] w-full p-4">
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Tidak ada kegiatan</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tidak ada kegiatan mendatang yang dijadwalkan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{formatDate(event.startDate, 'd MMM yyyy')}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{event.location || 'Lokasi tidak ditentukan'}</span>
                      </div>
                    </div>
                    
                    {event.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="mt-3">
                      <Badge className={getStatusColor(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
