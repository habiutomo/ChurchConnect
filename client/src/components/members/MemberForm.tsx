import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";

const memberSchema = z.object({
  name: z.string().min(3, { message: "Nama harus minimal 3 karakter" }),
  gender: z.enum(["male", "female"], { 
    required_error: "Jenis kelamin harus dipilih" 
  }),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Tanggal lahir tidak valid",
  }),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Email tidak valid" }).optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  category: z.enum(["anak", "remaja", "dewasa", "lansia"], { 
    required_error: "Kategori harus dipilih" 
  }),
  baptismStatus: z.boolean().default(false),
  baptismDate: z.string().optional().or(z.literal('')),
  photo: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

interface MemberFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<MemberFormValues>;
  isEdit?: boolean;
  memberId?: number;
}

const MemberForm = ({
  onSuccess,
  defaultValues,
  isEdit = false,
  memberId,
}: MemberFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hasBaptism, setHasBaptism] = useState(defaultValues?.baptismStatus || false);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      gender: "male",
      dateOfBirth: format(new Date(), "yyyy-MM-dd"),
      address: "",
      phone: "",
      email: "",
      whatsapp: "",
      category: "dewasa",
      baptismStatus: false,
      baptismDate: "",
      photo: "",
      ...defaultValues,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: MemberFormValues) => {
      return apiRequest("POST", "/api/members", data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Berhasil!",
        description: "Data jemaat berhasil ditambahkan",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Gagal menambahkan data jemaat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: MemberFormValues) => {
      return apiRequest("PUT", `/api/members/${memberId}`, data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: [`/api/members/${memberId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Berhasil!",
        description: "Data jemaat berhasil diperbarui",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Gagal memperbarui data jemaat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MemberFormValues) => {
    // If baptism status is false, clear baptism date
    if (!data.baptismStatus) {
      data.baptismDate = "";
    }
    
    if (isEdit && memberId) {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Lahir</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea placeholder="Masukkan alamat lengkap" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: 081234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contoh@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nomor untuk notifikasi" 
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Nomor ini akan digunakan untuk pengiriman notifikasi
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori Usia</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="anak">Anak (0-12 tahun)</SelectItem>
                    <SelectItem value="remaja">Remaja (13-17 tahun)</SelectItem>
                    <SelectItem value="dewasa">Dewasa (18-59 tahun)</SelectItem>
                    <SelectItem value="lansia">Lansia (60+ tahun)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="baptismStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Status Baptis</FormLabel>
                  <FormDescription>
                    Apakah sudah dibaptis?
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      setHasBaptism(checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {hasBaptism && (
            <FormField
              control={form.control}
              name="baptismDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Baptis</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Foto</FormLabel>
              <FormControl>
                <Input
                  placeholder="URL foto jemaat (opsional)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Masukkan URL foto (jika ada)
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
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Menyimpan..."
              : isEdit
              ? "Perbarui Data"
              : "Tambah Jemaat"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MemberForm;
