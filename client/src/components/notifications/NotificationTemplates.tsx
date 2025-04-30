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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationTemplate } from "@/lib/types";
import { AlertCircleIcon, TrashIcon } from "lucide-react";

const templateSchema = z.object({
  name: z.string().min(3, { message: "Nama template minimal 3 karakter" }),
  type: z.string(),
  content: z.string().min(10, { message: "Konten template minimal 10 karakter" }),
  createdBy: z.number().default(1),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

const NotificationTemplates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: templates, isLoading } = useQuery({
    queryKey: ['/api/notification-templates'],
  });
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      type: "event",
      content: "",
      createdBy: 1,
    },
  });
  
  const createTemplateMutation = useMutation({
    mutationFn: (data: TemplateFormValues) => {
      return apiRequest("POST", "/api/notification-templates", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notification-templates'] });
      toast({
        title: "Berhasil!",
        description: "Template notifikasi baru telah ditambahkan",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Gagal menambahkan template",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: TemplateFormValues) => {
    createTemplateMutation.mutate(data);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-1">Template Notifikasi</h3>
        <p className="text-sm text-gray-500 mb-6">
          Buat template untuk notifikasi WhatsApp yang akan dikirim ke jemaat
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Template</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Pengingat Ibadah Mingguan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Notifikasi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe notifikasi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="event">Jadwal Kegiatan</SelectItem>
                      <SelectItem value="birthday">Ulang Tahun</SelectItem>
                      <SelectItem value="devotional">Renungan Harian</SelectItem>
                      <SelectItem value="attendance">Kehadiran</SelectItem>
                      <SelectItem value="general">Umum</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten Template</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tulis template pesan disini"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Gunakan variabel seperti {"{name}"}, {"{event}"}, {"{time}"}, {"{location}"} untuk template jadwal acara.<br />
                    {"{name}"}, {"{age}"} untuk template ulang tahun.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button
                type="submit"
                disabled={createTemplateMutation.isPending}
              >
                {createTemplateMutation.isPending ? "Menyimpan..." : "Tambah Template"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Template Tersedia</h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : templates && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template: NotificationTemplate) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md">
            <AlertCircleIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">Tidak ada template</h3>
            <p className="mt-1 text-sm text-gray-500">
              Buat template baru untuk memulai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface TemplateCardProps {
  template: NotificationTemplate;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>Tipe: {template.type}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-destructive">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-line">{template.content}</p>
      </CardContent>
    </Card>
  );
};

export default NotificationTemplates;
