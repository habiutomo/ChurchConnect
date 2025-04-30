import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DevotionalList from "@/components/devotional/DevotionalList";
import DevotionalForm from "@/components/devotional/DevotionalForm";
import { Devotional } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DevotionalPage = () => {
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  
  const { data: todayDevotional, isLoading } = useQuery({
    queryKey: ['/api/devotionals/today'],
  });

  const handleSelectDevotional = (devotional: Devotional) => {
    setSelectedDevotional(devotional);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Renungan Harian</h1>
        <Button onClick={() => setAddFormOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah Renungan
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Semua Renungan</TabsTrigger>
          <TabsTrigger value="add">Tambah Renungan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <DevotionalList 
            onSelectDevotional={handleSelectDevotional} 
            userId={1} // Default admin user
          />
        </TabsContent>
        
        <TabsContent value="add">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Buat Renungan Baru</h2>
            <DevotionalForm onSuccess={() => {}} />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Devotional Detail Dialog */}
      <Dialog 
        open={selectedDevotional !== null} 
        onOpenChange={(open) => {
          if (!open) setSelectedDevotional(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          {selectedDevotional && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedDevotional.title}</DialogTitle>
                <DialogDescription className="text-sm">
                  {new Date(selectedDevotional.date).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4">
                {selectedDevotional.mediaType === 'audio' && selectedDevotional.mediaUrl && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-md">
                    <audio controls className="w-full">
                      <source src={selectedDevotional.mediaUrl} />
                      Browser Anda tidak mendukung pemutaran audio.
                    </audio>
                  </div>
                )}
                
                {selectedDevotional.mediaType === 'video' && selectedDevotional.mediaUrl && (
                  <div className="mb-4 aspect-video">
                    <iframe 
                      className="w-full h-full rounded-md"
                      src={selectedDevotional.mediaUrl}
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                
                <div className="bg-primary/5 p-4 rounded-md mb-4">
                  <blockquote className="scripture">
                    "{selectedDevotional.scripture}" - <span className="font-medium">{selectedDevotional.scriptureCitation}</span>
                  </blockquote>
                </div>
                
                <div className="whitespace-pre-line text-gray-700">
                  {selectedDevotional.content}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Form Dialog */}
      <Dialog 
        open={addFormOpen} 
        onOpenChange={setAddFormOpen}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Renungan Baru</DialogTitle>
            <DialogDescription>
              Isi formulir berikut untuk menambahkan renungan harian baru
            </DialogDescription>
          </DialogHeader>
          
          <DevotionalForm 
            onSuccess={() => setAddFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DevotionalPage;
