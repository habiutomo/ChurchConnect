import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format, differenceInYears } from "date-fns";
import { Calendar, Heart } from "lucide-react";
import { Member } from "@shared/schema";

interface AnniversaryCardProps {
  member: Member;
}

export const AnniversaryCard = ({ member }: AnniversaryCardProps) => {
  if (!member.anniversaryDate) return null;
  
  const anniversaryDate = new Date(member.anniversaryDate);
  const years = differenceInYears(new Date(), anniversaryDate);
  const nextAnniversary = new Date(new Date().getFullYear(), anniversaryDate.getMonth(), anniversaryDate.getDate());
  const isPassed = nextAnniversary < new Date();
  
  // If anniversary is passed, calculate next year's anniversary date
  if (isPassed) {
    nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
  }
  
  const daysDiff = Math.ceil((nextAnniversary.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="overflow-hidden border border-border bg-card hover:border-primary/50 transition-colors">
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{member.name}</h4>
            <div className="text-sm text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {format(anniversaryDate, "d MMMM yyyy")}
              </span>
            </div>
          </div>
          <div className="ml-2 flex flex-col items-end">
            <Badge variant="outline" className="font-semibold">
              {years} Tahun
            </Badge>
            <span className="mt-1 text-xs text-muted-foreground">
              {daysDiff === 0 
                ? "Hari ini!" 
                : `${daysDiff} hari ${isPassed ? "lagi" : "yang lalu"}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
