import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CalendarView from "@/components/calendar/CalendarView";
import EventForm from "@/components/calendar/EventForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

const CalendarPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  
  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events'],
  });
  
  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsAddDialogOpen(true);
  };
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };
  
  const handleEditEvent = () => {
    if (selectedEvent) {
      setIsEventDetailsOpen(false);
      setIsAddDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Agenda & Jadwal</h1>
        <div className="flex gap-2">
          <Select
            value={viewMode}
            onValueChange={(value: 'month' | 'list') => setViewMode(value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Tampilan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Kalender</SelectItem>
              <SelectItem value="list">Daftar</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Acara
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Kalender Kegiatan</TabsTrigger>
          <TabsTrigger value="booking">Pemesanan Ruangan</TabsTrigger>
          <TabsTrigger value="add">Tambah Kegiatan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          {isLoading ? (
            <Skeleton className="h-[600px] w-full" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Kegiatan</CardTitle>
                <CardDescription>
                  Lihat jadwal kegiatan gereja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarView 
                  events={events || []} 
                  viewMode={viewMode}
                  onEventClick={handleEventClick}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Pemesanan Ruangan & Perlengkapan</CardTitle>
              <CardDescription>
                Kelola pemesanan ruangan dan perlengkapan untuk kegiatan
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg">
                <CalendarIcon className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">Booking Ruangan</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-sm">
                  Fitur pemesanan ruangan akan segera tersedia. Sementara ini, silakan 
                  menambahkan kegiatan melalui menu "Tambah Kegiatan".
                </p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={handleAddEvent}
                >
                  Tambah Kegiatan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Kegiatan Baru</CardTitle>
              <CardDescription>
                Tambahkan jadwal kegiatan baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventForm onSuccess={() => {}} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add/Edit Event Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
            </DialogTitle>
          </DialogHeader>
          
          <EventForm 
            onSuccess={() => setIsAddDialogOpen(false)}
            defaultValues={selectedEvent ? {
              title: selectedEvent.title,
              description: selectedEvent.description || '',
              startDate: formatDate(selectedEvent.startDate, 'yyyy-MM-dd'),
              endDate: formatDate(selectedEvent.endDate, 'yyyy-MM-dd'),
              startTime: selectedEvent.startTime,
              endTime: selectedEvent.endTime,
              location: selectedEvent.location || '',
              category: selectedEvent.category || 'Ibadah',
              status: selectedEvent.status,
            } : undefined}
            isEdit={!!selectedEvent}
            eventId={selectedEvent?.id}
          />
        </DialogContent>
      </Dialog>
      
      {/* Event Details Dialog */}
      <Dialog 
        open={isEventDetailsOpen} 
        onOpenChange={setIsEventDetailsOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Kegiatan</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-500">{selectedEvent.category}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-t border-b py-4">
                <div className="col-span-1 font-medium text-sm">Tanggal:</div>
                <div className="col-span-2 text-sm">
                  {formatDate(selectedEvent.startDate, 'd MMMM yyyy')}
                  {selectedEvent.startDate !== selectedEvent.endDate && 
                    ` - ${formatDate(selectedEvent.endDate, 'd MMMM yyyy')}`}
                </div>
                
                <div className="col-span-1 font-medium text-sm">Waktu:</div>
                <div className="col-span-2 text-sm">
                  {selectedEvent.startTime} - {selectedEvent.endTime} WIB
                </div>
                
                <div className="col-span-1 font-medium text-sm">Lokasi:</div>
                <div className="col-span-2 text-sm">
                  {selectedEvent.location || '-'}
                </div>
                
                <div className="col-span-1 font-medium text-sm">Status:</div>
                <div className="col-span-2 text-sm">
                  {(() => {
                    switch (selectedEvent.status) {
                      case 'scheduled': return 'Terjadwal';
                      case 'preparation': return 'Persiapan';
                      case 'registration': return 'Pendaftaran';
                      case 'ongoing': return 'Sedang Berlangsung';
                      case 'completed': return 'Selesai';
                      case 'cancelled': return 'Dibatalkan';
                      default: return selectedEvent.status;
                    }
                  })()}
                </div>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Deskripsi:</h4>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEventDetailsOpen(false)}>
                  Tutup
                </Button>
                <Button onClick={handleEditEvent}>
                  Edit Kegiatan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
