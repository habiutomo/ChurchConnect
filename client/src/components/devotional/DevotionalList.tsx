import { Devotional } from "@/lib/types";
import DevotionalItem from "./DevotionalItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpenIcon } from "lucide-react";

interface DevotionalListProps {
  onSelectDevotional: (devotional: Devotional) => void;
  userId?: number;
}

const DevotionalList = ({ onSelectDevotional, userId = 1 }: DevotionalListProps) => {
  const { data: devotionals, isLoading: isLoadingDevotionals } = useQuery({
    queryKey: ['/api/devotionals'],
  });

  const { data: bookmarks, isLoading: isLoadingBookmarks } = useQuery({
    queryKey: [`/api/bookmarks/user/${userId}`],
  });

  // Create a Set of bookmarked devotional IDs for easy checking
  const bookmarkedIds = new Map();
  if (bookmarks) {
    bookmarks.forEach((bookmark: any) => {
      bookmarkedIds.set(bookmark.devotionalId, bookmark.id);
    });
  }

  const renderDevotionalList = (devotionalList: Devotional[] | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-8 w-28 rounded-md" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!devotionalList || devotionalList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <BookOpenIcon className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Tidak ada renungan</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tidak ada renungan yang tersedia saat ini.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devotionalList.map((devotional) => (
          <DevotionalItem 
            key={devotional.id} 
            devotional={devotional} 
            isBookmarked={bookmarkedIds.has(devotional.id)}
            bookmarkId={bookmarkedIds.get(devotional.id)}
            userId={userId}
            onSelect={onSelectDevotional}
          />
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all">Semua Renungan</TabsTrigger>
        <TabsTrigger value="bookmarked">Ditandai</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        {renderDevotionalList(devotionals, isLoadingDevotionals)}
      </TabsContent>
      
      <TabsContent value="bookmarked" className="mt-0">
        {renderDevotionalList(
          bookmarks?.map((bookmark: any) => bookmark.devotional),
          isLoadingBookmarks
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DevotionalList;
