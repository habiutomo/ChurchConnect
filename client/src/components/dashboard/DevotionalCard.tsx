import { Link } from "wouter";
import { BookmarkIcon, ShareIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Devotional } from "@/lib/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface DevotionalCardProps {
  devotional: Devotional;
}

const DevotionalCard = ({ devotional }: DevotionalCardProps) => {
  if (!devotional) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium font-heading text-neutral-darkest">Renungan Hari Ini</h3>
          <Link href="/devotional">
            <a className="text-sm text-primary font-medium hover:text-primary-dark">Lihat Semua</a>
          </Link>
        </div>
        <div className="p-6 flex justify-center items-center h-48">
          <p className="text-gray-500">Tidak ada renungan untuk hari ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-medium font-heading text-neutral-darkest">Renungan Hari Ini</h3>
        <Link href="/devotional">
          <a className="text-sm text-primary font-medium hover:text-primary-dark">Lihat Semua</a>
        </Link>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {format(new Date(devotional.date), "EEEE, d MMMM yyyy", { locale: id })}
          </span>
          <span className="bg-primary-light bg-opacity-20 text-primary-dark text-xs px-2 py-1 rounded-full">
            {devotional.category}
          </span>
        </div>
        <h4 className="text-lg font-semibold mb-2">{devotional.title}</h4>
        <p className="text-sm text-gray-600 mb-3">{devotional.content}</p>
        <blockquote className="italic pl-3 border-l-4 border-primary-light text-sm font-scripture text-gray-600 mb-4">
          "{devotional.scripture}" - {devotional.scriptureCitation}
        </blockquote>
        <div className="flex justify-between items-center">
          <Button className="inline-flex items-center" size="sm">
            <EyeIcon className="w-4 h-4 mr-2" />
            Baca Lengkap
          </Button>
          <div className="flex space-x-3">
            <button className="text-gray-400 hover:text-secondary">
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-primary">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevotionalCard;
