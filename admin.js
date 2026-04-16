const store = window.SafarHaramainStore;

const packageForm = document.querySelector("#packageForm");
const cancelPackageEdit = document.querySelector("#cancelPackageEdit");
const packageAdminList = document.querySelector("#packageAdminList");
const packageFormMessage = document.querySelector("#packageFormMessage");
const packageImageUpload = document.querySelector("#packageImageUpload");
const packageImagePreview = document.querySelector("#packageImagePreview");
const packageImagePlaceholder = document.querySelector("#packageImagePlaceholder");
const clearPackageImage = document.querySelector("#clearPackageImage");
const scheduleForm = document.querySelector("#scheduleForm");
const cancelScheduleEdit = document.querySelector("#cancelScheduleEdit");
const scheduleAdminList = document.querySelector("#scheduleAdminList");
const scheduleFormMessage = document.querySelector("#scheduleFormMessage");
const reviewAdminList = document.querySelector("#reviewAdminList");
const resetDemoButton = document.querySelector("#resetDemoButton");

const packageCount = document.querySelector("#packageCount");
const scheduleCount = document.querySelector("#scheduleCount");
const approvedReviewCount = document.querySelector("#approvedReviewCount");
const pendingReviewCount = document.querySelector("#pendingReviewCount");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showMessage(target, text, isError = false) {
  target.textContent = text;
  target.classList.toggle("is-error", isError);
  target.classList.remove("hidden");
}

function clearMessage(target) {
  target.textContent = "";
  target.classList.remove("is-error");
  target.classList.add("hidden");
}

function setPackageImagePreview(source) {
  const value = source ? source.trim() : "";
  packageForm.elements.image.value = value;

  if (value) {
    packageImagePreview.src = value;
    packageImagePreview.classList.remove("hidden");
    packageImagePlaceholder.classList.add("hidden");
    return;
  }

  packageImagePreview.removeAttribute("src");
  packageImagePreview.classList.add("hidden");
  packageImagePlaceholder.classList.remove("hidden");
}

function clearPackageImageState() {
  packageImageUpload.value = "";
  packageForm.elements.imageUrl.value = "";
  setPackageImagePreview("");
}

function optimizeImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("File yang dipilih harus berupa gambar."));
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      let width = image.width;
      let height = image.height;
      const maxSize = 1400;

      if (width > maxSize || height > maxSize) {
        const scale = Math.min(maxSize / width, maxSize / height);
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gambar gagal diproses. Coba file lain."));
    };

    image.src = objectUrl;
  });
}

function resetPackageForm() {
  packageForm.reset();
  packageForm.elements.id.value = "";
  setPackageImagePreview("");
  cancelPackageEdit.classList.add("hidden");
}

function resetScheduleForm() {
  scheduleForm.reset();
  scheduleForm.elements.id.value = "";
  cancelScheduleEdit.classList.add("hidden");
}

function renderMetrics() {
  const packages = store.getPackages();
  const schedules = store.getSchedules();
  const reviews = store.getReviews();

  packageCount.textContent = packages.length;
  scheduleCount.textContent = schedules.length;
  approvedReviewCount.textContent = reviews.filter((item) => item.approved).length;
  pendingReviewCount.textContent = reviews.filter((item) => !item.approved).length;
}

