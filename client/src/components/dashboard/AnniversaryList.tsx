import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { AnniversaryCard } from "@/components/members/AnniversaryCard";
import { Member } from "@shared/schema";

interface AnniversaryListProps {
  members?: Member[];
}

const AnniversaryList = ({ members }: AnniversaryListProps) => {
  const { data: anniversaryMembers, isLoading } = useQuery({
    queryKey: ["/api/members/anniversary"],
    enabled: !members, // Only fetch if members aren't provided
    initialData: members,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-rose-500" />
            Pernikahan
          </CardTitle>
          <CardDescription>
            Perayaan pernikahan jemaat bulan ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentMembers = anniversaryMembers || members || [];
  const marriedMembers = currentMembers.filter(m => 
    m.maritalStatus === "Married" && m.anniversaryDate
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="text-rose-500" />
          Pernikahan
        </CardTitle>
        <CardDescription>
          Perayaan pernikahan jemaat bulan ini
        </CardDescription>
      </CardHeader>
      <CardContent>
        {marriedMembers.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            Tidak ada perayaan pernikahan bulan ini
          </div>
        ) : (
          <div className="space-y-4">
            {marriedMembers.map((member) => (
              <AnniversaryCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnniversaryList;
