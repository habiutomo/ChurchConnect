const WelcomeCard = () => {
  return (
    <div className="bg-primary rounded-lg shadow-md overflow-hidden mb-6">
      <div className="md:flex">
        <div className="p-6 md:w-2/3">
          <h2 className="text-xl font-heading font-semibold text-white mb-2">
            Selamat Datang di Aplikasi Gereja IMMANUEL
          </h2>
          <p className="text-primary-light text-sm mb-4">
            "Dan Ia akan menjadi damai sejahtera!" - Mikha 5:5
          </p>
          <p className="text-white text-sm mb-5">
            Aplikasi ini dirancang untuk membantu pelayanan gereja menjadi lebih efektif dan terorganisir. 
            Kelola data jemaat, renungan harian, keuangan, jadwal ibadah, dan kirim notifikasi dalam satu platform terpadu.
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
            Memulai
          </button>
        </div>
        <div className="md:w-1/3 relative h-48 md:h-auto">
          <img 
            className="absolute inset-0 h-full w-full object-cover" 
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Komunitas gereja" 
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
