import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Member, Event, Attendance } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2Icon, CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const attendanceSchema = z.object({
  memberId: z.number(),
  eventId: z.number(),
  date: z.date(),
  status: z.boolean().default(true),
  notes: z.string().optional(),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

interface AttendanceFormProps {
  member: Member;
  onSuccess?: () => void;
}

const AttendanceForm = ({ member, onSuccess }: AttendanceFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events } = useQuery({
    queryKey: ['/api/events'],
  });

  const { data: attendanceRecords } = useQuery({
    queryKey: [`/api/attendance/member/${member.id}`],
  });

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      memberId: member.id,
      eventId: 0,
      date: new Date(),
      status: true,
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: AttendanceFormValues) => {
      return apiRequest("POST", "/api/attendance", data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [`/api/attendance/member/${member.id}`] });
      toast({
        title: "Berhasil!",
        description: "Kehadiran berhasil dicatat",
      });
      form.reset({
        memberId: member.id,
        eventId: 0,
        date: new Date(),
        status: true,
        notes: "",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Gagal mencatat kehadiran",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AttendanceFormValues) => {
    createMutation.mutate(data);
  };

  // Function to check if a date already has an attendance record
  const hasAttendanceOnDate = (date: Date, eventId: number): Attendance | undefined => {
    if (!attendanceRecords) return undefined;
    
    return attendanceRecords.find((record: any) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === date.getFullYear() &&
        recordDate.getMonth() === date.getMonth() &&
        recordDate.getDate() === date.getDate() &&
        record.eventId === eventId
      );
    });
  };

  // Function to render day cell with attendance indicator
  const renderDayWithAttendance = (day: Date, eventId: number) => {
    const hasAttendance = hasAttendanceOnDate(day, eventId);
    return (
      <div className="relative h-full w-full p-2 flex items-center justify-center">
        {day.getDate()}
        {hasAttendance && (
          <div className={`absolute bottom-1 right-1 rounded-full ${hasAttendance.status ? 'text-green-500' : 'text-amber-500'}`}>
            {hasAttendance.status ? (
              <CheckCircle2Icon className="h-3 w-3" />
            ) : (
              <CircleIcon className="h-3 w-3" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Kehadiran Jemaat</h3>
        <p className="text-sm text-gray-500">
          Catat kehadiran untuk <span className="font-medium">{member.name}</span>
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="eventId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Kegiatan</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kegiatan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {events?.map((event: Event) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title} ({format(new Date(event.startDate), "dd MMM yyyy", { locale: id })})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Kehadiran</FormLabel>
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
                          format(field.value, "PPP", { locale: id })
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
                      disabled={(date) => {
                        return date > new Date();
                      }}
                      locale={id}
                      components={{
                        Day: ({ date }) => renderDayWithAttendance(date, form.getValues().eventId),
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Status Kehadiran</FormLabel>
                  <div className="text-sm text-gray-500">
                    Hadir atau tidak hadir
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catatan (Opsional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tambahkan catatan jika diperlukan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || form.getValues().eventId === 0}
            >
              {createMutation.isPending ? "Menyimpan..." : "Catat Kehadiran"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Riwayat Kehadiran</h3>
        
        {!attendanceRecords || attendanceRecords.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">Belum ada data kehadiran</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendanceRecords.map((record: any) => (
              <div 
                key={record.id} 
                className={`p-4 border rounded-md ${record.status ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-amber-500'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{record.event?.title}</h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(record.date), "EEEE, dd MMMM yyyy", { locale: id })}
                    </p>
                  </div>
                  <Badge 
                    variant={record.status ? "default" : "outline"}
                    className={record.status ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}
                  >
                    {record.status ? "Hadir" : "Tidak Hadir"}
                  </Badge>
                </div>
                {record.notes && (
                  <div className="mt-2 text-sm text-gray-600 border-t pt-2">
                    <p>Catatan: {record.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Missing Badge component
const Badge = ({ variant = "default", className, children, ...props }: any) => {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AttendanceForm;
