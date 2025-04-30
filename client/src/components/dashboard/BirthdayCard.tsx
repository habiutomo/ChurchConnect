import { Link } from "wouter";
import { Member } from "@/lib/types";
import { differenceInYears, format } from "date-fns";
import { id } from "date-fns/locale";
import { MessageSquareIcon } from "lucide-react";

interface BirthdayCardProps {
  members: Member[];
}

const BirthdayItem = ({ member }: { member: Member }) => {
  const today = new Date();
  const birthDate = new Date(member.dateOfBirth);
  const age = differenceInYears(today, birthDate);
  
  const formattedDate = format(birthDate, "d MMMM", { locale: id });
  const isToday = format(birthDate, "MM-dd") === format(today, "MM-dd");
  const isTomorrow = format(birthDate, "MM-dd") === format(new Date(today.setDate(today.getDate() + 1)), "MM-dd");
  
  let dateDisplay = formattedDate;
  if (isToday) dateDisplay = `${formattedDate} (Hari ini)`;
  if (isTomorrow) dateDisplay = `${formattedDate} (Besok)`;

  const initials = member.name.split(' ').map(n => n[0]).join('').substr(0, 2).toUpperCase();
  const colorClass = `bg-${['blue', 'green', 'purple', 'pink', 'yellow'][Math.floor(Math.random() * 5)]}-100`;

  return (
    <div className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className={`h-10 w-10 rounded-full mr-4 flex items-center justify-center bg-primary-light/20 text-primary font-medium`}>
        {initials}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{member.name}</h4>
        <div className="flex items-center mt-1">
          <span className="text-xs text-gray-500 mr-2">{dateDisplay}</span>
          <span className="text-xs font-medium text-status-success">{age} tahun</span>
        </div>
      </div>
      <button className="text-secondary hover:text-secondary-dark">
        <MessageSquareIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const BirthdayCard = ({ members }: BirthdayCardProps) => {
  if (!members || members.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium font-heading text-neutral-darkest">Ulang Tahun Jemaat</h3>
          <Link href="/members">
            <a className="text-sm text-primary font-medium hover:text-primary-dark">Lihat Semua</a>
          </Link>
        </div>
        <div className="p-4 flex justify-center items-center h-48">
          <p className="text-gray-500">Tidak ada ulang tahun dalam waktu dekat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-medium font-heading text-neutral-darkest">Ulang Tahun Jemaat</h3>
        <Link href="/members">
          <a className="text-sm text-primary font-medium hover:text-primary-dark">Lihat Semua</a>
        </Link>
      </div>
      <div className="p-4">
        {members.map((member) => (
          <BirthdayItem key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

export default BirthdayCard;
