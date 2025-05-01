import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';

const formSchema = z.object({
  templateId: z.string().min(1, { message: "Template harus dipilih" }),
  sentTo: z.string().min(1, { message: "Nomor WhatsApp harus diisi" }),
  scheduledDate: z.date({ required_error: "Tanggal harus dipilih" }),
  scheduledTime: z.string().min(1, { message: "Waktu harus diisi" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ScheduleNotificationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: templates, isLoading: templatesLoading } = useQuery({ 
    queryKey: ["/api/notification-templates"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateId: "",
      sentTo: "",
      scheduledTime: "08:00",
    },
  });

  const scheduleNotification = async (values: FormValues) => {
    const scheduledDateTime = new Date(values.scheduledDate);
    const [hours, minutes] = values.scheduledTime.split(':').map(Number);
    
    scheduledDateTime.setHours(hours, minutes, 0, 0);
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/notifications/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: parseInt(values.templateId),
          sentTo: values.sentTo,
          scheduledFor: scheduledDateTime.toISOString(),
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Gagal menjadwalkan notifikasi");
      }
      
      toast({
        title: "Notifikasi terjadwal",
        description: `Notifikasi telah dijadwalkan untuk dikirim pada ${format(scheduledDateTime, 'dd MMMM yyyy, HH:mm')}.`,
      });
      
      // Reset form
      form.reset();
      
      // Refresh data notifikasi terjadwal
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/scheduled"] });
      
    } catch (error) {
      console.error("Error scheduling notification:", error);
      toast({
        title: "Gagal menjadwalkan notifikasi",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat menjadwalkan notifikasi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jadwalkan Notifikasi</CardTitle>
        <CardDescription>
          Jadwalkan pengiriman notifikasi ke anggota jemaat untuk waktu tertentu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(scheduleNotification)} className="space-y-4">
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Pesan</FormLabel>
                  <Select
                    disabled={templatesLoading || isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih template pesan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates && Array.isArray(templates) ? templates.map((template: any) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      )) : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sentTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="62812345678"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                          >
                            {field.value ? (
                              format(field.value, "dd MMMM yyyy")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waktu</FormLabel>
                    <div className="flex items-center">
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <Clock className="ml-2 h-4 w-4 opacity-50" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menjadwalkan..." : "Jadwalkan Notifikasi"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
