import { useState } from "react";
import MemberTable from "@/components/members/MemberTable";
import MemberForm from "@/components/members/MemberForm";
import AttendanceForm from "@/components/members/AttendanceForm";
import { Member } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const MembersPage = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  
  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsEditDialogOpen(true);
  };
  
  const handleViewAttendance = (member: Member) => {
    setSelectedMember(member);
    setIsAttendanceDialogOpen(true);
  };
  
  const handleFormSuccess = () => {
    setIsEditDialogOpen(false);
    setIsAddDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Data Jemaat</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Jemaat
        </Button>
      </div>
      
      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">Daftar Jemaat</TabsTrigger>
          <TabsTrigger value="add">Tambah Jemaat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="space-y-6">
          <MemberTable 
            onEdit={handleEdit}
            onViewAttendance={handleViewAttendance}
          />
        </TabsContent>
        
        <TabsContent value="add">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Tambah Jemaat Baru</h2>
            <MemberForm onSuccess={handleFormSuccess} />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Member Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Jemaat</DialogTitle>
            <DialogDescription>
              Perbarui informasi jemaat
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <MemberForm 
              onSuccess={handleFormSuccess}
              defaultValues={{
                name: selectedMember.name,
                gender: selectedMember.gender,
                dateOfBirth: format(new Date(selectedMember.dateOfBirth), "yyyy-MM-dd"),
                address: selectedMember.address,
                phone: selectedMember.phone,
                email: selectedMember.email,
                whatsapp: selectedMember.whatsapp,
                category: selectedMember.category,
                baptismStatus: selectedMember.baptismStatus,
                baptismDate: selectedMember.baptismDate ? format(new Date(selectedMember.baptismDate), "yyyy-MM-dd") : "",
                photo: selectedMember.photo,
              }}
              isEdit={true}
              memberId={selectedMember.id}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Member Dialog */}
      <Dialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Jemaat Baru</DialogTitle>
            <DialogDescription>
              Isi formulir berikut untuk mendaftarkan jemaat baru
            </DialogDescription>
          </DialogHeader>
          
          <MemberForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
      
      {/* Attendance Dialog */}
      <Dialog 
        open={isAttendanceDialogOpen} 
        onOpenChange={setIsAttendanceDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kehadiran Jemaat</DialogTitle>
            <DialogDescription>
              Kelola kehadiran untuk jemaat terpilih
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <AttendanceForm 
              member={selectedMember}
              onSuccess={() => setIsAttendanceDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to format dates
const format = (date: Date, formatStr: string): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  
  if (formatStr === "yyyy-MM-dd") {
    return `${year}-${month}-${day}`;
  }
  
  return '';
};

export default MembersPage;
