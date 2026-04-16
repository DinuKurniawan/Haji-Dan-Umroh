(function () {
  const STORAGE_KEYS = {
    packages: "safarharamain_packages",
    schedules: "safarharamain_schedules",
    reviews: "safarharamain_reviews",
    selectedPackage: "safarharamain_selected_package"
  };

  const defaultPackages = [
    {
      id: "pkg-umroh-reguler",
      badge: "Umroh Reguler",
      title: "9 Hari Nyaman",
      description: "Cocok untuk jamaah pertama kali yang ingin perjalanan ringkas dengan pendampingan penuh.",
      priceLabel: "Rp 29,9 jt",
      buttonLabel: "Pilih",
      image: "https://images.unsplash.com/photo-1752504343452-43e477dbbe92?auto=format&fit=crop&w=1200&q=80",
      alt: "Menara jam Makkah terlihat dari kawasan Masjidil Haram",
      featured: false
    },
    {
      id: "pkg-umroh-plus-thaif",
      badge: "Paling diminati",
      title: "Umroh Plus Thaif",
      description: "Itinerary lebih lapang, ziarah tambahan, dan hotel strategis untuk jamaah keluarga.",
      priceLabel: "Rp 34,5 jt",
      buttonLabel: "Pilih",
      image: "https://images.unsplash.com/photo-1744264362119-bd94511b0597?auto=format&fit=crop&w=1200&q=80",
      alt: "Jamaah beribadah di area Masjid Nabawi",
      featured: true
    },
    {
      id: "pkg-haji-khusus",
      badge: "Haji Khusus",
      title: "Program Intensif",
      description: "Persiapan ibadah menyeluruh dengan pendampingan administrasi dan manasik bertahap.",
      priceLabel: "Daftar tunggu",
      buttonLabel: "Tanya",
      image: "https://images.unsplash.com/photo-1667449626368-a9b1cbf63917?auto=format&fit=crop&w=1200&q=80",
      alt: "Kubah dan arsitektur Masjid Nabawi",
      featured: false
    }
  ];

  const defaultSchedules = [
    {
      id: "sch-18-mei-2026",
      packageName: "Umroh Reguler 9 Hari",
      route: "Jakarta - Jeddah - Makkah - Madinah",
      dateText: "18 Mei 2026",
      buttonLabel: "Daftar"
    },
    {
      id: "sch-09-juni-2026",
      packageName: "Umroh Plus Thaif",
      route: "Jakarta - Madinah - Makkah - Thaif",
      dateText: "09 Juni 2026",
      buttonLabel: "Daftar"
    },
    {
      id: "sch-27-juni-2026",
      packageName: "Umroh Keluarga",
      route: "Keberangkatan libur sekolah",
      dateText: "27 Juni 2026",
      buttonLabel: "Daftar"
    }
  ];

  const defaultReviews = [
    {
      id: "rev-rina",
      name: "Rina Aulia",
      city: "Bandung",
      trip: "Umroh Reguler",
      message: "Pembimbing sabar menjelaskan setiap rukun. Orang tua saya merasa aman karena jadwalnya jelas.",
      approved: true,
      createdAt: "2026-03-12T10:00:00.000Z"
    },
    {
      id: "rev-fajar",
      name: "Fajar Ramadhan",
      city: "Surabaya",
      trip: "Umroh Plus Thaif",
      message: "Hotel dekat, makanan cocok, dan timnya sigap saat ada jamaah yang perlu bantuan medis ringan.",
      approved: true,
      createdAt: "2026-03-25T10:00:00.000Z"
    },
    {
      id: "rev-mahmud",
      name: "H. Mahmud",
      city: "Tangerang",
      trip: "Haji Khusus",
      message: "Manasiknya membuat kami lebih siap. Saat di tanah suci, alur ibadah terasa lebih mudah diikuti.",
      approved: true,
      createdAt: "2026-04-02T10:00:00.000Z"
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readStorage(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        window.localStorage.setItem(key, JSON.stringify(fallback));
        return clone(fallback);
      }

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function writeStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
    return clone(value);
  }

  function writeSession(key, value) {
    window.sessionStorage.setItem(key, value);
    return value;
  }

  function readSession(key) {
    return window.sessionStorage.getItem(key);
  }

  function removeSession(key) {
    window.sessionStorage.removeItem(key);
  }

  function createId(prefix) {
    return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  }

  const store = {
    createId,
    getPackages() {
      return readStorage(STORAGE_KEYS.packages, defaultPackages);
    },
    savePackages(items) {
      return writeStorage(STORAGE_KEYS.packages, items);
    },
    getSchedules() {
      return readStorage(STORAGE_KEYS.schedules, defaultSchedules);
    },
    saveSchedules(items) {
      return writeStorage(STORAGE_KEYS.schedules, items);
    },
    getReviews() {
      return readStorage(STORAGE_KEYS.reviews, defaultReviews);
    },
    saveReviews(items) {
      return writeStorage(STORAGE_KEYS.reviews, items);
    },
    getApprovedReviews() {
      return this.getReviews().filter((review) => review.approved);
    },
    setSelectedPackage(title) {
      return writeSession(STORAGE_KEYS.selectedPackage, title);
    },
    getSelectedPackage() {
      return readSession(STORAGE_KEYS.selectedPackage);
    },
    clearSelectedPackage() {
      removeSession(STORAGE_KEYS.selectedPackage);
    },
    resetAll() {
      this.savePackages(defaultPackages);
      this.saveSchedules(defaultSchedules);
      this.saveReviews(defaultReviews);
      this.clearSelectedPackage();
    }
  };

  window.SafarHaramainStore = store;
})();
