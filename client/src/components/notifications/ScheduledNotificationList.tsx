import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Send, Bell } from "lucide-react";
import { SentNotification } from "@shared/schema";

export function ScheduledNotificationList() {
  const { data: notifications, isLoading, error } = useQuery({ 
    queryKey: ["/api/notifications/scheduled"],
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Terjadi Kesalahan</CardTitle>
          <CardDescription>
            Tidak dapat memuat data notifikasi terjadwal.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!notifications || !Array.isArray(notifications) || notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tidak Ada Notifikasi Terjadwal</CardTitle>
          <CardDescription>
            Belum ada notifikasi yang dijadwalkan untuk dikirim.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification: SentNotification) => (
        <ScheduledNotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
}

interface ScheduledNotificationCardProps {
  notification: SentNotification;
}

function ScheduledNotificationCard({ notification }: ScheduledNotificationCardProps) {
  const [isSending, setIsSending] = useState(false);
  
  const scheduledDate = notification.scheduledFor ? new Date(notification.scheduledFor) : null;
  const formattedDate = scheduledDate ? format(scheduledDate, 'dd MMMM yyyy') : '-';
  const formattedTime = scheduledDate ? format(scheduledDate, 'HH:mm') : '-';
  
  // Fungsi untuk mengirim notifikasi sekarang (tanpa menunggu jadwal)
  const handleSendNow = async () => {
    setIsSending(true);
    
    try {
      // Logika untuk mengirim notifikasi sekarang akan diimplementasikan di masa mendatang
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi pengiriman
      
      // Handle hasil
      setIsSending(false);
      
    } catch (error) {
      console.error("Error sending notification:", error);
      setIsSending(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-lg">
          <span className="flex items-center gap-2">
            <Bell className="text-primary" size={18} />
            Notifikasi Terjadwal
          </span>
          <Badge variant={notification.status === "scheduled" ? "outline" : "secondary"}>
            {notification.status === "scheduled" ? "Terjadwal" : notification.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2" size={16} />
            <span>{formattedDate}</span>
            <Clock className="ml-4 mr-2" size={16} />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <User className="mr-2" size={16} />
            <span>Tujuan: {notification.sentTo}</span>
          </div>
          <div className="flex justify-end mt-2 gap-2">
            <Button 
              onClick={handleSendNow} 
              disabled={isSending || notification.status !== "scheduled"}
              size="sm"
              variant="outline"
            >
              <Send className="mr-2" size={14} />
              {isSending ? "Mengirim..." : "Kirim Sekarang"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
