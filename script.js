/* =========================================================
   NAVIGASI HALAMAN
   ========================================================= */
   const tombol = document.getElementById('btn-menu');
   const menu = document.getElementById('menu');
   const linkMenu = document.querySelectorAll('.nav-links a');
   const halaman = document.querySelectorAll('.halaman');
   
   let halamanAktif = 'beranda';
   
   const NAMA = {
     beranda: 'Beranda',
     jurusan: 'Jurusan',
     guru: 'Guru Jurusan',
     kurikulum: 'Kurikulum RPL',
     karya: 'Karya Siswa',
     kontak: 'Kontak',
     jadwal: 'Jadwal Praktikum',
     modul: 'Modul Pemrograman Web',
     lab: 'Daftar Lab RPL',
     pkl: 'Info PKL & LSP'
   };
   
   // buka/tutup menu di HP
   if (tombol && menu) tombol.addEventListener('click', function () {
     menu.classList.toggle('open');
   });
   // dropdown "Lainnya" (bisa disentuh di HP/tablet)
   const ddBtn = document.querySelector('.dd-btn');
   if (ddBtn) {
     ddBtn.addEventListener('click', function (e) { e.stopPropagation(); ddBtn.parentNode.classList.toggle('buka'); });
     document.addEventListener('click', function () { ddBtn.parentNode.classList.remove('buka'); });
   }
   
   // tema gelap / terang
   const temaBtn = document.getElementById('tema') || document.createElement('button');
   function setTema(t) {
     document.documentElement.setAttribute('data-tema', t);
     temaBtn.textContent = t === 'gelap' ? '☀️' : '🌙';
     try { localStorage.setItem('tema', t); } catch (e) {}
   }
   (function () {
     let t = null;
     try { t = localStorage.getItem('tema'); } catch (e) {}
     if (!t) t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'gelap' : 'terang';
     setTema(t);
   })();
   temaBtn.addEventListener('click', function () {
     setTema(document.documentElement.getAttribute('data-tema') === 'gelap' ? 'terang' : 'gelap');
   });

   // tampilkan satu halaman saja
   function tampil(id) {
     halamanAktif = id;
     halaman.forEach(function (h) {
       h.classList.toggle('aktif', h.id === id);
     });
     linkMenu.forEach(function (a) {
       a.classList.toggle('aktif', a.getAttribute('href') === '#' + id);
     });
     window.scrollTo({ top: 0, behavior: 'smooth' });
     revealBaru();
     if (typeof perbaruiKonteks === 'function') perbaruiKonteks();
   }
   
   // klik menu atas / menu cepat -> ganti halaman
   linkMenu.forEach(function (a) {
     a.addEventListener('click', function (e) {
       e.preventDefault();
       tampil(a.getAttribute('href').substring(1));
       if (menu) menu.classList.remove('open');
     });
   });
   
   // tombol di dalam halaman (contoh: "Lihat Karya Siswa")
   document.querySelectorAll('[data-ke]').forEach(function (t) {
     t.addEventListener('click', function (e) {
       e.preventDefault();
       tampil(t.getAttribute('data-ke'));
     });
   });
   
   try {
   /* =========================================================
      CHATBOT ASISTEN SMKN 9 MEDAN (berbasis aturan, tanpa internet)
      ========================================================= */
   
   // ---------- 1. DATA PENGETAHUAN (EDIT DI SINI) ----------
   // k = kata kunci, j = jawaban (teks / fungsi), b = halaman yang bisa dibuka,
   // q = judul pertanyaan (untuk saran), s = saran lanjutan, d = penjelasan detail ("lanjut"),
   // pendek = hanya cocok untuk kalimat pendek, p = prioritas
   const ACAK = function (a) { return a[Math.floor(Math.random() * a.length)]; };
   const LELUCON = [
     'Kenapa programmer suka gelap? Karena light attracts bugs 🐛',
     'Ada 10 jenis orang di dunia: yang paham biner dan yang tidak 😄',
     'Programmer disuruh beli susu: "Kalau ada telur, beli 6." Dia pulang bawa 6 susu 🥛',
     'CSS itu seperti dandan: kadang cuma geser 1 pixel, tapi bikin stres 1 jam 😅'
   ];
   const MOTIVASI = [
     'Semua programmer hebat dulu pernah bingung dengan error pertamanya. Lanjut terus, satu baris kode sehari! 💪',
     'Error bukan musuh, tapi petunjuk. Baca pesannya pelan-pelan, biasanya jawabannya ada di sana.',
     'Capek itu wajar. Istirahat sebentar, minum air, lalu coba lagi dengan kepala dingin ☕',
     'Jangan bandingkan bab 1 kamu dengan bab 20 orang lain. Progres kecil tetap progres 🌱'
   ];
   // ---------- DATA JURUSAN & GURU (EDIT DI SINI) ----------
   const JURUSAN = [
     { id: 'rpl', kode: 'RPL', c: '#2563eb', judul: 'Rekayasa Perangkat Lunak', nama: 'Rekayasa Perangkat Lunak', logo: 'Rpl.jpg', desk: 'Membuat website, aplikasi, dan mengelola data.', guru: 'Pak Ardiansyah', q: 'Apa itu jurusan RPL?',
       mapel: ['Pemrograman Web', 'Basis Data', 'Pemrograman Berorientasi Objek', 'Pemodelan Perangkat Lunak', 'PKL'], karier: ['Web Developer', 'Programmer', 'QA / Tester', 'Admin Database', 'UI/UX Designer'] },
     { id: 'tkj', kode: 'TKJ', c: '#0e9aa7', judul: 'Teknik Jaringan Komputer', nama: 'Teknik Komputer dan Jaringan', logo: 'tkj.jpg', desk: 'Perakitan komputer, jaringan, dan server.', guru: 'Pak Khoir', q: 'Jelaskan jurusan TKJ',
       mapel: ['Komputer dan Jaringan Dasar', 'Teknologi Jaringan Kabel & Nirkabel', 'Administrasi Infrastruktur Jaringan', 'Administrasi Sistem Jaringan', 'PKL'], karier: ['Teknisi Jaringan', 'Admin Server', 'Network Engineer', 'Teknisi Komputer', 'Keamanan Siber'] },
     { id: 'dkv', kode: 'DKV', c: '#7c3aed', judul: 'Desain Komunikasi Visual', nama: 'Desain Komunikasi Visual', logo: 'dkv.jpg', desk: 'Desain grafis, ilustrasi, dan branding.', guru: 'Pak Imanuel', q: 'Jelaskan jurusan DKV',
       mapel: ['Desain Grafis', 'Tipografi', 'Ilustrasi Digital', 'Fotografi', 'PKL'], karier: ['Desainer Grafis', 'Ilustrator', 'Brand Designer', 'Fotografer', 'Content Creator'] },
     { id: 'pspt', kode: 'PSPT', c: '#db2777', judul: 'Produksi dan Siaran Program Televisi', nama: 'Produksi dan Siaran Program Televisi', logo: 'pspt.jpg', desk: 'Produksi video, kamera, dan penyiaran TV.', guru: 'Bu Sofi', q: 'Jelaskan jurusan PSPT',
       mapel: ['Dasar Produksi Program TV', 'Teknik Kamera', 'Editing Video', 'Penulisan Naskah', 'PKL'], karier: ['Kameramen', 'Video Editor', 'Penulis Naskah', 'Produser', 'Kreator Video'] },
     { id: 'animasi', kode: 'ANIMASI', c: '#d97706', judul: 'Animasi', nama: 'Animasi', logo: 'animasi.jpg', desk: 'Animasi 2D, 3D, dan motion graphic.', guru: 'Pak Dede', q: 'Jelaskan jurusan Animasi',
       mapel: ['Gambar Sketsa', 'Storyboard', 'Animasi 2D', 'Animasi 3D', 'PKL'], karier: ['Animator 2D/3D', 'Storyboard Artist', 'Motion Designer', 'Game Artist', 'Visual Effects'] },
     { id: 'social', kode: 'SOCIAL CARE', c: '#e11d48', judul: 'Pekerja Sosial', nama: 'Social Care', logo: 'socialcare.jpg', desk: 'Pelayanan dan pendampingan sosial.', guru: 'Bu Sofa', q: 'Jelaskan jurusan Social Care',
       mapel: ['Dasar Layanan Sosial', 'Komunikasi & Pendampingan', 'Perawatan Lansia', 'Pengasuhan Anak', 'PKL'], karier: ['Pendamping Sosial', 'Caregiver Lansia', 'Pengasuh Anak', 'Pekerja Sosial', 'Relawan / LSM'] }
   ];

   const BASIS = [
     { k: ['halo','hallo','hai','hi','hei','hey','pagi','siang','sore','malam','assalamualaikum','permisi'], pendek: true, p: -2,
       j: function () { return 'Halo' + (namaUser ? ', ' + namaUser : '') + '! 👋 Aku asisten virtual SMK Negeri 9 Medan. Mau tanya soal apa?'; } },
     { k: ['terima kasih','makasih','thanks','thx','tengkyu'], pendek: true, p: 1,
       j: 'Sama-sama! 😊 Kalau masih ada yang ingin ditanyakan, tanya saja ya.' },
     { k: ['dadah','bye','sampai jumpa','selamat tinggal','pamit','sampai nanti'], pendek: true, p: 1,
       j: 'Sampai jumpa! 👋 Semangat belajarnya, kembali lagi kapan saja.' },
     { k: ['apa kabar','kabarmu','lagi apa'], pendek: true, p: 1,
       j: 'Aku baik-baik saja, siap membantu! 😊 Kamu sendiri bagaimana?' },
     { k: ['siapa kamu','kamu siapa','namamu','nama kamu','bot','asisten','kamu ai','robot','chatbot'], p: 1,
       j: 'Aku asisten virtual portal SMK Negeri 9 Medan 🤖. Aku bukan AI penuh, tapi punya banyak pengetahuan soal sekolah, jurusan RPL, dan dasar-dasar pemrograman. Kalau belum tahu jawabannya, aku akan jujur dan mengarahkan kamu ke kontak sekolah.' },
     { k: ['bisa apa','bantu apa','fitur','bantuan','help','menu','topik'], p: 1,
       j: 'Kamu bisa tanya soal:\n• Sekolah & jurusan RPL (kurikulum, lab, jadwal, PKL, LSP, kontak)\n• Pemrograman (HTML, CSS, JavaScript, SQL, PHP, Python, Java, Git, dll.)\n• Basis data, jaringan, UI/UX, karier IT, tips belajar\n• Hitung-hitungan, jam & tanggal, lelucon, dan motivasi',
       s: ['Apa itu jurusan RPL?', 'Apa itu HTML?', 'Beri aku motivasi', 'Ceritakan lelucon'] },
     { k: ['keren','hebat','pintar','bagus','mantap','pinter','canggih'], pendek: true, p: -1,
       j: 'Terima kasih! 😄 Kamu juga keren sudah mau belajar.' },
     { k: ['bodoh','goblok','tolol','jelek','payah','anjing','bego'], pendek: true, p: 1,
       j: 'Maaf kalau jawabanku kurang membantu 🙏 Coba tulis pertanyaannya dengan kata lain, atau kirim email ke smkn09medan@gmail.com.' },
     { k: ['lelucon','jokes','joke','humor','lucu','garing','hibur'], p: 1, j: function () { return ACAK(LELUCON); } },
     { k: ['motivasi','semangat','capek','malas','bosan','putus asa','menyerah','kata mutiara','stres','pusing'], p: 1, j: function () { return ACAK(MOTIVASI); } },
     { k: ['jam berapa','tanggal','hari ini','sekarang','waktu','hari apa'], p: 1,
       j: function () { const n = new Date(); return 'Sekarang ' + n.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ', pukul ' + n.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':') + ' 🕒'; } },

     /* ---------- SEKOLAH & JURUSAN ---------- */
     { k: ['apa itu rpl','jurusan rpl','rekayasa perangkat lunak','tentang rpl','rpl'], q: 'Apa itu jurusan RPL?', b: 'kurikulum',
       j: 'RPL (Rekayasa Perangkat Lunak) adalah jurusan yang mempelajari cara membuat perangkat lunak: website, aplikasi, dan pengelolaan basis data.\n\nDi SMKN 9 Medan, siswa belajar pemrograman web, basis data, dan pemrograman berorientasi objek, lalu praktik langsung lewat PKL.',
       s: ['Apa saja mata pelajarannya?', 'Apa itu PKL?', 'Prospek kerja lulusan RPL?'] },
     { k: ['email','e-mail','kontak','hubungi','telepon','nomor','wa','hp','whatsapp','surel'], p: 1, q: 'Berapa email sekolah?', b: 'kontak',
       j: 'Email sekolah: smkn09medan@gmail.com\n\nUntuk pertanyaan yang belum terjawab di sini, silakan kirim email ke alamat tersebut.' },
     { k: ['alamat','lokasi','di mana','letak','maps','peta','jalan','rute'], q: 'Di mana alamat sekolah?', b: 'kontak',
       j: 'SMK Negeri 9 Medan beralamat di:\nJl. Patriot No.20 A, Lalang, Kec. Medan Sunggal, Kota Medan, Sumatera Utara 20123.\n\nKamu bisa membukanya di Google Maps dari halaman Kontak.' },
     { k: ['smkn 9','smk negeri 9','smkn9','sekolah','tentang sekolah','smk'], b: 'kontak',
       j: 'SMK Negeri 9 Medan berada di Jl. Patriot No.20 A, Lalang, Kec. Medan Sunggal, Kota Medan. Portal ini memperkenalkan sekolah, enam jurusan, guru, dan karya siswa. Ada 6 jurusan: RPL, TKJ, DKV, PSPT, Animasi, dan Social Care.' },
     { k: ['biaya','spp','uang sekolah','seragam','ekstrakurikuler','ekskul','beasiswa','kepala sekolah','akreditasi','jam masuk','jam sekolah','prestasi','osis','kuota','nilai minimal'], b: 'kontak', p: 1,
       j: 'Informasi itu belum tersedia di portal ini, dan aku tidak mau mengarang jawaban. 🙏\n\nSilakan tanyakan langsung lewat email smkn09medan@gmail.com atau datang ke sekolah di Jl. Patriot No.20 A, Medan Sunggal.' },
     { k: ['pendaftaran','ppdb','mendaftar','syarat masuk','cara masuk','cara daftar','daftar sekolah','daftar rpl'], q: 'Bagaimana cara mendaftar?', b: 'kontak',
       j: 'Informasi pendaftaran resmi belum tersedia di portal ini. Silakan hubungi sekolah lewat email smkn09medan@gmail.com atau datang langsung ke alamat sekolah.' },
     { k: ['kurikulum','mapel','mata pelajaran','pelajaran','dipelajari','belajar apa','materi','pelajari'], q: 'Apa saja mata pelajarannya?', b: 'kurikulum',
       j: 'Mata pelajaran inti RPL di portal ini:\n• Pemrograman Web\n• Basis Data\n• Pemrograman Berorientasi Objek\n• PKL\n\nDipelajari dari kelas X sampai XII.' },
     { k: ['pemrograman web','website','web','situs'], q: 'Jelaskan pemrograman web', b: 'modul',
       j: 'Pemrograman Web: membuat website dengan HTML (struktur), CSS (tampilan), dan JavaScript (interaksi).\n\nHasilnya website responsif yang nyaman dibuka di HP, tablet, maupun komputer.',
       d: 'Website terdiri dari dua sisi: frontend (yang dilihat pengunjung: HTML, CSS, JS) dan backend (server & database: PHP, Node.js, Python, dll.).' },
     { k: ['modul','media query','responsif','flexbox','grid','responsive'], q: 'Apa itu media query?', b: 'modul',
       j: 'Modul Pemrograman Web membahas:\n• HTML5: struktur semantik\n• CSS3: Flexbox (tata letak satu arah) dan Grid (tata letak baris-kolom)\n• Media Query: aturan CSS yang berubah sesuai lebar layar, misalnya @media (max-width: 600px)\n• JavaScript: interaksi halaman\n\nGabungannya membuat layout responsif untuk desktop, tablet, dan HP.' },
     { k: ['basis data','database','sql','data','dbms','query','tabel'], q: 'Jelaskan basis data',
       j: 'Basis Data: tempat menyimpan data secara terstruktur. Siswa belajar merancang dan mengelola data dengan SQL, misalnya untuk data peminjaman alat atau data ujian.\n\nContoh SQL:\nSELECT nama FROM siswa WHERE kelas = \'XII RPL\';',
       d: 'Perintah dasar SQL (CRUD):\n• INSERT: tambah data\n• SELECT: baca data\n• UPDATE: ubah data\n• DELETE: hapus data\nTabel dihubungkan dengan primary key dan foreign key.' },
     { k: ['berorientasi objek','pbo','oop','class','objek','pewarisan','inheritance','polimorfisme','enkapsulasi','abstraksi'], q: 'Jelaskan pemrograman berorientasi objek',
       j: 'Pemrograman Berorientasi Objek (PBO): menyusun program memakai class dan objek supaya kode rapi, mudah dipakai ulang, dan mudah dikembangkan.\n\nEmpat pilarnya: enkapsulasi, pewarisan (inheritance), polimorfisme, dan abstraksi.',
       d: 'Contoh: class Hewan punya method bersuara(). Class Kucing mewarisi Hewan lalu mengubah bersuara() menjadi "meong". Itu pewarisan + polimorfisme.' },
     { k: ['pkl','praktik kerja','magang','industri','dudi','prakerin'], q: 'Apa itu PKL?', b: 'pkl',
       j: 'PKL (Praktik Kerja Lapangan) melatih siswa bekerja langsung di dunia usaha dan industri.\n\nSebelum PKL, siapkan portofolio, misalnya website responsif buatanmu. Tempat PKL bisa dikonsultasikan dengan guru pembimbing jurusan.' },
     { k: ['lsp','sertifikat','sertifikasi','uji kompetensi','kompetensi','asesmen','bnsp'], q: 'Apa itu LSP?', b: 'pkl',
       j: 'LSP (Lembaga Sertifikasi Profesi) menyelenggarakan uji kompetensi. Siswa yang lulus bisa mendapat sertifikat keahlian.\n\nSiapkan portofolio web responsif sebelum jadwal asesmen.' },
     { k: ['siapkan','disiapkan','persiapan','portofolio','portfolio','perlu disiapkan'], q: 'Apa yang perlu disiapkan?', b: 'pkl',
       j: 'Yang perlu disiapkan untuk PKL dan uji kompetensi LSP:\n• Portofolio web responsif buatanmu sendiri\n• Pemahaman dasar HTML, CSS, JavaScript, dan SQL\n• Konsultasi tempat PKL dengan guru pembimbing' },
     { k: ['jadwal','praktikum','jam pelajaran'], q: 'Jadwal praktikum', b: 'jadwal',
       j: 'Contoh jadwal praktikum:\n• Senin: Pemrograman Web (Lab 1)\n• Rabu: Basis Data (Lab 2)\n• Jumat: Pemrograman Berorientasi Objek (Lab 1)\n\nCatatan: ini jadwal contoh. Jadwal resmi mengikuti informasi dari guru.' },
     { k: ['lab rpl 1','lab 1'], b: 'lab', j: 'Lab RPL 1 dipakai untuk pemrograman dan pengembangan web.' },
     { k: ['lab rpl 2','lab 2'], b: 'lab', j: 'Lab RPL 2 dipakai untuk basis data dan jaringan.' },
     { k: ['lab','laboratorium','ruang praktik','fasilitas'], q: 'Daftar lab RPL', b: 'lab',
       j: 'Ada dua lab praktik:\n• Lab RPL 1: pemrograman dan pengembangan web\n• Lab RPL 2: basis data dan jaringan' },
     { k: ['karya','proyek siswa','proyek','project','hasil siswa','berita'], q: 'Apa saja proyek siswa?', b: 'karya',
       j: 'Proyek kelas XII RPL:\n• Aplikasi Inventaris QR\n• Portal CBT Online\n• E-Katalog Produk PKK\n\nDi halaman Karya Siswa, klik salah satu kartu untuk bertanya detailnya.' },
     { k: ['inventaris','qr','peminjaman','pemindai','scanner'], b: 'karya',
       j: 'Aplikasi Inventaris QR: sistem peminjaman alat laboratorium berbasis web responsif, dilengkapi pemindai QR Code untuk mencatat peminjaman dengan cepat.' },
     { k: ['cbt','ujian online','computer based test','ujian'], b: 'karya',
       j: 'Portal CBT Online: platform ujian berbasis komputer yang adaptif, bisa dipakai di komputer lab maupun smartphone.' },
     { k: ['katalog','e-katalog','pkk','produk','etalase'], b: 'karya',
       j: 'E-Katalog Produk PKK: etalase digital untuk memamerkan karya kreatif siswa jurusan RPL.' },
     { k: ['karir','karier','kerja','bekerja','prospek','lulusan','setelah lulus','profesi','gaji','freelance'], q: 'Prospek kerja lulusan RPL?',
       j: 'Lulusan RPL bisa berkarier sebagai web developer, programmer, penguji perangkat lunak (QA), UI/UX designer, admin database, atau melanjutkan kuliah di bidang informatika. Bisa juga freelance. Portofolio proyek sangat membantu.' },
     { k: ['promo','pengumuman','info lab'], b: 'pkl',
       j: 'Info terbaru ada di panel Info & Promo Lab: Uji Kompetensi LSP dan Pendaftaran PKL. Rinciannya ada di halaman Info PKL & LSP.' },

     /* ---------- JURUSAN & GURU ---------- */
     { k: ['jurusan apa saja','daftar jurusan','semua jurusan','jurusan lain','kompetensi keahlian','ada jurusan'], p: 2, q: 'Jurusan apa saja yang ada?', b: 'jurusan',
       j: 'Ada 6 jurusan di SMKN 9 Medan:\n• Rekayasa Perangkat Lunak (RPL)\n• Teknik Komputer dan Jaringan (TKJ)\n• Desain Komunikasi Visual (DKV)\n• Produksi dan Siaran Program Televisi (PSPT)\n• Animasi\n• Pekerja Sosial (Social Care)',
       s: ['Jelaskan jurusan TKJ', 'Jelaskan jurusan DKV', 'Siapa saja guru jurusan?'] },
     { k: ['jurusan'], pendek: true, p: 0, b: 'jurusan', q: 'Jurusan apa saja yang ada?', j: 'Ada 6 jurusan: RPL, TKJ, DKV, PSPT, Animasi, dan Social Care. Mau tahu yang mana?', s: ['Jelaskan jurusan TKJ', 'Jelaskan jurusan DKV', 'Siapa saja guru jurusan?'] },
     { k: ['tkj','teknik komputer dan jaringan','teknik jaringan komputer','jaringan komputer jurusan'], q: 'Jelaskan jurusan TKJ', b: 'jurusan', p: 1,
       j: 'TKJ (Teknik Komputer dan Jaringan): perakitan komputer, jaringan, dan server.\nMapel: Komputer dan Jaringan Dasar, Teknologi Jaringan Kabel & Nirkabel, Administrasi Infrastruktur Jaringan, Administrasi Sistem Jaringan, dan PKL.\nGuru jurusan: Pak Khoir.' },
     { k: ['dkv','desain komunikasi visual'], q: 'Jelaskan jurusan DKV', b: 'jurusan', p: 1,
       j: 'DKV (Desain Komunikasi Visual): desain grafis, ilustrasi, dan branding.\nMapel: Desain Grafis, Tipografi, Ilustrasi Digital, Fotografi, dan PKL.\nGuru jurusan: Pak Imanuel.' },
     { k: ['pspt','produksi dan siaran program televisi','produksi siaran','televisi','broadcasting'], q: 'Jelaskan jurusan PSPT', b: 'jurusan', p: 1,
       j: 'PSPT (Produksi dan Siaran Program Televisi): produksi video, kamera, dan penyiaran TV.\nMapel: Dasar Produksi Program TV, Teknik Kamera, Editing Video, Penulisan Naskah, dan PKL.\nGuru jurusan: Bu Sofi.' },
     { k: ['animasi','jurusan animasi','motion graphic'], q: 'Jelaskan jurusan Animasi', b: 'jurusan', p: 1,
       j: 'Animasi: animasi 2D, 3D, dan motion graphic.\nMapel: Gambar Sketsa, Storyboard, Animasi 2D, Animasi 3D, dan PKL.\nGuru jurusan: Pak Dede.' },
     { k: ['social care','pekerja sosial','layanan sosial','perawatan lansia','pengasuhan anak'], q: 'Jelaskan jurusan Social Care', b: 'jurusan', p: 1,
       j: 'Social Care (Pekerja Sosial): pelayanan dan pendampingan sosial.\nMapel: Dasar Layanan Sosial, Komunikasi & Pendampingan, Perawatan Lansia, Pengasuhan Anak, dan PKL.\nGuru jurusan: Bu Sofa.' },
     { k: ['guru','tenaga pendidik','pengajar','pembimbing','semua guru','daftar guru'], p: 1, q: 'Siapa saja guru jurusan?', b: 'guru',
       j: 'Guru jurusan:\n• Pak Ardiansyah: RPL\n• Pak Khoir: TKJ\n• Pak Imanuel: DKV\n• Bu Sofi: PSPT\n• Pak Dede: Animasi\n• Bu Sofa: Social Care' },
     { k: ['ardiansyah','guru rpl','guru jurusan rpl'], b: 'guru', p: 3, j: 'Pak Ardiansyah adalah guru Jurusan RPL (Rekayasa Perangkat Lunak).' },
     { k: ['khoir','guru tkj','guru jurusan tkj'], b: 'guru', p: 3, j: 'Pak Khoir adalah guru Jurusan TKJ (Teknik Komputer dan Jaringan).' },
     { k: ['imanuel','guru dkv','guru jurusan dkv'], b: 'guru', p: 3, j: 'Pak Imanuel adalah guru Jurusan DKV (Desain Komunikasi Visual).' },
     { k: ['sofi','guru pspt','guru jurusan pspt'], b: 'guru', p: 3, j: 'Bu Sofi adalah guru Jurusan PSPT (Produksi dan Siaran Program Televisi).' },
     { k: ['dede','guru animasi','guru jurusan animasi'], b: 'guru', p: 3, j: 'Pak Dede adalah guru Jurusan Animasi.' },
     { k: ['sofa','guru social care','guru jurusan social care','guru pekerja sosial'], b: 'guru', p: 3, j: 'Bu Sofa adalah guru Jurusan Social Care (Pekerja Sosial).' },

     /* ---------- PENGETAHUAN PEMROGRAMAN & IT ---------- */
     { k: ['html','html5','tag','semantik'], q: 'Apa itu HTML?',
       j: 'HTML (HyperText Markup Language) adalah kerangka halaman web. Contoh:\n<h1>Judul</h1>\n<p>Paragraf</p>\n<a href="#">Link</a>\n\nHTML5 menambah tag semantik seperti <header>, <nav>, <main>, <footer>.' },
     { k: ['css','stylesheet','warna','font','selector'], q: 'Apa itu CSS?',
       j: 'CSS (Cascading Style Sheets) mengatur tampilan HTML: warna, font, jarak, dan tata letak. Contoh:\nh1 { color: blue; font-size: 2rem; }\n\nPengatur tata letak modern: Flexbox dan Grid.' },
     { k: ['javascript','js','dom','event'], q: 'Jelaskan JavaScript',
       j: 'JavaScript membuat halaman web interaktif: menu, validasi form, animasi, chat, dan lain-lain. Contoh:\ndocument.querySelector("button").onclick = () => alert("Halo!");\n\nSekarang JS juga dipakai di server (Node.js).',
       d: 'Konsep dasar JS: variabel (let/const), fungsi, array, objek, kondisi (if), perulangan (for), dan event listener untuk merespons klik.' },
     { k: ['php','laravel','codeigniter'], j: 'PHP adalah bahasa untuk sisi server (backend) yang banyak dipakai membuat web dinamis dan terhubung ke MySQL. Framework populernya: Laravel dan CodeIgniter.' },
     { k: ['mysql','xampp','phpmyadmin','mariadb','laragon'], j: 'MySQL adalah sistem database populer. XAMPP/Laragon adalah paket yang memasang server lokal (Apache + PHP + MySQL) di komputermu, dan phpMyAdmin dipakai untuk mengelola database lewat browser.' },
     { k: ['python','django','flask'], j: 'Python adalah bahasa yang sintaksnya ringkas dan mudah dipelajari, dipakai untuk web (Django, Flask), data, otomasi, dan AI.\n\nContoh: print("Halo RPL")' },
     { k: ['java','kotlin','android','flutter','aplikasi mobile','mobile'], j: 'Aplikasi Android biasanya dibuat dengan Kotlin atau Java di Android Studio. Alternatif lintas platform: Flutter (Dart) atau React Native (JavaScript).' },
     { k: ['c++','cpp','bahasa c','pascal'], j: 'C/C++ adalah bahasa yang dekat dengan perangkat keras, cepat, dan sering dipakai untuk belajar logika, game, dan sistem. Cocok untuk melatih dasar algoritma.' },
     { k: ['bahasa pemrograman','mulai dari mana','belajar coding','belajar programming','coding','pemula'], q: 'Mulai belajar coding dari mana?',
       j: 'Saran urutan untuk pemula:\n1. Logika & algoritma dasar\n2. HTML → CSS → JavaScript\n3. Database (SQL)\n4. Satu bahasa backend (PHP atau Python)\n5. Git & GitHub\n6. Bangun proyek kecil dan simpan di portofolio\n\nKonsisten latihan lebih penting daripada banyak teori.' },
     { k: ['git','github','gitlab','commit','repository','repo','branch','version control'], j: 'Git adalah alat pencatat versi kode. GitHub adalah tempat menyimpan repository di internet.\n\nPerintah dasar:\ngit init\ngit add .\ngit commit -m "pesan"\ngit push' },
     { k: ['framework','library','bootstrap','tailwind','react','vue','angular','node','nodejs','jquery'], j: 'Framework/library mempercepat pekerjaan:\n• CSS: Bootstrap, Tailwind\n• JavaScript: React, Vue, Angular\n• Backend: Laravel, Express (Node.js), Django\n\nKuasai dasar HTML, CSS, dan JS dulu sebelum memakainya.' },
     { k: ['api','json','rest','http','https','request','endpoint','fetch'], j: 'API adalah jembatan agar dua program saling bertukar data, biasanya memakai HTTP dan format JSON. Contoh JSON:\n{"nama":"Budi","kelas":"XII RPL"}\n\nDi JavaScript, data diambil dengan fetch().' },
     { k: ['algoritma','flowchart','pseudocode','logika'], j: 'Algoritma adalah langkah-langkah terurut untuk menyelesaikan masalah. Biasanya digambar dengan flowchart atau ditulis sebagai pseudocode sebelum dibuat kodenya.' },
     { k: ['variabel','tipe data','integer','string','boolean','konstanta'], j: 'Variabel adalah wadah untuk menyimpan data. Tipe data umum: integer (bilangan bulat), float (desimal), string (teks), boolean (true/false).\n\nContoh JS: let umur = 16;' },
     { k: ['perulangan','loop','for','while','percabangan','if else','kondisi'], j: 'Percabangan (if/else) memilih aksi berdasarkan kondisi, sedangkan perulangan (for/while) mengulang aksi.\n\nfor (let i = 1; i <= 3; i++) { console.log(i); }' },
     { k: ['fungsi','function','array','larik','method','prosedur'], j: 'Fungsi adalah blok kode yang bisa dipanggil berulang kali. Array adalah kumpulan data berurutan.\n\nfunction tambah(a, b) { return a + b; }\nlet buah = ["apel", "jeruk"];' },
     { k: ['bug','debug','debugging','error','eror','salah kode','tidak jalan','gagal'], j: 'Tips debugging:\n• Baca pesan error dengan teliti (baris dan jenis errornya)\n• Buka Console browser (F12)\n• Cek tanda kurung, titik koma, dan huruf besar/kecil\n• Uji bagian kecil satu per satu\n• Gunakan console.log() untuk melihat nilai variabel' },
     { k: ['frontend','front end','backend','back end','fullstack','full stack'], j: 'Frontend: bagian yang dilihat pengguna (HTML, CSS, JS). Backend: sisi server dan database (PHP, Node.js, Python, SQL). Fullstack: menguasai keduanya.' },
     { k: ['uiux','ui ux','ui','ux','figma','desain','canva','wireframe','mockup'], j: 'UI (User Interface) adalah tampilan, UX (User Experience) adalah kenyamanan pemakaian. Tool populer: Figma. Mulai dari wireframe sketsa sederhana, lalu mockup berwarna, baru dikodekan.' },
     { k: ['seo','hosting','domain','server','deploy','online kan','publish'], j: 'Agar website bisa dibuka orang lain: pakai domain, sewa hosting (atau hosting gratis seperti GitHub Pages/Netlify), lalu unggah filenya. SEO adalah teknik agar website mudah ditemukan di Google (judul jelas, konten bagus, cepat, responsif).' },
     { k: ['keamanan','hacker','hack','xss','sql injection','password','enkripsi','cyber','siber','virus'], j: 'Dasar keamanan web:\n• Validasi semua input pengguna\n• Gunakan prepared statement (cegah SQL injection)\n• Hindari menampilkan input mentah (cegah XSS)\n• Simpan password dengan hash (bcrypt), bukan teks biasa\n• Pakai HTTPS' },
     { k: ['jaringan','network','ip address','router','lan','wifi','dns','tcp','subnet','mikrotik','cisco','switch'], j: 'Jaringan komputer menghubungkan perangkat agar bertukar data. Istilah dasar: IP address (alamat perangkat), router (penghubung jaringan), switch (penghubung dalam LAN), DNS (penerjemah nama domain ke IP).' },
     { k: ['linux','ubuntu','windows','sistem operasi','terminal','cmd','os'], j: 'Sistem operasi mengatur perangkat keras dan aplikasi (Windows, Linux, macOS). Server banyak memakai Linux, misalnya Ubuntu. Perintah dasar terminal: ls (lihat file), cd (pindah folder), mkdir (buat folder).' },
     { k: ['vscode','vs code','visual studio code','editor','text editor','notepad','tools','aplikasi coding'], j: 'Tools yang umum dipakai: Visual Studio Code (editor), browser + DevTools (F12), XAMPP/Laragon (server lokal), Git/GitHub, Figma (desain), dan Postman (uji API).' },
     { k: ['erd','normalisasi','primary key','foreign key','relasi','uml','use case','sdlc','agile','scrum','waterfall'], j: 'Perancangan perangkat lunak: ERD menggambar relasi antar tabel database, normalisasi merapikan tabel agar tidak ada data berulang, UML/use case menggambarkan fungsi sistem, dan SDLC (Waterfall/Agile) adalah tahapan pengembangan: analisis, desain, koding, uji, rilis.' },
     { k: ['testing','uji coba','qa','tester','quality assurance'], j: 'Testing memastikan aplikasi bekerja sesuai harapan. Jenisnya antara lain unit test, integration test, dan UAT (uji oleh pengguna). Profesinya disebut QA/Tester.' },
     { k: ['ai','kecerdasan buatan','machine learning','chatgpt','artificial intelligence','data science'], j: 'AI (kecerdasan buatan) adalah sistem yang meniru kemampuan manusia seperti memahami bahasa atau mengenali gambar. Machine learning melatih komputer dari data. Aku sendiri hanya chatbot berbasis aturan, bukan AI penuh 😊' },
     { k: ['game','unity','godot','game developer','bikin game'], j: 'Game dasar bisa dibuat dengan Unity (C#), Godot (GDScript), atau JavaScript + canvas. Mulailah dari game sederhana seperti tebak angka atau Snake.' },
     { k: ['komputer','cpu','ram','storage','ssd','hardware','laptop','spesifikasi','biner','binary','bit','byte'], j: 'CPU adalah otak komputer, RAM memori sementara yang cepat, SSD/HDD penyimpanan permanen. Komputer bekerja dengan biner (0 dan 1); 8 bit = 1 byte. Untuk belajar coding, laptop RAM 8 GB sudah nyaman.' },
     { k: ['tips belajar','cara belajar','belajar efektif','sulit','susah','tidak paham','bingung'], j: 'Tips belajar coding:\n• Praktik langsung, jangan hanya membaca\n• Pecah masalah jadi bagian kecil\n• Bangun proyek mini (to-do list, kalkulator)\n• Baca dokumentasi & tanya teman/guru\n• Latihan sedikit tapi tiap hari' },
     { k: ['kalkulator','todo','to do','contoh proyek','ide proyek','ide project'], j: 'Ide proyek untuk portofolio:\n• To-do list\n• Kalkulator\n• Website profil sekolah/kelas\n• Aplikasi catatan\n• Katalog produk\n• Absensi sederhana dengan database' }
   ];
   // prospek karier tiap jurusan (dibuat otomatis dari data JURUSAN)
   JURUSAN.forEach(function (j) {
     const x = j.kode.toLowerCase();
     BASIS.push({ k: ['karier ' + x, 'kerja ' + x, 'prospek ' + x, 'lulusan ' + x, 'karir ' + x], p: 2, b: 'jurusan',
       j: 'Prospek karier lulusan ' + j.kode + ': ' + j.karier.join(', ') + '. Bisa juga melanjutkan kuliah atau berwirausaha.' });
   });

   // Penjelasan tiap halaman (dipakai saat pengunjung bertanya "jelaskan halaman ini")
   const INFO_HALAMAN = {
     beranda: 'Ini Beranda SMK Negeri 9 Medan: ringkasan sekolah, enam jurusan, menu cepat, sorotan Jurusan RPL, dan info promo.',
     jurusan: 'Halaman Jurusan menampilkan 6 kompetensi keahlian di SMKN 9 Medan beserta mata pelajaran tiap jurusan. Klik kartu untuk bertanya.',
     guru: 'Halaman Guru menampilkan guru pembimbing tiap jurusan: Pak Ardiansyah (RPL), Pak Khoir (TKJ), Pak Imanuel (DKV), Bu Sofi (PSPT), Pak Dede (Animasi), Bu Sofa (Social Care).',
     kurikulum: 'Halaman Kurikulum berisi empat mata pelajaran inti RPL: Pemrograman Web, Basis Data, Pemrograman Berorientasi Objek, dan PKL.',
     karya: 'Halaman Karya Siswa menampilkan tiga proyek kelas XII RPL. Klik salah satu kartu untuk menanyakan detailnya.',
     kontak: 'Halaman Kontak berisi alamat sekolah, email, dan tombol untuk membuka lokasi di Google Maps.',
     jadwal: 'Halaman Jadwal Praktikum berisi tabel contoh jadwal pemakaian lab: hari, mata pelajaran, dan lab yang dipakai.',
     modul: 'Halaman Modul membahas materi pemrograman web: HTML5, CSS3 (Flexbox dan Grid), Media Query, dan JavaScript.',
     lab: 'Halaman Daftar Lab menjelaskan dua lab praktik: Lab RPL 1 (web) dan Lab RPL 2 (basis data dan jaringan).',
     pkl: 'Halaman Info PKL & LSP menjelaskan praktik kerja lapangan dan uji kompetensi, serta persiapan yang perlu dilakukan.'
   };
   
   // Pertanyaan saran (chip) untuk tiap halaman
   const CHIPS = {
     beranda: ['Jurusan apa saja yang ada?', 'Siapa saja guru jurusan?', 'Di mana alamat sekolah?', 'Apa itu jurusan RPL?'],
     jurusan: ['Jurusan apa saja yang ada?', 'Jelaskan jurusan TKJ', 'Jelaskan jurusan Animasi', 'Siapa saja guru jurusan?'],
     guru: ['Siapa saja guru jurusan?', 'Siapa guru jurusan RPL?', 'Siapa guru jurusan TKJ?'],
     kurikulum: ['Apa saja mata pelajarannya?', 'Apa itu PKL?', 'Jelaskan basis data', 'Jelaskan pemrograman web'],
     karya: ['Apa saja proyek siswa?', 'Jelaskan aplikasi inventaris QR', 'Jelaskan portal CBT online', 'Jelaskan e-katalog produk PKK'],
     kontak: ['Berapa email sekolah?', 'Di mana alamat sekolah?', 'Bisa tanya soal pendaftaran?'],
     jadwal: ['Jadwal praktikum minggu ini?', 'Lab mana yang dipakai?', 'Apa saja mata pelajarannya?'],
     modul: ['Apa itu media query?', 'Apa itu Flexbox dan Grid?', 'Jelaskan JavaScript'],
     lab: ['Jelaskan Lab RPL 1', 'Jelaskan Lab RPL 2', 'Jadwal praktikum'],
     pkl: ['Apa itu PKL?', 'Apa itu LSP?', 'Apa yang perlu disiapkan?']
   };
   
   // ---------- 2. ELEMEN CHAT ----------
   const chatFab = document.getElementById('chat-fab');
   const chatBadge = document.getElementById('chat-badge');
   const chatBox = document.getElementById('chat-box');
   const chatClose = document.getElementById('chat-close');
   const chatBody = document.getElementById('chat-body');
   const chatChips = document.getElementById('chat-chips');
   const chatForm = document.getElementById('chat-form');
   const chatInput = document.getElementById('chat-input');
   const chatKonteks = document.getElementById('chat-konteks');
   
   let sudahSapa = false;
   
   function chatTerbuka() {
     return chatBox.classList.contains('buka');
   }
   
   function bukaChat() {
     chatBox.classList.add('buka');
     chatBadge.style.display = 'none';
     if (!sudahSapa) {
       sudahSapa = true;
       sapaAwal();
     }
     perbaruiKonteks();
     if (window.innerWidth > 600) {
       setTimeout(function () { chatInput.focus(); }, 150);
     }
   }
   
   function tutupChat() {
     chatBox.classList.remove('buka');
   }
   
   chatFab.addEventListener('click', function () {
     if (chatTerbuka()) { tutupChat(); } else { bukaChat(); }
   });
   chatClose.addEventListener('click', tutupChat);
   document.addEventListener('keydown', function (e) {
     if (e.key === 'Escape') tutupChat();
   });
   
   // ---------- 3. TAMPILAN PESAN ----------
   function tambahPesan(teks, dari, buka) {
     const el = document.createElement('div');
     el.className = 'pesan ' + dari;
     el.textContent = teks;
   
     if (buka && NAMA[buka] && buka !== halamanAktif) {
       const b = document.createElement('button');
       b.type = 'button';
       b.className = 'buka-btn';
       b.textContent = 'Buka halaman ' + NAMA[buka] + ' →';
       b.addEventListener('click', function () {
         tampil(buka);
         if (window.innerWidth <= 600) tutupChat();
       });
       el.appendChild(b);
     }
   
     chatBody.appendChild(el);
     chatBody.scrollTop = chatBody.scrollHeight;
   }
   
   function tampilkanKetik() {
     const el = document.createElement('div');
     el.className = 'pesan bot ketik';
     el.innerHTML = '<i></i><i></i><i></i>';
     chatBody.appendChild(el);
     chatBody.scrollTop = chatBody.scrollHeight;
     return el;
   }
   
   function renderChips(daftar) {
     chatChips.innerHTML = '';
     (daftar || CHIPS[halamanAktif] || []).forEach(function (teks) {
       const b = document.createElement('button');
       b.type = 'button';
       b.textContent = teks;
       b.addEventListener('click', function () { kirimPesan(teks); });
       chatChips.appendChild(b);
     });
     chatChips.scrollLeft = 0;
   }
   
   function perbaruiKonteks() {
     chatKonteks.textContent = 'Sedang di: ' + NAMA[halamanAktif];
     if (chatTerbuka()) renderChips();
   }
   
   function sapaAwal() {
     const jam = new Date().getHours();
     const salam = jam < 11 ? 'Selamat pagi' : jam < 15 ? 'Selamat siang' : jam < 18 ? 'Selamat sore' : 'Selamat malam';
     tambahPesan(
       salam + '! 👋 Aku asisten virtual SMK Negeri 9 Medan.\n\nTanya apa saja soal sekolah, jurusan, guru, atau pemrograman. Kamu juga bisa mengetik "buka guru" atau "mode gelap".',
       'bot'
     );
     renderChips();
   }
   
   // ---------- 4. OTAK CHATBOT ----------
   let namaUser = '';
   let itemTerakhir = null;
   const SLANG = { gak:'tidak', ga:'tidak', nggak:'tidak', ngga:'tidak', tdk:'tidak', yg:'yang', dgn:'dengan', dg:'dengan', utk:'untuk',
     krn:'karena', bgmn:'bagaimana', gmn:'bagaimana', gimana:'bagaimana', knp:'mengapa', kenapa:'mengapa', brp:'berapa', sy:'saya', aq:'aku',
     pake:'pakai', pke:'pakai', bikin:'buat', udh:'sudah', udah:'sudah', sdh:'sudah', lg:'lagi', bs:'bisa', kmu:'kamu', km:'kamu', tp:'tapi',
     jg:'juga', dmn:'dimana', dimana:'di mana', ngoding:'coding', ngecoding:'coding', trims:'terima kasih', mksh:'makasih' };

   function norm(t) {
     const s = t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
     return s.split(' ').map(function (w) { return SLANG[w] || w; }).join(' ').replace(/\s+/g, ' ').trim();
   }
   function lev(a, b) {
     const m = a.length, n = b.length;
     let prev = [], cur = [], i, j;
     for (j = 0; j <= n; j++) prev[j] = j;
     for (i = 1; i <= m; i++) {
       cur = [i];
       for (j = 1; j <= n; j++) {
         cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
       }
       prev = cur;
     }
     return prev[n];
   }
   function cocokKata(kw, t) {
     if (kw === t) return 2;
     if (kw.length >= 6 && t.indexOf(kw) !== -1) return 1.6;                 // imbuhan: "dipelajari" ~ "pelajar"
     if (kw.length >= 5 && Math.abs(kw.length - t.length) <= 2 &&
         lev(kw, t) <= (kw.length >= 9 ? 2 : 1)) return 1.4;                  // salah ketik
     return 0;
   }
   // siapkan kata kunci sekali saja
   BASIS.forEach(function (item) {
     item._k = item.k.map(function (x) { const t = norm(x); return { t: t, w: t.split(' ') }; });
   });

   function skorItem(item, q, toks) {
     if (item.pendek && toks.length > 4) return 0;
     let s = 0;
     const padded = ' ' + q + ' ';
     item._k.forEach(function (kw) {
       if (kw.w.length === 1) {
         let best = 0;
         toks.forEach(function (t) { best = Math.max(best, cocokKata(kw.w[0], t)); });
         s += best;
       } else if (padded.indexOf(' ' + kw.t + ' ') !== -1) {
         s += 3 * kw.w.length;
       } else if (kw.w.every(function (w) { return toks.some(function (t) { return cocokKata(w, t) >= 1.6; }); })) {
         s += 1.5 * kw.w.length;
       }
     });
     return s;
   }

   // kalkulator sederhana (hanya angka dan operator, aman)
   function hitung(teks) {
     let e = ' ' + teks.toLowerCase() + ' ';
     e = e.replace(/\s(ditambah|tambah|plus)\s/g, ' + ').replace(/\s(dikurang|kurang|minus)\s/g, ' - ')
          .replace(/\s(dikali|kali)\s/g, ' * ').replace(/\s(dibagi|bagi)\s/g, ' / ')
          .replace(/(\d)\s*[x×]\s*(\d)/g, '$1*$2').replace(/(\d)\s*:\s*(\d)/g, '$1/$2').replace(/\^/g, '**');
     const m = e.match(/[\d(][\d\s.,+\-*/()%]*[\d)]/);
     if (!m || !/\d\s*(\*\*|[+\-*/%])\s*[\d(]/.test(m[0])) return null;
     const ekspresi = m[0].replace(/,/g, '.').replace(/(\d)\s+(\d)/g, '$1$2');
     if (!/^[\d\s.+\-*/()%]+$/.test(ekspresi.replace(/\*\*/g, '*'))) return null;
     try {
       const h = Function('"use strict";return (' + ekspresi + ')')();
       if (typeof h !== 'number' || !isFinite(h)) return 'Hasilnya tidak terdefinisi 😅';
       return m[0].trim() + ' = ' + (Math.round(h * 1e8) / 1e8).toLocaleString('id-ID');
     } catch (err) { return null; }
   }

   function jawab(teks) {
     const q = norm(teks);
     const toks = q.split(' ');

     // perintah: buka halaman
     const PETA = { beranda: 'beranda', home: 'beranda', jurusan: 'jurusan', guru: 'guru', kurikulum: 'kurikulum', karya: 'karya', proyek: 'karya', kontak: 'kontak',
       jadwal: 'jadwal', modul: 'modul', lab: 'lab', pkl: 'pkl', lsp: 'pkl' };
     const nav = q.match(/^(?:tolong )?(?:buka|bukakan|tampilkan|lihat|pergi ke|menuju) (?:halaman |menu )?([a-z ]+)$/);
     if (nav) {
       const kata = nav[1].split(' ');
       for (let i = 0; i < kata.length; i++) {
         if (PETA[kata[i]]) {
           tampil(PETA[kata[i]]);
           if (window.innerWidth <= 600) tutupChat();
           return { j: 'Siap, membuka halaman ' + NAMA[PETA[kata[i]]] + ' ✅' };
         }
       }
     }
     // perintah: tema
     if (/(mode|tema) (gelap|malam|dark)|gelapkan/.test(q)) { setTema('gelap'); return { j: 'Mode gelap diaktifkan 🌙' }; }
     if (/(mode|tema) (terang|siang|light)/.test(q)) { setTema('terang'); return { j: 'Mode terang diaktifkan ☀️' }; }

     // pertanyaan tentang halaman yang sedang dibuka
     if (/(halaman|bagian) ini|jelaskan ini|apa ini|ini apa/.test(q)) {
       return { j: INFO_HALAMAN[halamanAktif] };
     }

     // perkenalan nama
     const nm = q.match(/(?:nama saya|namaku|nama aku|panggil saya|panggil aku)\s+([a-z]+)/);
     if (nm && nm[1] !== 'siapa') {
       namaUser = nm[1].charAt(0).toUpperCase() + nm[1].slice(1);
       return { j: 'Senang berkenalan, ' + namaUser + '! 😊 Ada yang ingin kamu tanyakan?' };
     }
     if (/siapa (nama saya|namaku|aku)/.test(q)) {
       return { j: namaUser ? 'Kamu ' + namaUser + '! 😄' : 'Aku belum tahu namamu. Ketik "namaku Budi" untuk berkenalan.' };
     }

     // hitung-hitungan
     const hit = hitung(teks);
     if (hit) return { j: '🧮 ' + hit };

     // minta penjelasan lanjutan
     if (/^(lagi|lanjut|lanjutkan|detail|selengkapnya|contoh|contohnya|lebih detail|lebih lengkap|jelaskan lebih)/.test(q) && itemTerakhir) {
       return { j: itemTerakhir.d || 'Itu sudah ringkasan lengkapnya. Coba tanya hal spesifik, misalnya contoh kodenya atau bagian lain yang ingin kamu ketahui.' };
     }

     const hasil = [];
     BASIS.forEach(function (item, i) {
       const s = skorItem(item, q, toks);
       if (s > 0) hasil.push({ item: item, s: s, i: i });
     });
     hasil.sort(function (a, b) { return (b.s - a.s) || ((b.item.p || 0) - (a.item.p || 0)) || (a.i - b.i); });

     if (hasil.length && hasil[0].s >= 1.4) {
       const t = hasil[0].item;
       itemTerakhir = t;
       let j = typeof t.j === 'function' ? t.j() : t.j;
       let s = t.s;
       if (!s) {
         s = hasil.slice(1, 4).filter(function (h) { return h.item.q && h.s >= 1.4; })
                  .map(function (h) { return h.item.q; }).slice(0, 3);
         if (t.d) s.unshift('Lanjut, jelaskan lebih detail');
         if (!s.length) s = undefined;
       }
       return { j: j, b: t.b, s: s };
     }

     // tidak ketemu: beri saran terdekat
     const saran = hasil.filter(function (h) { return h.item.q; }).slice(0, 3).map(function (h) { return h.item.q; });
     return {
       j: 'Maaf, aku belum punya jawaban pasti untuk itu 😅\n\nCoba tanya soal: jurusan RPL, kurikulum, jadwal, lab, PKL & LSP, karya siswa, kontak sekolah, atau pemrograman (HTML, CSS, JS, SQL, Git, dll.).\n\nUntuk hal yang belum ada di portal, kirim email ke smkn09medan@gmail.com.',
       s: saran.length ? saran : ['Apa itu jurusan RPL?', 'Apa itu HTML?', 'Kamu bisa apa?']
     };
   }

   function kirimPesan(teks) {
     teks = teks.trim();
     if (!teks) return;
   
     tambahPesan(teks, 'user');
     const ketik = tampilkanKetik();
   
     setTimeout(function () {
       ketik.remove();
       const hasil = jawab(teks);
       tambahPesan(hasil.j, 'bot', hasil.b);
       renderChips(hasil.s);
     }, 450 + Math.random() * 400);
   }
   
   chatForm.addEventListener('submit', function (e) {
     e.preventDefault();
     const teks = chatInput.value;
     chatInput.value = '';
     kirimPesan(teks);
   });
   
   // ---------- RENDER JURUSAN & GURU ----------
   const gridBeranda = document.getElementById('grid-beranda');
   const gridJurusan = document.getElementById('grid-jurusan');
   const detailJ = document.getElementById('detail-jurusan');

   function pilihJurusan(id, gulir) {
     const j = JURUSAN.filter(function (x) { return x.id === id; })[0];
     if (!j) return;
     detailJ.style.setProperty('--c', j.c);
     detailJ.innerHTML =
       '<h3>' + j.nama + ' (' + j.kode + ')</h3><p class="penjelasan">' + j.desk + '</p>' +
       '<h5>Mata pelajaran</h5><div class="chips">' + j.mapel.map(function (m) { return '<span>' + m + '</span>'; }).join('') + '</div>' +
       '<h5>Prospek karier</h5><div class="chips">' + j.karier.map(function (m) { return '<span>' + m + '</span>'; }).join('') + '</div>' +
       '<h5>Guru pembimbing</h5><div class="detail-guru"><div class="avatar" style="--c:' + j.c + '">' + j.guru.split(' ')[1][0] + '</div><b>' + j.guru + '</b></div>' +
       '<p style="margin-top:14px"><button type="button" class="tombol" id="d-tanya">💬 Tanya asisten</button><button type="button" class="tombol ghost-d" id="d-guru">Lihat guru</button></p>';
     document.getElementById('d-tanya').onclick = function () { bukaChat(); kirimPesan(j.q); };
     document.getElementById('d-guru').onclick = function () { tampil('guru'); };
     Array.prototype.forEach.call(gridJurusan.children, function (el) { el.classList.toggle('pilih', el.getAttribute('data-id') === id); });
     if (gulir) detailJ.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
   }

   function buatKartu(j, aksi) {
     const d = document.createElement('div');
     d.className = 'jurusan-card';
     d.setAttribute('data-id', j.id);
     d.style.setProperty('--c', j.c);
     d.innerHTML = '<img src="' + j.logo + '" alt="Logo ' + j.judul + '"><h4>' + j.judul + '</h4><p>' + j.desk + '</p>';
     d.addEventListener('click', aksi);
     return d;
   }

   JURUSAN.forEach(function (j) {
     gridBeranda.appendChild(buatKartu(j, function () { tampil('jurusan'); pilihJurusan(j.id, false); }));
     gridJurusan.appendChild(buatKartu(j, function () { pilihJurusan(j.id, true); }));
     const m = document.createElement('div');
     m.className = 'mapel-card';
     m.style.setProperty('--c', j.c);
     m.innerHTML = '<h4>' + j.nama + '</h4><ul>' + j.mapel.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
     document.getElementById('grid-mapel').appendChild(m);
     const g = document.createElement('div');
     g.className = 'guru-card';
     g.style.setProperty('--c', j.c);
     g.setAttribute('data-tanya', 'Siapa guru jurusan ' + j.kode + '?');
     g.innerHTML = '<div class="avatar">' + j.guru.split(' ')[1][0] + '</div><h4>' + j.guru + '</h4><p>Guru Jurusan ' + j.kode + '</p><span class="badge">' + j.nama + '</span>';
     document.getElementById('grid-guru').appendChild(g);
   });
   pilihJurusan('rpl', false);

   // hapus riwayat chat
   document.getElementById('chat-clear').addEventListener('click', function () {
     chatBody.innerHTML = '';
     itemTerakhir = null;
     sapaAwal();
   });

   // ---------- 5. TANYA DARI SETIAP BAGIAN WEB ----------
   // tombol "Tanya asisten" di bawah tiap halaman
   halaman.forEach(function (h) {
     const b = document.createElement('button');
     b.type = 'button';
     b.className = 'tanya-btn';
     b.textContent = '💬 Tanya asisten tentang halaman ini';
     b.addEventListener('click', function () {
       bukaChat();
       kirimPesan('Jelaskan halaman ini');
     });
     h.appendChild(b);
   });
   
   // kartu / materi yang bisa diklik (atribut data-tanya)
   document.querySelectorAll('[data-tanya]').forEach(function (el) {
     el.setAttribute('title', 'Klik untuk bertanya ke asisten');
     el.addEventListener('click', function () {
       bukaChat();
       kirimPesan(el.getAttribute('data-tanya'));
     });
   });
   
   } catch (err) { console.error('Chatbot error:', err); }

   // ---------- EFEK TAMPILAN ----------
   // munculkan elemen pelan-pelan saat discroll (aman: jika gagal, elemen tetap terlihat)
   let io = null;
   if ('IntersectionObserver' in window) {
     io = new IntersectionObserver(function (es) {
       es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); } });
     }, { threshold: 0.08 });
   }
   function revealBaru() {
     if (!io) return;
     document.querySelectorAll('.halaman.aktif .jurusan-card, .halaman.aktif .guru-card, .halaman.aktif .mapel-card, .halaman.aktif .quick, .halaman.aktif .fitur-item, .halaman.aktif .card, .halaman.aktif .promo-box, .halaman.aktif .sorotan')
       .forEach(function (el) {
         if (!el.classList.contains('rv')) { el.classList.add('rv'); io.observe(el); }
       });
   }
   // angka statistik berhitung naik
   document.querySelectorAll('[data-n]').forEach(function (el) {
     const n = +el.getAttribute('data-n'); let i = 0;
     const t = setInterval(function () { i++; el.textContent = i; if (i >= n) clearInterval(t); }, 140);
   });
   // tombol kembali ke atas
   const keAtas = document.getElementById('ke-atas');
   if (keAtas) {
     window.addEventListener('scroll', function () { keAtas.classList.toggle('tampil', window.scrollY > 400); });
     keAtas.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
   }
   window.addEventListener('load', revealBaru);

   tampil('beranda');

   // ===== TEMA BALAPAN: bar kecepatan scroll + lampu start =====
   (function () {
     const bar = document.getElementById('speedbar');
     function laju() {
       const h = document.documentElement, m = h.scrollHeight - h.clientHeight;
       if (bar) bar.style.width = (m > 0 ? Math.min(100, window.scrollY / m * 100) : 0) + '%';
     }
     window.addEventListener('scroll', laju, { passive: true });
     window.addEventListener('resize', laju);
     laju();
     const s = document.getElementById('start-lights');
     if (!s) return;
     let sudah = false;
     try { sudah = sessionStorage.getItem('lampu') === '1'; } catch (e) {}
     if (sudah) { s.remove(); return; }
     try { sessionStorage.setItem('lampu', '1'); } catch (e) {}
     const lampu = s.querySelectorAll('.lampu');
     let i = 0, t;
     function tutup() { clearInterval(t); s.classList.add('selesai'); setTimeout(function () { s.remove(); }, 600); }
     t = setInterval(function () {
       if (i < lampu.length) { lampu[i].classList.add('nyala'); i++; }
       else { clearInterval(t); s.classList.add('hijau'); setTimeout(tutup, 700); }
     }, 420);
     s.addEventListener('click', tutup);
   })();
