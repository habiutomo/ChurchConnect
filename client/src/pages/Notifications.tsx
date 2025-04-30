import { useState } from "react";
import NotificationForm from "@/components/notifications/NotificationForm";
import NotificationTemplates from "@/components/notifications/NotificationTemplates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhoneIcon, SendIcon, Settings2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const NotificationsPage = () => {
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-heading font-bold">Notifikasi</h1>
        <Button onClick={() => setIsConfigDialogOpen(true)}>
          <Settings2Icon className="mr-2 h-4 w-4" />
          Konfigurasi WhatsApp
        </Button>
      </div>
      
      <Tabs defaultValue="send" className="w-full">
        <TabsList>
          <TabsTrigger value="send">Kirim Notifikasi</TabsTrigger>
          <TabsTrigger value="templates">Template Notifikasi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Kirim Notifikasi WhatsApp</CardTitle>
              <CardDescription>
                Kirim notifikasi WhatsApp ke jemaat terpilih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Template Notifikasi</CardTitle>
              <CardDescription>
                Kelola template notifikasi untuk dikirim ke jemaat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationTemplates />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* WhatsApp Configuration Dialog */}
      <Dialog 
        open={isConfigDialogOpen} 
        onOpenChange={setIsConfigDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfigurasi WhatsApp</DialogTitle>
            <DialogDescription>
              Atur pengaturan integrasi WhatsApp
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <PhoneIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Status Koneksi</h3>
                <p className="text-sm text-green-600">Terhubung</p>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Provider WhatsApp</h3>
              <p className="text-sm mb-4">Gunakan layanan WhatsApp API seperti Twilio, Wablas, atau sejenisnya.</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 font-medium text-sm">Provider:</div>
                  <div className="col-span-2 text-sm">Wablas</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 font-medium text-sm">No. Admin:</div>
                  <div className="col-span-2 text-sm">+6281234567890</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1 font-medium text-sm">Terakhir Sinkron:</div>
                  <div className="col-span-2 text-sm">Hari ini, 09:45</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Tutup
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <SendIcon className="mr-2 h-4 w-4" />
              Test Koneksi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationsPage;
