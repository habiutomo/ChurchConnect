import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const devotionalSchema = z.object({
  title: z.string().min(3, { message: "Judul harus minimal 3 karakter" }),
  content: z.string().min(10, { message: "Konten harus minimal 10 karakter" }),
  scripture: z.string().min(1, { message: "Ayat Alkitab tidak boleh kosong" }),
  scriptureCitation: z.string().min(1, { message: "Rujukan ayat tidak boleh kosong" }),
  category: z.string().optional(),
  mediaType: z.enum(["text", "audio", "video"]),
  mediaUrl: z.string().optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Tanggal tidak valid",
  }),
  authorId: z.number(),
});

type DevotionalFormValues = z.infer<typeof devotionalSchema>;

interface DevotionalFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<DevotionalFormValues>;
  isEdit?: boolean;
  devotionalId?: number;
}

const DevotionalForm = ({ 
  onSuccess, 
  defaultValues, 
  isEdit = false,
  devotionalId 
}: DevotionalFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<DevotionalFormValues>({
    resolver: zodResolver(devotionalSchema),
    defaultValues: {
      title: "",
      content: "",
      scripture: "",
      scriptureCitation: "",
      category: "Iman",
      mediaType: "text",
      mediaUrl: "",
      date: format(new Date(), "yyyy-MM-dd"),
      authorId: 1, // Default to admin user
      ...defaultValues
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: DevotionalFormValues) => {
      return apiRequest("POST", "/api/devotionals", data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devotionals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Berhasil!",
        description: "Renungan berhasil ditambahkan",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Gagal menambahkan renungan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: DevotionalFormValues) => {
      return apiRequest("PUT", `/api/devotionals/${devotionalId}`, data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devotionals'] });
      queryClient.invalidateQueries({ queryKey: [`/api/devotionals/${devotionalId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Berhasil!",
        description: "Renungan berhasil diperbarui",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Gagal memperbarui renungan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DevotionalFormValues) => {
    if (isEdit && devotionalId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan judul renungan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Iman">Iman</SelectItem>
                    <SelectItem value="Pengharapan">Pengharapan</SelectItem>
                    <SelectItem value="Kasih">Kasih</SelectItem>
                    <SelectItem value="Ketekunan">Ketekunan</SelectItem>
                    <SelectItem value="Pertumbuhan">Pertumbuhan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isi Renungan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tulis isi renungan di sini" 
                  className="min-h-[150px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="scripture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ayat Alkitab</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Masukkan ayat Alkitab"
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="scriptureCitation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rujukan Ayat</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Yohanes 3:16" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="mediaType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Media</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis media" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Teks</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {form.watch("mediaType") !== "text" && (
          <FormField
            control={form.control}
            name="mediaUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Media</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={`Masukkan URL ${form.watch("mediaType") === "audio" ? "audio" : "video"}`} 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  {form.watch("mediaType") === "audio" 
                    ? "Format yang didukung: MP3, WAV, OGG" 
                    : "URL video YouTube atau platform serupa"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Menyimpan..."
              : isEdit ? "Perbarui Renungan" : "Tambah Renungan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DevotionalForm;
