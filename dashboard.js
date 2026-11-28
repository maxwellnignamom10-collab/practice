const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const notificationsPanel = document.getElementById("notificationsPanel");
const pageTitle = document.getElementById("pageTitle");
const themeToggle = document.getElementById("themeToggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateThemeToggle() {
  const isDark = document.documentElement.dataset.theme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;
  themeToggle.setAttribute("aria-label", label);
  themeToggle.title = label;
  themeColor.content = isDark ? "#101913" : "#f4f6f1";
}

updateThemeToggle();
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("farm-dashboard-theme", nextTheme);
  updateThemeToggle();
});

const today = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());
document.getElementById("todayLabel").textContent = today;

function closeMobileSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
  document.body.classList.remove("menu-open");
}

document.getElementById("menuButton").addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
  document.body.classList.add("menu-open");
});

overlay.addEventListener("click", () => {
  closeMobileSidebar();
  notificationsPanel.classList.remove("open");
  notificationsPanel.setAttribute("aria-hidden", "true");
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document.querySelector(".nav-item.active")?.classList.remove("active");
    item.classList.add("active");
    pageTitle.textContent = item.dataset.page;
    closeMobileSidebar();
  });
});

document.getElementById("notificationButton").addEventListener("click", () => {
  notificationsPanel.classList.add("open");
  notificationsPanel.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
  document.body.classList.add("menu-open");
});

document.getElementById("closeNotifications").addEventListener("click", () => {
  notificationsPanel.classList.remove("open");
  notificationsPanel.setAttribute("aria-hidden", "true");
  overlay.classList.remove("show");
  document.body.classList.remove("menu-open");
});

const addPigDialog = document.getElementById("addPigDialog");
document.getElementById("addPigButton").addEventListener("click", () => {
  addPigDialog.showModal();
});

document.getElementById("savePig").addEventListener("click", (event) => {
  const form = document.getElementById("addPigForm");
  if (!form.reportValidity()) {
    event.preventDefault();
  }
});

document.getElementById("addPigForm").addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;

  const formData = new FormData(event.currentTarget);
  const pigId = String(formData.get("pigId") || "").trim();
  if (!pigId) {
    event.preventDefault();
    return;
  }

  const breed = String(formData.get("breed") || "");
  const category = String(formData.get("category") || "");
  const weight = String(formData.get("weight") || "0");
  const health = String(formData.get("health") || "Healthy");
  const healthy = health === "Healthy";
  const tbody = document.querySelector("tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><strong></strong></td>
    <td></td>
    <td></td>
    <td></td>
    <td><span class="pill"></span></td>
    <td><button class="row-menu" type="button" aria-label="Pig actions">•••</button></td>`;
  row.querySelector("td strong").textContent = pigId;
  const cells = row.querySelectorAll("td");
  cells[1].textContent = breed;
  cells[2].textContent = category;
  cells[3].textContent = `${weight} kg`;
  const pill = row.querySelector(".pill");
  pill.textContent = health;
  pill.classList.add(healthy ? "healthy" : "attention");
  tbody.prepend(row);
  event.currentTarget.reset();
});

document.getElementById("addTaskButton").addEventListener("click", () => {
  const title = window.prompt("Task name");
  if (!title?.trim()) return;
  const taskList = document.querySelector(".task-list");
  const label = document.createElement("label");
  label.className = "task";
  label.innerHTML = '<input type="checkbox" /><span class="custom-check"></span><div><strong></strong><small>Personal · Today</small></div>';
  label.querySelector("strong").textContent = title.trim();
  taskList.appendChild(label);
});

document.querySelectorAll(".task input").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    checkbox.closest(".task").classList.toggle("done", checkbox.checked);
  });
});

document.querySelector(".task-list").addEventListener("change", (event) => {
  if (event.target.matches(".task input")) {
    event.target.closest(".task").classList.toggle("done", event.target.checked);
  }
});

document.getElementById("viewLivestock").addEventListener("click", () => {
  document.querySelector('.nav-item[data-page="Livestock"]').click();
});

document.getElementById("profileFarmLink").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("periodSelect").addEventListener("change", () => {
  const chart = document.querySelector(".chart");
  chart.animate(
    [{ opacity: 0.35, transform: "translateY(3px)" }, { opacity: 1, transform: "translateY(0)" }],
    { duration: 240, easing: "ease-out" }
  );
});

document.getElementById("globalSearch").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase().trim();
  document.querySelectorAll("tbody tr").forEach((row) => {
    row.hidden = Boolean(query) && !row.textContent.toLowerCase().includes(query);
  });
});

document.querySelectorAll(".alert-card button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.textContent.includes("breeding") ? "Breeding" : "Feed & Inventory";
    document.querySelector(`.nav-item[data-page="${target}"]`)?.click();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMobileSidebar();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileSidebar();
    notificationsPanel.classList.remove("open");
    notificationsPanel.setAttribute("aria-hidden", "true");
  }
});
