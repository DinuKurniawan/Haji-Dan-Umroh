const store = window.SafarHaramainStore;

const siteHeader = document.querySelector("#siteHeader");
const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");
const navLinks = document.querySelectorAll("#navMenu a");
const packageLinkTriggers = document.querySelectorAll("[data-package-link]");
const packageList = document.querySelector("#packageList");
const packageMoreAction = document.querySelector("#packageMoreAction");
const scheduleList = document.querySelector("#scheduleList");
const reviewList = document.querySelector("#reviewList");
const packageSelect = document.querySelector("#packageSelect");
const consultationForm = document.querySelector("#consultationForm");
const formMessage = document.querySelector("#formMessage");
const reviewForm = document.querySelector("#reviewForm");
const reviewMessage = document.querySelector("#reviewMessage");
let revealObserver;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function updateHeader() {
  if (!siteHeader) {
    return;
  }

  if (window.scrollY > 24) {
    siteHeader.classList.add("header-scrolled");
  } else {
    siteHeader.classList.remove("header-scrolled");
  }
}

function closeMobileMenu() {
  if (!navMenu || !menuToggle) {
    return;
  }

  navMenu.classList.add("hidden");
  navMenu.classList.remove("mobile-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function selectConsultationPackage(packageTitle) {
  if (!packageSelect || !packageTitle) {
    return;
  }

  const hasOption = Array.from(packageSelect.options).some(
    (option) => option.value === packageTitle
  );

  if (hasOption) {
    packageSelect.value = packageTitle;
  }
}

function applyPendingPackageSelection() {
  if (!packageSelect || !store?.getSelectedPackage) {
    return;
  }

  const selectedPackage = store.getSelectedPackage();
  if (!selectedPackage) {
    return;
  }

  selectConsultationPackage(selectedPackage);
  store.clearSelectedPackage();
}

function updatePackageLinks(totalPackages) {
  if (!packageLinkTriggers.length) {
    return;
  }

  const targetHref = totalPackages > 6 ? "paket.html" : "#paket";
  packageLinkTriggers.forEach((link) => {
    link.setAttribute("href", targetHref);
  });
}

function setupScrollAnimations() {
  const supportsMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!supportsMotion) {
    return;
  }

  document.body.classList.add("js-ready");

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12
      }
    );
  }

  const revealTargets = document.querySelectorAll(
    "[data-reveal], .stat-item, .service-item, .package-card, .schedule-row, .testimonial-card, .review-panel, .contact-form, .package-section-actions"
  );

  revealTargets.forEach((element, index) => {
    if (element.dataset.revealBound === "true") {
      return;
    }

    element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
    element.dataset.revealBound = "true";
    revealObserver.observe(element);
  });
}

