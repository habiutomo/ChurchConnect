import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { Member } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2Icon, XCircleIcon, Edit2Icon, TrashIcon, FilterIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate, getAgeFromBirthdate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MemberTableProps {
  onEdit: (member: Member) => void;
  onViewAttendance: (member: Member) => void;
}

const MemberTable = ({ onEdit, onViewAttendance }: MemberTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [category, setCategory] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  
  const { data: members, isLoading } = useQuery({
    queryKey: ['/api/members', category],
    queryFn: async () => {
      const url = category ? `/api/members?category=${category}` : '/api/members';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      return response.json();
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/members'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Berhasil!",
        description: "Data jemaat berhasil dihapus",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Gagal menghapus data jemaat",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      deleteMutation.mutate(memberToDelete.id);
    }
  };
  
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'anak': return 'Anak';
      case 'remaja': return 'Remaja';
      case 'dewasa': return 'Dewasa';
      case 'lansia': return 'Lansia';
      default: return category;
    }
  };
  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'anak': return 'bg-blue-100 text-blue-800';
      case 'remaja': return 'bg-purple-100 text-purple-800';
      case 'dewasa': return 'bg-green-100 text-green-800';
      case 'lansia': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "name",
      header: "Nama",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-xs text-gray-500">
            {row.original.gender === 'male' ? 'Laki-laki' : 'Perempuan'}, {getAgeFromBirthdate(row.original.dateOfBirth)} tahun
          </div>
        </div>
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: "Tanggal Lahir",
      cell: ({ row }) => formatDate(row.getValue("dateOfBirth"), "dd MMMM yyyy"),
    },
    {
      accessorKey: "category",
      header: "Kategori",
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        return (
          <Badge className={getCategoryColor(category)}>
            {getCategoryLabel(category)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "contact",
      header: "Kontak",
      cell: ({ row }) => (
        <div>
          {row.original.phone && (
            <div className="text-sm">{row.original.phone}</div>
          )}
          {row.original.whatsapp && (
            <div className="text-xs text-green-600">
              WA: {row.original.whatsapp}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "baptismStatus",
      header: "Status Baptis",
      cell: ({ row }) => {
        const baptismStatus = row.getValue("baptismStatus") as boolean;
        const baptismDate = row.original.baptismDate;
        
        return (
          <div className="flex items-center">
            {baptismStatus ? (
              <div className="flex items-center">
                <CheckCircle2Icon className="w-5 h-5 text-green-500 mr-1" />
                <span className="text-sm">
                  {baptismDate ? formatDate(baptismDate, "dd MMM yyyy") : 'Sudah'}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <XCircleIcon className="w-5 h-5 text-gray-400 mr-1" />
                <span className="text-sm text-gray-500">Belum</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewAttendance(row.original)}
              title="Lihat Kehadiran"
            >
              <FilterIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(row.original)}
              title="Edit Data"
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDeleteClick(row.original)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              title="Hapus Data"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: members || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="border rounded-md">
          <Skeleton className="h-10 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Cari berdasarkan nama..."
            value={(table.getColumn("name")?.getFilterValue() as string) || ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCategory("")}>
                Semua Kategori
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("anak")}>
                Anak
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("remaja")}>
                Remaja
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("dewasa")}>
                Dewasa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("lansia")}>
                Lansia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data jemaat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Berikutnya
        </Button>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Jemaat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data jemaat <strong>{memberToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MemberTable;
