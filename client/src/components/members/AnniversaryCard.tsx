import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, differenceInYears } from 'date-fns';
import { Calendar, Heart, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Member } from "@shared/schema";

interface AnniversaryCardProps {
  member: Member;
}

export function AnniversaryCard({ member }: AnniversaryCardProps) {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  if (!member.anniversaryDate || !member.maritalStatus || member.maritalStatus !== "Married") {
    return null;
  }

  const anniversaryDate = new Date(member.anniversaryDate);
  const formattedDate = format(anniversaryDate, 'dd MMMM yyyy');
  const years = differenceInYears(new Date(), anniversaryDate, { roundingMethod: 'floor' });
  
  const handleSendWishes = async () => {
    try {
      setIsSending(true);
      
      // Mencari template ulang tahun pernikahan
      const templatesResponse = await fetch('/api/notification-templates/type/anniversary');
      const templates = await templatesResponse.json();
      
      if (templates.length === 0) {
        toast({
          title: "Template tidak ditemukan",
          description: "Template notifikasi untuk ulang tahun pernikahan tidak ditemukan.",
          variant: "destructive"
        });
        return;
      }
      
      const template = templates[0];
      
      // Mengirim notifikasi
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: template.id,
          targetId: member.id,
          targetType: 'member',
          whatsappNumber: member.whatsapp,
          message: template.content
            .replace('{name}', member.name)
            .replace('{years}', years.toString())
            .replace('{spouse}', member.spouseName || 'pasangan')
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Ucapan terkirim",
          description: `Ucapan ulang tahun pernikahan berhasil dikirim ke ${member.name}.`,
        });
      } else {
        throw new Error(result.error || "Gagal mengirim ucapan");
      }
    } catch (error) {
      console.error("Error sending anniversary wishes:", error);
      toast({
        title: "Gagal mengirim ucapan",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim ucapan.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-xl">
          <span className="flex items-center gap-2">
            <Heart className="text-rose-500" size={20} />
            {member.name} & {member.spouseName}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2" size={16} />
            <span>
              {formattedDate} ({years} tahun)
            </span>
          </div>
          <Button 
            onClick={handleSendWishes}
            disabled={isSending || !member.whatsapp}
            size="sm"
            className="mt-2 w-full"
            variant="outline"
          >
            <Send className="mr-2" size={14} />
            {isSending ? "Mengirim..." : "Kirim Ucapan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
