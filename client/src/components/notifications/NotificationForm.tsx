import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Member } from "@/lib/types";

const notificationSchema = z.object({
  templateId: z.number(),
  message: z.string().optional(),
  recipients: z.array(z.number()),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

const NotificationForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: templates } = useQuery({
    queryKey: ['/api/notification-templates'],
  });
  
  const { data: members } = useQuery({
    queryKey: ['/api/members', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory ? `/api/members?category=${selectedCategory}` : '/api/members';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      return response.json();
    }
  });
  
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      templateId: 0,
      message: "",
      recipients: [],
    },
  });
  
  const sendNotificationMutation = useMutation({
    mutationFn: (data: NotificationFormValues) => {
      return apiRequest("POST", "/api/send-batch-notification", {
        templateId: data.templateId,
        members: data.recipients,
        message: data.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Berhasil!",
        description: "Notifikasi WhatsApp berhasil dikirim",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Gagal mengirim notifikasi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: NotificationFormValues) => {
    if (data.recipients.length === 0) {
      toast({
        title: "Peringatan",
        description: "Pilih paling tidak satu penerima",
        variant: "destructive",
      });
      return;
    }
    
    sendNotificationMutation.mutate(data);
  };
  
  const onSelectAll = () => {
    if (!members) return;
    
    const allIds = members.map((member: Member) => member.id);
    form.setValue('recipients', allIds);
  };
  
  const onUnselectAll = () => {
    form.setValue('recipients', []);
  };
  
  const onCategoryChange = (category: string) => {
    setSelectedCategory(category === "all" ? null : category);
    form.setValue('recipients', []);
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
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih template notifikasi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {templates?.map((template: any) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name} ({template.type})
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
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesan Tambahan (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tambahkan pesan khusus (opsional)"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Pesan ini akan ditambahkan ke template yang dipilih
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Pilih Penerima</h3>
            <p className="text-sm text-gray-500">
              Pilih jemaat yang akan menerima notifikasi
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <Select
                onValueChange={onCategoryChange}
                defaultValue="all"
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="anak">Anak</SelectItem>
                  <SelectItem value="remaja">Remaja</SelectItem>
                  <SelectItem value="dewasa">Dewasa</SelectItem>
                  <SelectItem value="lansia">Lansia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onSelectAll}>
                Pilih Semua
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onUnselectAll}>
                Batalkan Semua
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members?.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center py-4">Tidak ada jemaat dalam kategori ini</p>
              ) : (
                members?.map((member: Member) => (
                  <FormField
                    key={member.id}
                    control={form.control}
                    name="recipients"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(member.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked) {
                                field.onChange([...currentValue, member.id]);
                              } else {
                                field.onChange(currentValue.filter((value) => value !== member.id));
                              }
                            }}
                          />
                        </FormControl>
                        <div className="leading-none">
                          <FormLabel className="cursor-pointer">{member.name}</FormLabel>
                          <p className="text-xs text-gray-500">
                            {member.whatsapp || 'Tidak ada WhatsApp'}
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={sendNotificationMutation.isPending || form.getValues().templateId === 0}
          >
            {sendNotificationMutation.isPending ? "Mengirim..." : "Kirim Notifikasi"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NotificationForm;
