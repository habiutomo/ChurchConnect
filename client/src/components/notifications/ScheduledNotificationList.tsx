import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Send, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { SentNotification } from "@shared/schema";

interface ScheduledNotificationListProps {
  onSendNow?: (notification: SentNotification) => void;
  onDelete?: (notification: SentNotification) => void;
}

export function ScheduledNotificationList({
  onSendNow,
  onDelete,
}: ScheduledNotificationListProps) {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/notifications/scheduled"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>Tidak ada notifikasi terjadwal</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Template</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Penerima</TableHead>
            <TableHead>Waktu Jadwal</TableHead>
            <TableHead className="text-right">Tindakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => {
            const scheduledDate = notification.scheduledFor
              ? new Date(notification.scheduledFor)
              : null;

            return (
              <TableRow key={notification.id}>
                <TableCell className="font-medium">
                  {notification.templateId}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      notification.status === "scheduled"
                        ? "outline"
                        : notification.status === "sent"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {notification.status === "scheduled"
                      ? "Terjadwal"
                      : notification.status === "sent"
                      ? "Terkirim"
                      : "Gagal"}
                  </Badge>
                </TableCell>
                <TableCell>{notification.sentTo}</TableCell>
                <TableCell>
                  {scheduledDate ? (
                    <div className="flex flex-col space-y-1">
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(scheduledDate, "d MMMM yyyy")}
                      </span>
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {format(scheduledDate, "HH:mm")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(scheduledDate, { addSuffix: true })}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {notification.status === "scheduled" && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSendNow?.(notification)}
                      >
                        <Send className="h-4 w-4 mr-1" /> Kirim Sekarang
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete?.(notification)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
