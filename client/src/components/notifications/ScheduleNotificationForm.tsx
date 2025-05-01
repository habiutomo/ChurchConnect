import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  templateId: z.number({
    required_error: "Template diperlukan",
    invalid_type_error: "Template diperlukan",
  }),
  sentTo: z.string().min(1, "Nomor WhatsApp diperlukan"),
  scheduledFor: z.date({
    required_error: "Tanggal jadwal diperlukan",
    invalid_type_error: "Tanggal jadwal diperlukan",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function ScheduleNotificationForm() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["/api/notification-templates"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sentTo: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return apiRequest("/api/notifications/schedule", {
        method: "POST",
        body: JSON.stringify(values),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/scheduled"] });
      toast({
        title: "Jadwal notifikasi berhasil dibuat",
        description: "Notifikasi akan dikirim pada jadwal yang ditentukan",
      });
      form.reset();
      setDate(undefined);
    },
    onError: (error) => {
      toast({
        title: "Gagal membuat jadwal notifikasi",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Notifikasi</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih template notifikasi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingTemplates ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
                    </div>
                  ) : templates && templates.length > 0 ? (
                    templates.map((template: any) => (
                      <SelectItem
                        key={template.id}
                        value={template.id.toString()}
                      >
                        {template.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="text-center p-4 text-muted-foreground">
                      <p>Tidak ada template yang tersedia</p>
                    </div>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>
                Pilih template notifikasi yang akan dikirim
              </FormDescription>
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
                  placeholder="Contoh: 628123456789"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Masukkan nomor WhatsApp penerima tanpa karakter khusus
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledFor"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal & Waktu Pengiriman</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP HH:mm", { locale: require('date-fns/locale/id') })
                      ) : (
                        <span>Pilih tanggal dan waktu</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (newDate) {
                        // Set time to current time
                        const now = new Date();
                        newDate.setHours(now.getHours());
                        newDate.setMinutes(now.getMinutes());
                        field.onChange(newDate);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-sm">Waktu</FormLabel>
                      <Input
                        type="time"
                        className="w-24"
                        onChange={(e) => {
                          if (field.value) {
                            const [hours, minutes] = e.target.value.split(':');
                            const newDate = new Date(field.value);
                            newDate.setHours(parseInt(hours));
                            newDate.setMinutes(parseInt(minutes));
                            field.onChange(newDate);
                          } else if (date) {
                            const [hours, minutes] = e.target.value.split(':');
                            const newDate = new Date(date);
                            newDate.setHours(parseInt(hours));
                            newDate.setMinutes(parseInt(minutes));
                            field.onChange(newDate);
                          }
                        }}
                        value={
                          field.value
                            ? `${field.value.getHours().toString().padStart(2, '0')}:${field.value.getMinutes().toString().padStart(2, '0')}`
                            : ""
                        }
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Pilih tanggal dan waktu pengiriman notifikasi
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Jadwalkan Notifikasi
        </Button>
      </form>
    </Form>
  );
}
