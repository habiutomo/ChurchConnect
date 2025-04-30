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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const financeSchema = z.object({
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Tanggal tidak valid",
  }),
  type: z.enum(["income", "expense"]),
  category: z.string(),
  amount: z.string().transform((val) => parseInt(val.replace(/\D/g, ""))),
  description: z.string().optional(),
  recordedBy: z.number().default(1),
});

type FinanceFormValues = z.infer<typeof financeSchema>;

interface FinanceFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<FinanceFormValues>;
}

const FinanceForm = ({ onSuccess, defaultValues }: FinanceFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FinanceFormValues>({
    resolver: zodResolver(financeSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      type: "income",
      category: "persembahan",
      amount: "",
      description: "",
      recordedBy: 1,
      ...defaultValues,
    },
  });
  
  const createMutation = useMutation({
    mutationFn: (data: FinanceFormValues) => {
      return apiRequest("POST", "/api/finance", data);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['/api/finance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Berhasil!",
        description: "Transaksi keuangan berhasil dicatat",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Gagal mencatat transaksi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FinanceFormValues) => {
    createMutation.mutate(data);
  };
  
  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(Number(number))
      .replace("Rp", "Rp ");
  };
  
  // Income and expense categories
  const incomeCategories = [
    { value: "persembahan", label: "Persembahan" },
    { value: "perpuluhan", label: "Perpuluhan" },
    { value: "donasi", label: "Donasi" },
    { value: "iuran", label: "Iuran" },
    { value: "lainnya", label: "Lainnya" },
  ];
  
  const expenseCategories = [
    { value: "operasional", label: "Operasional Gereja" },
    { value: "bantuan_sosial", label: "Bantuan Sosial" },
    { value: "pembangunan", label: "Proyek Pembangunan" },
    { value: "administrasi", label: "Administrasi" },
    { value: "lainnya", label: "Lainnya" },
  ];
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Transaksi</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Jenis Transaksi</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">Pemasukan</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal">Pengeluaran</FormLabel>
                  </FormItem>
                </RadioGroup>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {form.watch("type") === "income"
                    ? incomeCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))
                    : expenseCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
          name="amount"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Jumlah</FormLabel>
              <FormControl>
                <Input
                  {...rest}
                  value={value === "" ? "" : formatCurrency(value.toString())}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    onChange(rawValue);
                    e.target.value = formatCurrency(rawValue);
                  }}
                  placeholder="Contoh: Rp 1.000.000"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi transaksi (opsional)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detail tambahan mengenai transaksi
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
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Menyimpan..." : "Catat Transaksi"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FinanceForm;
