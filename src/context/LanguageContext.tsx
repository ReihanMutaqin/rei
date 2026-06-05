import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, namespace?: string) => any;
}

const translations: any = {
  en: {
    nav: {
      about: 'About',
      works: 'Works',
      skills: 'Skills',
      experience: 'Experience',
      contact: 'Contact',
      support: 'Support',
      hireMe: 'Hire Me'
    },
    hero: {
      role: 'App & Game Developer',
      scroll: 'Scroll to explore'
    },
    about: {
      label: 'ABOUT',
      title: 'ME',
      desc: "I'm a creative professional with a passion for building immersive digital experiences. From educational games to augmented reality applications, I blend technical precision with creative vision to craft tools that educate, engage, and inspire. With expertise spanning Unity 3D, web development, and AR technologies, I bring ideas to life through code and creativity.",
      stats: {
        projects: 'Projects Completed',
        years: 'Years Freelancing',
        gpa: 'GPA'
      }
    },
    experience: {
      label: 'THE PATH',
      title: 'THE PATH',
      items: [
        { date: 'Nov 2025 – Present', role: 'Helpdesk Agent', company: 'PT Telkom Indonesia', description: 'Providing first-line technical support and customer service for Telkom\'s products and services. Handling incident tickets, troubleshooting network and service issues, and ensuring customer satisfaction through effective communication and problem resolution.' },
        { date: '2024 – Present', role: 'Freelance Developer', company: 'Self-Employed', description: 'Building games, AR experiences, and web applications for clients across education and entertainment sectors.' },
        { date: '2022 – 2024', role: 'Lead Developer', company: 'Himpunan Mahasiswa PTI', description: 'Led a 12-person technical team in developing educational software and organizing technology workshops for 200+ students.' },
        { date: '2020 – 2024', role: 'Computer Science Student', company: 'Universitas Bina Bangsa', description: 'Studied at Universitas Bina Bangsa with a focus on game development, graduating with a 3.96 GPA.' }
      ]
    },
    goldenFlow: {
      title: 'CREATING WORLDS'
    },
    projects: {
      label: 'CRAFT',
      title: 'SELECTED WORKS',
      viewProject: 'View Project',
      exploreMore: 'Explore More',
      items: [
        { title: 'AR Book — Dasar Komputer', description: 'An Augmented Reality education application that brings computer basics to life through 3D interactive animations triggered by scanning physical textbook pages.', year: '2024', tags: ['AR', 'EDUCATION', 'UNITY'], image: '/images/project-ar-book.jpg' },
        { title: 'Petualangan Barudak', description: 'An educational adventure game that introduces Indonesian geography and 3D geometry concepts through exploration, interactive quizzes, and real-world building visualizations.', year: '2024', tags: ['GAME', 'EDUCATION'], image: '/images/project-petualangan.jpg' },
        { title: 'ReLive AR', description: 'An AR-based live photo application that transforms static images into interactive experiences using real-time 3D overlays and spatial tracking.', year: '2025', tags: ['AR', 'MOBILE'], image: '/images/project-relive.jpg' },
        { title: 'Game Edukasi Penyusun Kata', description: 'An interactive word-building educational game where players arrange scrambled letters into correct Indonesian words based on visual clues and hints.', year: '2025', tags: ['GAME', 'EDUCATION'], image: '/images/project-wordgame.jpg' },
        { title: '43 Berita Kita', description: 'A responsive news portal website with dynamic content management, category systems, and publication workflows — built as a platform for delivering local and general news.', year: '2024', tags: ['WEB', 'CMS'], image: '/images/project-berita.jpg' },
        { title: 'E-Commerce Platform', description: 'A full-featured online shop system with product catalog, search, category filtering, shopping cart, checkout automation, and admin dashboard for inventory management.', year: '2023', tags: ['WEB', 'E-COMMERCE'], image: '/images/project-ecommerce.jpg' }
      ]
    },
    skills: {
      label: 'CAPABILITIES',
      title: 'THE ARSENAL',
      items: [
        { name: 'Unity 3D', proficiency: 95 },
        { name: 'C# Programming', proficiency: 90 },
        { name: 'Augmented Reality', proficiency: 85 },
        { name: 'Web Development', proficiency: 80 },
        { name: 'Game Design', proficiency: 90 },
        { name: 'UI/UX Design', proficiency: 75 },
        { name: '3D Modeling', proficiency: 70 },
        { name: 'Project Management', proficiency: 80 }
      ]
    },
    support: {
      label: 'SUPPORT ME',
      title: 'SUPPORT ME',
      desc: 'Jika karya saya bermanfaat, kamu bisa memberikan dukungan melalui QRIS. Masukkan nominal sesuai keikhlasanmu — setiap kontribusi sangat berarti.', // we'll translate this
      presetTitle: 'NOMINAL CEPAT',
      customTitle: 'ATAU MASUKKAN NOMINAL',
      minNominal: 'Nominal minimum Rp 1.000',
      maxNominal: 'Nominal maksimum Rp 50.000.000',
      btnGenerate: 'Generate QRIS',
      btnGenerating: 'Membuat QR...',
      note: 'QR Dinamis · Berlaku sekali pakai · Semua metode pembayaran QRIS didukung',
      tapCopy: 'TAP UNTUK SALIN',
      copied: '✓ TERSALIN',
      btnReset: 'Reset',
      btnDownload: 'Download QR',
      methodsTitle: 'CARA BAYAR',
      methodsDesc: '& semua aplikasi yang mendukung QRIS',
      footerDesc: 'QRIS terverifikasi Bank Indonesia · Aman & terenkripsi · Satu QRIS untuk semua'
    },
    contact: {
      label: 'REACH OUT',
      title: "LET'S CONNECT",
      desc: "Have a project in mind or want to collaborate? I'm always open to discussing new opportunities in game development, AR experiences, or web applications.",
      name: 'Name',
      email: 'Email',
      message: 'Message',
      btnSend: 'Send Message',
      btnSending: 'Sending...',
      orReach: 'Or reach me directly'
    },
    footer: {
      rights: 'All rights reserved.',
      builtWith: 'Built with passion'
    }
  },
  id: {
    nav: {
      about: 'Tentang',
      works: 'Karya',
      skills: 'Keahlian',
      experience: 'Pengalaman',
      contact: 'Kontak',
      support: 'Dukungan',
      hireMe: 'Pekerjakan'
    },
    hero: {
      role: 'Pengembang Aplikasi & Game',
      scroll: 'Gulir untuk melihat'
    },
    about: {
      label: 'TENTANG',
      title: 'SAYA',
      desc: 'Saya adalah seorang profesional kreatif dengan passion dalam membangun pengalaman digital yang imersif. Dari game edukatif hingga aplikasi augmented reality, saya memadukan presisi teknis dengan visi kreatif untuk menciptakan alat yang mengedukasi, melibatkan, dan menginspirasi. Dengan keahlian yang mencakup Unity 3D, pengembangan web, dan teknologi AR, saya mewujudkan ide-ide melalui kode dan kreativitas.',
      stats: {
        projects: 'Proyek Selesai',
        years: 'Tahun Freelance',
        gpa: 'IPK'
      }
    },
    experience: {
      label: 'PERJALANAN',
      title: 'PERJALANAN',
      items: [
        { date: 'Nov 2025 – Sekarang', role: 'Helpdesk Agent', company: 'PT Telkom Indonesia', description: 'Memberikan dukungan teknis lini pertama dan layanan pelanggan untuk produk dan layanan Telkom. Menangani tiket insiden, memecahkan masalah jaringan dan layanan, serta memastikan kepuasan pelanggan melalui komunikasi dan penyelesaian masalah yang efektif.' },
        { date: '2024 – Sekarang', role: 'Freelance Developer', company: 'Pekerja Lepas', description: 'Membangun game, pengalaman AR, dan aplikasi web untuk klien di sektor pendidikan dan hiburan.' },
        { date: '2022 – 2024', role: 'Lead Developer', company: 'Himpunan Mahasiswa PTI', description: 'Memimpin tim teknis beranggotakan 12 orang dalam mengembangkan perangkat lunak pendidikan dan menyelenggarakan lokakarya teknologi untuk 200+ siswa.' },
        { date: '2020 – 2024', role: 'Mahasiswa Ilmu Komputer', company: 'Universitas Bina Bangsa', description: 'Belajar di Universitas Bina Bangsa dengan fokus pada pengembangan game, lulus dengan IPK 3.96.' }
      ]
    },
    goldenFlow: {
      title: 'MENCIPTAKAN DUNIA'
    },
    projects: {
      label: 'KARYA',
      title: 'KARYA PILIHAN',
      viewProject: 'Lihat Proyek',
      exploreMore: 'Jelajahi Lebih Lanjut',
      items: [
        { title: 'AR Book — Dasar Komputer', description: 'Aplikasi edukasi Augmented Reality yang menghidupkan dasar-dasar komputer melalui animasi interaktif 3D yang dipicu dengan memindai halaman buku fisik.', year: '2024', tags: ['AR', 'EDUCATION', 'UNITY'], image: '/images/project-ar-book.jpg' },
        { title: 'Petualangan Barudak', description: 'Game petualangan edukatif yang memperkenalkan geografi Indonesia dan konsep geometri 3D melalui eksplorasi, kuis interaktif, dan visualisasi bangunan.', year: '2024', tags: ['GAME', 'EDUCATION'], image: '/images/project-petualangan.jpg' },
        { title: 'ReLive AR', description: 'Aplikasi foto live berbasis AR yang mengubah gambar statis menjadi pengalaman interaktif menggunakan overlay 3D real-time dan pelacakan spasial.', year: '2025', tags: ['AR', 'MOBILE'], image: '/images/project-relive.jpg' },
        { title: 'Game Edukasi Penyusun Kata', description: 'Game edukasi interaktif menyusun kata di mana pemain menyusun huruf-huruf acak menjadi kata bahasa Indonesia yang benar berdasarkan petunjuk visual.', year: '2025', tags: ['GAME', 'EDUCATION'], image: '/images/project-wordgame.jpg' },
        { title: '43 Berita Kita', description: 'Situs portal berita responsif dengan manajemen konten dinamis, sistem kategori, dan alur kerja publikasi — dibangun sebagai platform berita lokal.', year: '2024', tags: ['WEB', 'CMS'], image: '/images/project-berita.jpg' },
        { title: 'Platform E-Commerce', description: 'Sistem toko online berfitur lengkap dengan katalog produk, pencarian, keranjang belanja, otomatisasi checkout, dan dashboard admin untuk manajemen inventaris.', year: '2023', tags: ['WEB', 'E-COMMERCE'], image: '/images/project-ecommerce.jpg' }
      ]
    },
    skills: {
      label: 'KEMAMPUAN',
      title: 'KEAHLIAN INTI',
      items: [
        { name: 'Unity 3D', proficiency: 95 },
        { name: 'Pemrograman C#', proficiency: 90 },
        { name: 'Augmented Reality', proficiency: 85 },
        { name: 'Pengembangan Web', proficiency: 80 },
        { name: 'Desain Game', proficiency: 90 },
        { name: 'Desain UI/UX', proficiency: 75 },
        { name: 'Pemodelan 3D', proficiency: 70 },
        { name: 'Manajemen Proyek', proficiency: 80 }
      ]
    },
    support: {
      label: 'DUKUNGAN',
      title: 'DUKUNG KARYA',
      desc: 'Jika karya saya bermanfaat, kamu bisa memberikan dukungan melalui QRIS. Masukkan nominal sesuai keikhlasanmu — setiap kontribusi sangat berarti.',
      presetTitle: 'NOMINAL CEPAT',
      customTitle: 'ATAU MASUKKAN NOMINAL',
      minNominal: 'Nominal minimum Rp 1.000',
      maxNominal: 'Nominal maksimum Rp 50.000.000',
      btnGenerate: 'Buat QRIS',
      btnGenerating: 'Membuat QR...',
      note: 'QR Dinamis · Berlaku sekali pakai · Semua metode pembayaran QRIS didukung',
      tapCopy: 'KETUK UNTUK SALIN',
      copied: '✓ TERSALIN',
      btnReset: 'Ulangi',
      btnDownload: 'Unduh QR',
      methodsTitle: 'CARA BAYAR',
      methodsDesc: '& semua aplikasi yang mendukung QRIS',
      footerDesc: 'QRIS terverifikasi Bank Indonesia · Aman & terenkripsi · Satu QRIS untuk semua'
    },
    contact: {
      label: 'MENGHUBUNGI',
      title: 'MARI TERHUBUNG',
      desc: 'Punya ide proyek atau ingin berkolaborasi? Saya selalu terbuka untuk mendiskusikan peluang baru dalam pengembangan game, pengalaman AR, atau aplikasi web.',
      name: 'Nama',
      email: 'Email',
      message: 'Pesan',
      btnSend: 'Kirim Pesan',
      btnSending: 'Mengirim...',
      orReach: 'Atau hubungi saya langsung'
    },
    footer: {
      rights: 'Hak cipta dilindungi undang-undang.',
      builtWith: 'Dibuat dengan sepenuh hati'
    }
  }
};

