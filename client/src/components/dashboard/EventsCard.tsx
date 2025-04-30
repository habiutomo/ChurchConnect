import { Link } from "wouter";
import { Event } from "@/lib/types";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { ClockIcon, MapPinIcon } from "lucide-react";

interface EventsCardProps {
  events: Event[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'scheduled':
      return <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full leading-none">Terjadwal</div>;
    case 'preparation':
      return <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full leading-none">Persiapan</div>;
    case 'registration':
      return <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full leading-none">Pendaftaran</div>;
    case 'ongoing':
      return <div className="bg-primary-light/20 text-primary-dark text-xs px-2 py-1 rounded-full leading-none">Sedang Berlangsung</div>;
    case 'completed':
      return <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full leading-none">Selesai</div>;
    case 'cancelled':
      return <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full leading-none">Dibatalkan</div>;
    default:
      return <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full leading-none">{status}</div>;
  }
};

const EventItem = ({ event }: { event: Event }) => {
  const eventDate = new Date(event.startDate);
  const month = format(eventDate, "MMM", { locale: id }).toUpperCase();
  const day = format(eventDate, "d");
  
  return (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0 bg-primary-light bg-opacity-10 rounded-lg p-3 mr-4 text-center">
        <span className="block text-xl font-bold text-primary">{day}</span>
        <span className="block text-xs text-primary-dark">{month}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold truncate">{event.title}</h4>
        <p className="mt-1 text-xs text-gray-500 flex items-center">
          <ClockIcon className="w-3 h-3 mr-1" />
          {event.startTime} - {event.endTime} WIB
        </p>
        <p className="mt-1 text-xs text-gray-500 flex items-center">
          <MapPinIcon className="w-3 h-3 mr-1" />
          {event.location}
        </p>
      </div>
      {getStatusBadge(event.status)}
    </div>
  );
};

const EventsCard = ({ events }: EventsCardProps) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium font-heading text-neutral-darkest">Jadwal Mendatang</h3>
          <Link href="/calendar">
            <a className="text-sm text-primary font-medium hover:text-primary-dark">Lihat Semua</a>
          </Link>
        </div>
        <div className="px-6 py-4 flex justify-center items-center h-48">
          <p className="text-gray-500">Tidak ada jadwal mendatang</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-medium font-heading text-neutral-darkest">Jadwal Mendatang</h3>
        <Link href="/calendar">
          <a className="text-sm text-primary font-medium hover:text-primary-dark">Lihat Semua</a>
        </Link>
      </div>
      <div className="px-6 py-4">
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventsCard;
