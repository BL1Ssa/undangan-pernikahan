// src/components/RSVPForm.tsx
'use client'; // <-- Ini penting! Menandakan ini adalah komponen interaktif (client component)

import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function RSVPForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState('Hadir');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback('');

    const { data, error, status, statusText } = await supabase
  .from('Guest Book')
  .insert([{ name, message, attendance }]);
console.log('Insert response:', { data, error, status, statusText });
    if (error) {
      setFeedback('Gagal mengirim ucapan. Coba lagi.');
      console.error('Error inserting data:', error);
    } else {
      setFeedback('Terima kasih! Ucapanmu sudah tersimpan.');
      setName('');
      setMessage('');
      // Refresh halaman untuk melihat ucapan baru
      window.location.reload(); 
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-50 rounded-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="attendance" className="block text-sm font-medium text-gray-700">Konfirmasi Kehadiran</label>
        <select
          id="attendance"
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option>Hadir</option>
          <option>Tidak Hadir</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Ucapan & Doa</label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Mengirim...' : 'Kirim Ucapan'}
      </button>
      {feedback && <p className="mt-4 text-center">{feedback}</p>}
    </form>
  );
}