function renderPackageList() {
  const items = store.getPackages();

  if (!items.length) {
    packageAdminList.innerHTML = '<div class="admin-list-empty">Belum ada paket tersimpan.</div>';
    return;
  }

  packageAdminList.innerHTML = items
    .map(
      (item) => `
        <article class="admin-item">
          <div class="admin-item-head">
            <div>
              <span class="admin-item-meta">${escapeHtml(item.badge)}${item.featured ? " • Unggulan" : ""}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
              <p><strong>${escapeHtml(item.priceLabel)}</strong> • Tombol: ${escapeHtml(item.buttonLabel)}</p>
            </div>
            <div class="admin-item-actions">
              <button type="button" class="admin-mini-button" data-entity="package" data-action="edit" data-id="${escapeHtml(item.id)}">Edit</button>
              <button type="button" class="admin-mini-button danger" data-entity="package" data-action="delete" data-id="${escapeHtml(item.id)}">Hapus</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderScheduleList() {
  const items = store.getSchedules();

  if (!items.length) {
    scheduleAdminList.innerHTML = '<div class="admin-list-empty">Belum ada jadwal tersimpan.</div>';
    return;
  }

  scheduleAdminList.innerHTML = items
    .map(
      (item) => `
        <article class="admin-item">
          <div class="admin-item-head">
            <div>
              <span class="admin-item-meta">${escapeHtml(item.dateText)}</span>
              <h3>${escapeHtml(item.packageName)}</h3>
              <p>${escapeHtml(item.route)}</p>
              <p>Label tombol: <strong>${escapeHtml(item.buttonLabel)}</strong></p>
            </div>
            <div class="admin-item-actions">
              <button type="button" class="admin-mini-button" data-entity="schedule" data-action="edit" data-id="${escapeHtml(item.id)}">Edit</button>
              <button type="button" class="admin-mini-button danger" data-entity="schedule" data-action="delete" data-id="${escapeHtml(item.id)}">Hapus</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderReviewList() {
  const items = store
    .getReviews()
    .slice()
    .sort((left, right) => Number(left.approved) - Number(right.approved));

  if (!items.length) {
    reviewAdminList.innerHTML = '<div class="admin-list-empty">Belum ada review masuk.</div>';
    return;
  }

  reviewAdminList.innerHTML = items
    .map(
      (item) => `
        <article class="admin-item">
          <div class="admin-item-head">
            <div>
              <span class="status-chip ${item.approved ? "approved" : "pending"}">${item.approved ? "Tayang" : "Menunggu"}</span>
              <h3>${escapeHtml(item.name)} • ${escapeHtml(item.city)}</h3>
              <p><strong>${escapeHtml(item.trip)}</strong></p>
              <p>${escapeHtml(item.message)}</p>
            </div>
            <div class="admin-item-actions">
              <button type="button" class="admin-mini-button ${item.approved ? "approved" : ""}" data-entity="review" data-action="toggle" data-id="${escapeHtml(item.id)}">${item.approved ? "Sembunyikan" : "Setujui"}</button>
              <button type="button" class="admin-mini-button danger" data-entity="review" data-action="delete" data-id="${escapeHtml(item.id)}">Hapus</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderAll() {
  renderMetrics();
  renderPackageList();
  renderScheduleList();
  renderReviewList();
}

function fillPackageForm(id) {
  const item = store.getPackages().find((entry) => entry.id === id);
  if (!item) {
    return;
  }

  packageForm.elements.id.value = item.id;
  packageForm.elements.badge.value = item.badge;
  packageForm.elements.title.value = item.title;
  packageForm.elements.priceLabel.value = item.priceLabel;
  packageForm.elements.buttonLabel.value = item.buttonLabel;
  packageForm.elements.description.value = item.description;
  packageForm.elements.imageUrl.value = item.image.startsWith("http") ? item.image : "";
  packageImageUpload.value = "";
  setPackageImagePreview(item.image);
  packageForm.elements.alt.value = item.alt;
  packageForm.elements.featured.checked = Boolean(item.featured);
  cancelPackageEdit.classList.remove("hidden");
  clearMessage(packageFormMessage);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function fillScheduleForm(id) {
  const item = store.getSchedules().find((entry) => entry.id === id);
  if (!item) {
    return;
  }

  scheduleForm.elements.id.value = item.id;
  scheduleForm.elements.packageName.value = item.packageName;
  scheduleForm.elements.route.value = item.route;
  scheduleForm.elements.dateText.value = item.dateText;
  scheduleForm.elements.buttonLabel.value = item.buttonLabel;
  cancelScheduleEdit.classList.remove("hidden");
  clearMessage(scheduleFormMessage);
  window.scrollTo({ top: document.body.scrollHeight * 0.35, behavior: "smooth" });
}

function handlePackageSubmit(event) {
  event.preventDefault();

  const formData = new FormData(packageForm);
  const currentId = formData.get("id")?.toString();
  const imageValue = packageForm.elements.image.value.trim() || formData.get("imageUrl")?.toString().trim() || "";

  if (!imageValue) {
    showMessage(packageFormMessage, "Upload gambar atau isi URL gambar terlebih dahulu.", true);
    return;
  }

  let packages = store.getPackages();
  const payload = {
    id: currentId || store.createId("pkg"),
    badge: formData.get("badge")?.toString().trim() || "",
    title: formData.get("title")?.toString().trim() || "",
    description: formData.get("description")?.toString().trim() || "",
    priceLabel: formData.get("priceLabel")?.toString().trim() || "",
    buttonLabel: formData.get("buttonLabel")?.toString().trim() || "Pilih",
    image: imageValue,
    alt: formData.get("alt")?.toString().trim() || "",
    featured: formData.get("featured") === "on"
  };

  packages = packages.filter((item) => item.id !== payload.id);
  if (payload.featured) {
    packages = packages.map((item) => ({ ...item, featured: false }));
  }

  packages.unshift(payload);
  try {
    store.savePackages(packages);
    resetPackageForm();
    showMessage(packageFormMessage, currentId ? "Paket berhasil diperbarui." : "Paket baru berhasil ditambahkan.");
    renderAll();
  } catch (error) {
    showMessage(packageFormMessage, "Gagal menyimpan paket. Ukuran gambar mungkin terlalu besar untuk penyimpanan browser.", true);
  }
}

function handleScheduleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(scheduleForm);
  const currentId = formData.get("id")?.toString();
  let schedules = store.getSchedules();
  const payload = {
    id: currentId || store.createId("sch"),
    packageName: formData.get("packageName")?.toString().trim() || "",
    route: formData.get("route")?.toString().trim() || "",
    dateText: formData.get("dateText")?.toString().trim() || "",
    buttonLabel: formData.get("buttonLabel")?.toString().trim() || "Daftar"
  };

  schedules = schedules.filter((item) => item.id !== payload.id);
  schedules.unshift(payload);
  store.saveSchedules(schedules);
  resetScheduleForm();
  showMessage(scheduleFormMessage, currentId ? "Jadwal berhasil diperbarui." : "Jadwal baru berhasil ditambahkan.");
  renderAll();
}

function handlePackageListClick(event) {
  const button = event.target.closest("button[data-entity='package']");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (action === "edit") {
    fillPackageForm(id);
    return;
  }

  const packages = store.getPackages().filter((item) => item.id !== id);
  store.savePackages(packages);
  renderAll();
}

function handleScheduleListClick(event) {
  const button = event.target.closest("button[data-entity='schedule']");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (action === "edit") {
    fillScheduleForm(id);
    return;
  }

  const schedules = store.getSchedules().filter((item) => item.id !== id);
  store.saveSchedules(schedules);
  renderAll();
}

function handleReviewListClick(event) {
  const button = event.target.closest("button[data-entity='review']");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  let reviews = store.getReviews();

  if (action === "toggle") {
    reviews = reviews.map((item) =>
      item.id === id ? { ...item, approved: !item.approved } : item
    );
  }

  if (action === "delete") {
    reviews = reviews.filter((item) => item.id !== id);
  }

  store.saveReviews(reviews);
  renderAll();
}

async function handlePackageImageUploadChange() {
  const file = packageImageUpload.files?.[0];
  if (!file) {
    return;
  }

  try {
    const optimizedImage = await optimizeImageFile(file);
    packageForm.elements.imageUrl.value = "";
    setPackageImagePreview(optimizedImage);
    showMessage(packageFormMessage, `Gambar "${file.name}" siap dipakai.`);
  } catch (error) {
    packageImageUpload.value = "";
    showMessage(packageFormMessage, error.message, true);
  }
}

function handlePackageImageUrlChange() {
  const url = packageForm.elements.imageUrl.value.trim();
  if (!url) {
    return;
  }

  packageImageUpload.value = "";
  setPackageImagePreview(url);
  clearMessage(packageFormMessage);
}

packageForm.addEventListener("submit", handlePackageSubmit);
scheduleForm.addEventListener("submit", handleScheduleSubmit);
packageAdminList.addEventListener("click", handlePackageListClick);
scheduleAdminList.addEventListener("click", handleScheduleListClick);
reviewAdminList.addEventListener("click", handleReviewListClick);
packageImageUpload.addEventListener("change", handlePackageImageUploadChange);
packageForm.elements.imageUrl.addEventListener("change", handlePackageImageUrlChange);
packageImagePreview.addEventListener("error", () => {
  const currentSource = packageImagePreview.getAttribute("src") || "";
  if (!currentSource.startsWith("http")) {
    return;
  }

  packageForm.elements.image.value = "";
  packageImagePreview.classList.add("hidden");
  packageImagePlaceholder.classList.remove("hidden");
  showMessage(packageFormMessage, "URL gambar tidak bisa dimuat. Coba URL lain atau upload file.", true);
});

cancelPackageEdit.addEventListener("click", () => {
  resetPackageForm();
  clearMessage(packageFormMessage);
});

cancelScheduleEdit.addEventListener("click", () => {
  resetScheduleForm();
  clearMessage(scheduleFormMessage);
});

resetDemoButton.addEventListener("click", () => {
  store.resetAll();
  resetPackageForm();
  resetScheduleForm();
  clearMessage(packageFormMessage);
  clearMessage(scheduleFormMessage);
  renderAll();
});

clearPackageImage.addEventListener("click", () => {
  clearPackageImageState();
  clearMessage(packageFormMessage);
});

renderAll();
