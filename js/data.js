const PRODUCTS = [
  {
    id: "P001",
    name: "Nasi Goreng",
    category: "Makanan",
    price: 12000,
    image: "assets/products/nasi-goreng.jpg",
    description: "Nasi goreng telor, kecap, dan irisan daun bawang. Porsi kantin, siap makan.",
    available: true,
    isBestSeller: true,
    isNew: false
  },
  {
    id: "P002",
    name: "Mie Goreng",
    category: "Makanan",
    price: 10000,
    image: "assets/products/mie-goreng.jpg",
    description: "Mie goreng pedas sedang, cocok dipasangkan dengan es teh.",
    available: true,
    isBestSeller: true,
    isNew: false
  },
  {
    id: "P003",
    name: "Nasi Ayam",
    category: "Makanan",
    price: 15000,
    image: "assets/products/nasi-ayam.jpg",
    description: "Nasi putih, ayam bumbu, dan sambal. Mengenyangkan buat istirahat siang.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P004",
    name: "Ayam Geprek",
    category: "Makanan",
    price: 14000,
    image: "assets/products/ayam-geprek.jpg",
    description: "Ayam goreng digeprek sambal cabai. Pedasnya bisa diminta sedang.",
    available: true,
    isBestSeller: true,
    isNew: true
  },
  {
    id: "P005",
    name: "Soto Ayam",
    category: "Makanan",
    price: 12000,
    image: "assets/products/soto-ayam.jpg",
    description: "Kuah kuning, suwiran ayam, dan soun. Hangat buat pagi atau sore.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P006",
    name: "Nasi Uduk",
    category: "Makanan",
    price: 11000,
    image: "assets/products/nasi-uduk.jpg",
    description: "Nasi uduk gurih, tempe orek, dan sambal. Menu pagi kampus.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P007",
    name: "Bakso",
    category: "Makanan",
    price: 13000,
    image: "assets/products/bakso.jpg",
    description: "Kuah kaldu, bakso sapi, bihun, dan daun bawang.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P008",
    name: "Gado-gado",
    category: "Makanan",
    price: 10000,
    image: "assets/products/gado-gado.jpg",
    description: "Sayur rebus, lontong, dan bumbu kacang. Lagi habis hari ini.",
    available: false,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P009",
    name: "Nasi Kuning",
    category: "Makanan",
    price: 11000,
    image: "assets/products/nasi-kuning.jpg",
    description: "Nasi kuning, ayam, dan telur. Terasa lengkap meski porsi kantin.",
    available: true,
    isBestSeller: false,
    isNew: true
  },
  {
    id: "P010",
    name: "Mie Ayam",
    category: "Makanan",
    price: 12000,
    image: "assets/products/mie-ayam.jpg",
    description: "Mie ayam topping ayam kecap. Bisa tambah es teh di keranjang.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P011",
    name: "Es Teh",
    category: "Minuman",
    price: 5000,
    image: "assets/products/es-teh.jpg",
    description: "Teh manis dingin. Pas nemenin nasi atau mie.",
    available: true,
    isBestSeller: true,
    isNew: false
  },
  {
    id: "P012",
    name: "Es Jeruk",
    category: "Minuman",
    price: 6000,
    image: "assets/products/es-jeruk.jpg",
    description: "Jeruk peras dingin, tidak terlalu manis.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P013",
    name: "Kopi Hitam",
    category: "Minuman",
    price: 5000,
    image: "assets/products/kopi-hitam.jpg",
    description: "Kopi tubruk panas. Buat yang butuh melek sebelum kelas.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P014",
    name: "Es Kopi",
    category: "Minuman",
    price: 8000,
    image: "assets/products/es-kopi.jpg",
    description: "Kopi susu dingin. Simulasi menu andalan sore.",
    available: true,
    isBestSeller: false,
    isNew: true
  },
  {
    id: "P015",
    name: "Air Mineral",
    category: "Minuman",
    price: 3000,
    image: "assets/products/air-mineral.jpg",
    description: "Air minum gelas. Paling hemat buat nemenin makan.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P016",
    name: "Teh Hangat",
    category: "Minuman",
    price: 4000,
    image: "assets/products/teh-hangat.jpg",
    description: "Teh manis hangat. Enak pas hujan atau pagi-pagi.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P017",
    name: "Es Coklat",
    category: "Minuman",
    price: 7000,
    image: "assets/products/es-coklat.jpg",
    description: "Coklat dingin kental. Lagi habis stok bubuknya.",
    available: false,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P018",
    name: "Pisang Goreng",
    category: "Snack",
    price: 6000,
    image: "assets/products/pisang-goreng.jpg",
    description: "Pisang goreng tepung crispy, tiga potong per porsi.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P019",
    name: "Tahu Isi",
    category: "Snack",
    price: 5000,
    image: "assets/products/tahu-isi.jpg",
    description: "Tahu goreng isi sayuran. Dua buah per porsi.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P020",
    name: "Risoles",
    category: "Snack",
    price: 5000,
    image: "assets/products/risoles.jpg",
    description: "Risoles ragout, kulit tipis, isian gurih.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P021",
    name: "Tempe Mendoan",
    category: "Snack",
    price: 6000,
    image: "assets/products/tempe-mendoan.jpg",
    description: "Tempe mendoan tipis, sambal kecap di sisi.",
    available: true,
    isBestSeller: false,
    isNew: false
  },
  {
    id: "P022",
    name: "Roti Bakar",
    category: "Snack",
    price: 8000,
    image: "assets/products/roti-bakar.jpg",
    description: "Roti bakar cokelat keju. Enak buat nunggu kelas sore.",
    available: true,
    isBestSeller: true,
    isNew: false
  }
];

const QUIZ_QUESTIONS = [
  {
    id: "quiz01",
    question: "Berapa hasil 1+1?",
    options: ["3", "2", "100", "malas ah pusing"],
    answer: 1
  },
  {
    id: "quiz02",
    question: "Siapa presiden ke-8 RI?",
    options: [
      "Prabowo Subianto",
      "Hidup Jokow-",
      "Messi",
      "Sawit Man"
    ],
    answer: 0
  },
  {
    id: "quiz03",
    question: "Apakah Nizar orang yang tampan?",
    options: [
      "Tidak",
      "Mikir kids",
      "Geleuh",
      "Iya 100% lebih tampan dari Tae-Hyung"
    ],
    answer: 3
  }
];

const CANTEEN_INFO = {
  name: "KANTIN SHODAP NIEH",
  location: "Kampus 3 UIN SAGA",
  hours: "Buka setiap hari · Tutup pas kiamat",
  contact: "kampus@shodapnieh.demo",
  note: "Informasi kantin untuk keperluan demo. Bukan jam operasional realtime."
};

const VOUCHER_TEMPLATE = {
  code: "KUIS10",
  type: "percentage",
  value: 10,
  used: false
};