function renderPackages() {
  if (!packageList || !store) {
    return;
  }

  const items = store.getPackages();
  const mode = packageList.dataset.mode || "home";
  const consultHref = packageList.dataset.consultHref || "#kontak";
  const visibleItems = mode === "all" ? items : items.slice(0, 6);

  updatePackageLinks(items.length);

  if (!visibleItems.length) {
    packageList.innerHTML = '<div class="empty-state lg:col-span-3">Belum ada paket yang ditampilkan.</div>';
    if (packageMoreAction) {
      packageMoreAction.classList.add("hidden");
      packageMoreAction.innerHTML = "";
    }
    setupScrollAnimations();
    return;
  }

  packageList.innerHTML = visibleItems
    .map((item) => {
      const note = item.priceLabel.toLowerCase().includes("rp") ? "Mulai" : "Konsultasi";
      const featuredClass = item.featured ? " featured-package" : "";
      const badgeClass = item.featured ? "package-badge is-featured" : "package-badge";
      const buttonClass = item.featured ? "small-button light" : "small-button";

      return `
        <article class="package-card${featuredClass}">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" class="package-image">
          <div class="package-body">
            <p class="${badgeClass}">${escapeHtml(item.badge)}</p>
            <h3 class="package-title">${escapeHtml(item.title)}</h3>
            <p class="package-copy">${escapeHtml(item.description)}</p>
            <div class="package-meta">
              <p>
                <span class="package-price-note">${escapeHtml(note)}</span>
                <strong class="package-price-value">${escapeHtml(item.priceLabel)}</strong>
              </p>
              <a href="${escapeHtml(consultHref)}" class="${buttonClass}" data-package-title="${escapeHtml(item.title)}">${escapeHtml(item.buttonLabel)}</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  if (!packageMoreAction) {
    setupScrollAnimations();
    return;
  }

  if (mode === "home" && items.length > 6) {
    packageMoreAction.innerHTML = `
      <div class="package-more-copy">
        <strong>${escapeHtml(String(items.length))} paket tersedia</strong>
        <p>Homepage menampilkan 6 paket pertama. Lihat halaman paket untuk daftar lengkap.</p>
      </div>
      <a href="paket.html" class="small-button">Lihat Semua Paket</a>
    `;
    packageMoreAction.classList.remove("hidden");
    setupScrollAnimations();
    return;
  }

  packageMoreAction.classList.add("hidden");
  packageMoreAction.innerHTML = "";
  setupScrollAnimations();
}

function renderSchedules() {
  if (!scheduleList || !store) {
    return;
  }

  const items = store.getSchedules();

  if (!items.length) {
    scheduleList.innerHTML = '<div class="empty-state">Belum ada jadwal keberangkatan.</div>';
    setupScrollAnimations();
    return;
  }

  scheduleList.innerHTML = items
    .map(
      (item) => `
        <div class="schedule-row">
          <div>
            <p class="schedule-name">${escapeHtml(item.packageName)}</p>
            <p class="schedule-route">${escapeHtml(item.route)}</p>
          </div>
          <strong>${escapeHtml(item.dateText)}</strong>
          <a href="#kontak" class="schedule-cta">${escapeHtml(item.buttonLabel)}</a>
        </div>
      `
    )
    .join("");
  setupScrollAnimations();
}

function renderReviews() {
  if (!reviewList || !store) {
    return;
  }

  const items = store.getApprovedReviews();

  if (!items.length) {
    reviewList.innerHTML = '<div class="empty-state md:col-span-2">Belum ada review yang ditampilkan.</div>';
    setupScrollAnimations();
    return;
  }

  reviewList.innerHTML = items
    .map(
      (item) => `
        <figure class="testimonial-card">
          <span class="review-trip">${escapeHtml(item.trip)}</span>
          <blockquote>"${escapeHtml(item.message)}"</blockquote>
          <figcaption>${escapeHtml(item.name)}, ${escapeHtml(item.city)}</figcaption>
        </figure>
      `
    )
    .join("");
  setupScrollAnimations();
}

function populatePackageOptions() {
  if (!packageSelect || !store) {
    return;
  }

  const items = store.getPackages();
  const currentValue = packageSelect.value;
  const options = ['<option value="">Pilih paket</option>']
    .concat(
      items.map(
        (item) => `<option value="${escapeHtml(item.title)}">${escapeHtml(item.title)}</option>`
      )
    )
    .join("");

  packageSelect.innerHTML = options;
  packageSelect.value = items.some((item) => item.title === currentValue) ? currentValue : "";
}

function handleConsultationForm(event) {
  event.preventDefault();

  const formData = new FormData(consultationForm);
  const name = formData.get("name")?.toString().trim() || "Jamaah";
  const selectedPackage = formData.get("package")?.toString() || "paket pilihan";

  formMessage.textContent = `Terima kasih, ${name}. Tim kami akan menghubungi Anda untuk membahas ${selectedPackage}.`;
  formMessage.classList.remove("hidden");
  consultationForm.reset();
  populatePackageOptions();
}

function handleReviewForm(event) {
  event.preventDefault();

  const formData = new FormData(reviewForm);
  const review = {
    id: store.createId("rev"),
    name: formData.get("name")?.toString().trim() || "Jamaah",
    city: formData.get("city")?.toString().trim() || "-",
    trip: formData.get("trip")?.toString().trim() || "Perjalanan ibadah",
    message: formData.get("message")?.toString().trim() || "",
    approved: false,
    createdAt: new Date().toISOString()
  };

  const reviews = store.getReviews();
  reviews.unshift(review);
  store.saveReviews(reviews);

  reviewMessage.textContent = "Review Anda sudah dikirim dan menunggu persetujuan admin.";
  reviewMessage.classList.remove("hidden");
  reviewForm.reset();
}

function handlePackageListClick(event) {
  const packageButton = event.target.closest("[data-package-title]");
  if (!packageButton) {
    return;
  }

  const packageTitle = packageButton.dataset.packageTitle || "";
  const destination = packageButton.getAttribute("href") || "";

  if (destination === "#kontak") {
    selectConsultationPackage(packageTitle);
    store?.clearSelectedPackage?.();
  } else {
    store?.setSelectedPackage?.(packageTitle);
  }

  if (packageSelect) {
    packageSelect.focus();
  }
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("mobile-open");
    navMenu.classList.toggle("hidden", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 1024) {
      closeMobileMenu();
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    closeMobileMenu();
  }
});

if (consultationForm) {
  consultationForm.addEventListener("submit", handleConsultationForm);
}

if (reviewForm) {
  reviewForm.addEventListener("submit", handleReviewForm);
}

if (packageList) {
  packageList.addEventListener("click", handlePackageListClick);
}

window.addEventListener("scroll", updateHeader);
window.addEventListener("load", () => {
  updateHeader();
  renderPackages();
  renderSchedules();
  renderReviews();
  populatePackageOptions();
  applyPendingPackageSelection();
  setupScrollAnimations();
});
