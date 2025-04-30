import { Devotional } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, ShareIcon, PlayIcon, Bookmark, MessageSquareIcon, EyeIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface DevotionalItemProps {
  devotional: Devotional;
  isBookmarked?: boolean;
  userId?: number;
  bookmarkId?: number;
  onSelect?: (devotional: Devotional) => void;
}

const DevotionalItem = ({ 
  devotional, 
  isBookmarked = false,
  userId = 1, // Default to admin user
  bookmarkId,
  onSelect 
}: DevotionalItemProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const addBookmarkMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", "/api/bookmarks", {
        userId,
        devotionalId: devotional.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bookmarks/user/${userId}`] });
      setBookmarked(true);
      toast({
        title: "Berhasil!",
        description: "Renungan telah ditambahkan ke bookmark",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menambahkan bookmark",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: () => {
      return apiRequest("DELETE", `/api/bookmarks/${bookmarkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/bookmarks/user/${userId}`] });
      setBookmarked(false);
      toast({
        title: "Berhasil!",
        description: "Renungan telah dihapus dari bookmark",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal menghapus bookmark",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleBookmark = () => {
    if (bookmarked) {
      if (bookmarkId) removeBookmarkMutation.mutate();
    } else {
      addBookmarkMutation.mutate();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-1">
          <CardDescription>
            {formatDate(devotional.date, "EEEE, d MMMM yyyy")}
          </CardDescription>
          <Badge variant="secondary">{devotional.category}</Badge>
        </div>
        <CardTitle className="text-xl">{devotional.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{devotional.content}</p>
        <blockquote className="scripture mb-4">
          "{devotional.scripture}" - {devotional.scriptureCitation}
        </blockquote>
        
        {devotional.mediaType !== "text" && (
          <div className="mb-4 bg-primary/5 p-3 rounded-md flex items-center">
            {devotional.mediaType === "audio" ? (
              <div className="flex items-center text-sm text-primary">
                <PlayIcon className="mr-2 h-4 w-4" />
                Audio tersedia
              </div>
            ) : (
              <div className="flex items-center text-sm text-primary">
                <PlayIcon className="mr-2 h-4 w-4" />
                Video tersedia
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => onSelect && onSelect(devotional)}
        >
          <EyeIcon className="mr-2 h-4 w-4" />
          Baca Lengkap
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={bookmarked ? "text-secondary" : "text-gray-400 hover:text-secondary"}
            onClick={toggleBookmark}
            disabled={addBookmarkMutation.isPending || removeBookmarkMutation.isPending}
          >
            {bookmarked ? <Bookmark className="h-5 w-5" /> : <BookmarkIcon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
            <ShareIcon className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DevotionalItem;