// Fix support English translations
translations.en.support = {
  ...translations.en.support,
  desc: 'If my work has been helpful, you can support me via QRIS. Enter any amount you are comfortable with — every contribution is deeply appreciated.',
  presetTitle: 'QUICK AMOUNT',
  customTitle: 'OR ENTER AMOUNT',
  minNominal: 'Minimum amount Rp 1.000',
  maxNominal: 'Maximum amount Rp 50.000.000',
  btnGenerate: 'Generate QRIS',
  btnGenerating: 'Generating...',
  note: 'Dynamic QR · Single use · All QRIS payment methods supported',
  tapCopy: 'TAP TO COPY',
  copied: '✓ COPIED',
  btnReset: 'Reset',
  btnDownload: 'Download QR',
  methodsTitle: 'PAYMENT METHODS',
  methodsDesc: '& all applications supporting QRIS',
  footerDesc: 'QRIS verified by Bank Indonesia · Secure & encrypted · One QRIS for all'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load saved language or detect browser preference
    const saved = localStorage.getItem('app_lang') as Language;
    if (saved === 'en' || saved === 'id') {
      setLanguageState(saved);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('id')) {
        setLanguageState('id');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string, namespace: string = 'common'): any => {
    try {
      const keys = key.split('.');
      let current: any = translations[language][namespace];
      
      for (const k of keys) {
        if (current[k] === undefined) {
          // Fallback to English
          let fallback = translations['en'][namespace];
          for (const fk of keys) {
            if (fallback[fk] === undefined) return key;
            fallback = fallback[fk];
          }
          return fallback;
        }
        current = current[k];
      }
      return current;
    } catch (e) {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
