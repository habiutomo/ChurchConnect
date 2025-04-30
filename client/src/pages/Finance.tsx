import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FinanceForm from "@/components/finance/FinanceForm";
import FinanceCharts from "@/components/finance/FinanceCharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DownloadIcon, FileTextIcon, UploadIcon, BanknoteIcon, ArrowDownIcon, ArrowUpIcon, FileIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FinanceTransaction } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const FinancePage = () => {
  const [period, setPeriod] = useState("current");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Calculate date range based on selected period
  const getDateRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    if (period === "previous") {
      startDate.setMonth(startDate.getMonth() - 1);
      endDate.setMonth(endDate.getMonth() - 1);
    } else if (period === "year") {
      startDate.setMonth(0);
      startDate.setDate(1);
      endDate.setMonth(11);
      endDate.setDate(31);
    }
    
    return { startDate, endDate };
  };
  
  const { startDate, endDate } = getDateRange();
  
  const { data, isLoading } = useQuery({
    queryKey: ['/api/finance/period', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const res = await fetch(`/api/finance/period?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      if (!res.ok) throw new Error('Failed to fetch finance data');
      return res.json();
    }
  });
  
  const getPeriodLabel = () => {
    if (period === "current") {
      return `${startDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
    } else if (period === "previous") {
      return `${startDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
    } else {
      return `Tahun ${startDate.getFullYear()}`;
    }
  };
  
  const handleExportPDF = () => {
    alert('Fitur export PDF akan segera tersedia');
  };
  
  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Keuangan</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <BanknoteIcon className="mr-2 h-4 w-4" />
            Catat Transaksi
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => window.open('/api/invoice', '_blank')}
            className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
          >
            <FileIcon className="mr-2 h-4 w-4" />
            Lihat Penawaran
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border">
        <div>
          <h2 className="text-lg font-semibold">{getPeriodLabel()}</h2>
          <p className="text-sm text-gray-500">
            {formatDate(startDate, "d MMMM yyyy")} - {formatDate(endDate, "d MMMM yyyy")}
          </p>
        </div>
        
        <Select
          value={period}
          onValueChange={setPeriod}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Bulan Ini</SelectItem>
            <SelectItem value="previous">Bulan Lalu</SelectItem>
            <SelectItem value="year">Tahun Ini</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Pemasukan</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {formatCurrency(data.summary.income)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                <span>8% dari periode sebelumnya</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Pengeluaran</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                {formatCurrency(data.summary.expenses)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-red-600">
                <ArrowDownIcon className="mr-1 h-4 w-4" />
                <span>12% dari periode sebelumnya</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Saldo</CardDescription>
              <CardTitle className={`text-2xl ${data.summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(data.summary.balance)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-600">
                <FileTextIcon className="mr-1 h-4 w-4" />
                <span>Selisih pemasukan dan pengeluaran</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue="charts" className="w-full">
        <TabsList>
          <TabsTrigger value="charts">Diagram & Grafik</TabsTrigger>
          <TabsTrigger value="transactions">Daftar Transaksi</TabsTrigger>
          <TabsTrigger value="add">Tambah Transaksi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <FinanceCharts 
              income={data.summary.income}
              expenses={data.summary.expenses}
              incomeByCategory={data.summary.incomeByCategory}
              expensesByCategory={data.summary.expensesByCategory}
            />
          )}
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Daftar Transaksi</CardTitle>
                <CardDescription>
                  Total {data.transactions.length} transaksi dalam periode ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Jenis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.transactions.map((transaction: FinanceTransaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.date, "d MMM yyyy")}</TableCell>
                          <TableCell>{formatCategoryName(transaction.category)}</TableCell>
                          <TableCell>{transaction.description || '-'}</TableCell>
                          <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                          <TableCell>
                            <Badge 
                              className={transaction.type === 'income' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                : 'bg-red-100 text-red-800 hover:bg-red-100'
                              }
                            >
                              {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {data.transactions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                            Tidak ada transaksi dalam periode ini
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Transaksi Baru</CardTitle>
              <CardDescription>
                Catat transaksi keuangan baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FinanceForm onSuccess={() => {}} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Transaction Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Transaksi Keuangan</DialogTitle>
          </DialogHeader>
          
          <FinanceForm onSuccess={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePage;
