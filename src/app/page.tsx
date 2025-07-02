// src/app/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from './lib/supabaseClient';
import RSVPForm from './components/RSVPForm';

// Tipe data untuk ucapan
type GuestbookEntry = {
  id: number;
  created_at: string;
  name: string;
  message: string;
  attendance: string;
};

const dummyImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
];

export default function Home() {
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlaySlideUp, setOverlaySlideUp] = useState(false);

  // Fetch guestbook entries on mount
  useEffect(() => {
    async function fetchGuestbook() {
      const { data } = await supabase
        .from('Guest Book')
        .select('*')
        .order('created_at', { ascending: false });
      setGuestbook(data || []);
      setLoading(false);
    }
    fetchGuestbook();
  }, []);

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dummyImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Animation on scroll for guestbook
  const guestbookRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (guestbookRef.current) {
        const top = guestbookRef.current.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
          guestbookRef.current.classList.add("animate-slide-up");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Overlay tap handler
  const handleOverlayTap = () => {
    setOverlaySlideUp(true);
    setTimeout(() => setShowOverlay(false), 100); // match animation duration
  };

  return (
    <>
      {/* Opening Overlay */}
      {showOverlay && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-white to-blue-100 transition-transform duration-700 ${
            overlaySlideUp ? "animate-overlay-slideup-only" : ""
          }`}
          onClick={handleOverlayTap}
          style={{ cursor: "pointer" }}
        >
          <div className="text-center px-6 py-8 rounded-xl shadow-lg bg-white/70 backdrop-blur-sm max-w-md w-full mx-4 sm:mx-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-pink-700 drop-shadow">Alex & Elena</h1>
            <p className="text-base sm:text-lg mb-6 text-gray-700">Undangan Pernikahan</p>
            <div className="animate-bounce text-gray-500 text-lg sm:text-xl">Tap anywhere to open</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`font-sans max-w-2xl mx-auto p-4 text-gray-700 transition-opacity duration-700 ${showOverlay ? "opacity-0" : "opacity-100"}`}>
        {/* Hero Section with background and fade-in */}
        <section className="relative h-72 flex items-center justify-center mb-8 rounded-2xl overflow-hidden shadow-lg animate-fadein">
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=900&q=80"
            alt="Wedding"
            className="absolute inset-0 w-full h-full object-cover brightness-75"
          />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-5xl font-extrabold drop-shadow-lg mb-2 animate-fadein-down">Alex & Elena</h1>
            <p className="text-lg mt-2 animate-fadein-down delay-100">We are getting married!</p>
            <p className="mt-4 text-2xl font-semibold animate-fadein-down delay-200">10 Agustus 2025</p>
          </div>
        </section>

        {/* Image Carousel/Slider */}
        <section className="mb-10">
          <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-md">
            {dummyImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Wedding slide ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === currentSlide ? "opacity-100" : "opacity-0"}`}
                draggable={false}
              />
            ))}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {dummyImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${idx === currentSlide ? "bg-white" : "bg-white/50"} border border-gray-300`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Bagian Detail Acara */}
        <section className="my-10 p-6 bg-gray-100 rounded-lg shadow-md animate-fadein-up">
          <h2 className="text-2xl font-bold text-center mb-4">Detail Acara</h2>
          <p className="text-center"><strong>Lokasi:</strong> Grand Ballroom, Jakarta</p>
          <p className="text-center"><strong>Waktu:</strong> 19:00 WIB - Selesai</p>
        </section>

        {/* Bagian Angpao Digital */}
        <section className="my-10 text-center animate-fadein-up delay-100">
           <h2 className="text-2xl font-bold mb-4">Digital Angpao</h2>
           <p>Doa restu Anda adalah hadiah terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, Anda dapat melakukannya melalui:</p>
           <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block shadow transition-transform hover:scale-105">
              <p><strong>BCA:</strong> 1234567890</p>
              <p>a/n Alex</p>
           </div>
        </section>

        {/* Bagian Form RSVP */}
        <section className="my-10 animate-fadein-up delay-200">
          <h2 className="text-2xl font-bold text-center mb-4">RSVP & Ucapan</h2>
          <div className="rounded-lg shadow-lg p-4 bg-white transition-transform hover:scale-105">
            <RSVPForm />
          </div>
        </section>

        {/* Bagian Tampilan Ucapan */}
        <section className="my-10" ref={guestbookRef}>
          <h2 className="text-2xl font-bold text-center mb-4">Ucapan Selamat</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-400">Memuat ucapan...</div>
            ) : guestbook.length === 0 ? (
              <div className="text-center text-gray-400">Belum ada ucapan.</div>
            ) : (
              guestbook.map((entry: GuestbookEntry, idx) => (
                <div
                  key={entry.id}
                  className={`p-4 bg-white border rounded-lg shadow-sm transition-transform hover:scale-105 animate-fadein-up`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={`https://i.pravatar.cc/40?u=${entry.name}`}
                      alt={entry.name}
                      className="w-8 h-8 rounded-full border"
                    />
                    <span className="font-bold">{entry.name}</span>
                  </div>
                  
                  <p className="mt-2 text-gray-600">{entry.message}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}

// Custom animation styles (add to global CSS or Tailwind config)
// .animate-fadein { animation: fadein 1s both; }
// .animate-fadein-down { animation: fadein-down 1s both; }
// .animate-fadein-up { animation: fadein-up 1s both; }
// @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
// @keyframes fadein-down { from { opacity: 0; transform: translateY(-30px);} to { opacity: 1; transform: none;} }
// @keyframes fadein-up { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none;} }

// Untuk revalidasi data, agar ucapan baru bisa muncul
// export const revalidate = 60; // Revalidate every 60 seconds

/*
Add this to your global CSS (e.g., styles/globals.css or Tailwind config):

@keyframes overlay-slideup-only {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
.animate-overlay-slideup-only {
  animation: overlay-slideup-only 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
}

@media (max-width: 640px) {
  .max-w-md {
    max-width: 95vw !important;
  }
}
*/