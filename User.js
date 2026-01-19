var currentTheme = "default";
var chart;

document.addEventListener("DOMContentLoaded", function () {
  loadProfile();
  loadTheme();
  updateSummary();
  loadChart();

  var profileForm = document.getElementById("profileForm");
  var resetThemeBtn = document.getElementById("resetThemeBtn");
  var exportSettingsBtn = document.getElementById("exportSettingsBtn");
  var printSettingsBtn = document.getElementById("printSettingsBtn");
  var mobileMenuBtn = document.getElementById("mobileMenuBtn");

  // NEW: Settings-only dark mode button (inside Themes card)
  var darkModeBtn = document.getElementById("darkModeBtn");

  if (profileForm) profileForm.addEventListener("submit", saveProfile);
  if (resetThemeBtn) resetThemeBtn.addEventListener("click", resetTheme);
  if (exportSettingsBtn) exportSettingsBtn.addEventListener("click", exportSettings);
  if (printSettingsBtn) printSettingsBtn.addEventListener("click", printSettings);
  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", toggleMenu);

  // Dark mode toggle is now handled ONLY in Settings page (no moon button)
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", function () {
      // Toggle dark mode (global)
      var isDark = document.documentElement.classList.toggle("dark");
      setTheme(isDark ? "dark" : "default");
    });
  }

  document.querySelectorAll(".theme-option").forEach(function (item) {
    item.addEventListener("click", function () {
      setTheme(item.dataset.theme);
    });
  });
});

/* ---------------- PROFILE ---------------- */

function saveProfile(e) {
  e.preventDefault();

  var userName = document.getElementById("userName");
  var userEmail = document.getElementById("userEmail");
  var profileSaveMsg = document.getElementById("profileSaveMsg");

  if (!userName || !userEmail) return;

  localStorage.setItem("name", userName.value);
  localStorage.setItem("email", userEmail.value);

  if (profileSaveMsg) profileSaveMsg.classList.remove("hidden");
  updateSummary();
}

function loadProfile() {
  var userName = document.getElementById("userName");
  var userEmail = document.getElementById("userEmail");

  if (userName) userName.value = localStorage.getItem("name") || "John Doe";
  if (userEmail) userEmail.value = localStorage.getItem("email") || "john.doe@example.com";
}

function updateSummary() {
  var userName = document.getElementById("userName");
  var userEmail = document.getElementById("userEmail");

  var summaryUser = document.getElementById("summaryUser");
  var summaryEmail = document.getElementById("summaryEmail");
  var summaryTheme = document.getElementById("summaryTheme");

  if (summaryUser && userName) summaryUser.innerText = userName.value;
  if (summaryEmail && userEmail) summaryEmail.innerText = userEmail.value;
  if (summaryTheme) summaryTheme.innerText = currentTheme;
}

/* ---------------- THEMES (TAILWIND ONLY) ---------------- */

function setTheme(theme) {
  var body = document.body;
  if (!body) return;

  // Remove only known theme classes (do NOT nuke layout classes)
  body.classList.remove(
    "bg-gray-50", "text-gray-900",
    "bg-[#1a1a1a]", "text-gray-100",
    "bg-sky-50",
    "bg-slate-50",
    "bg-amber-50"
  );

  // Default layout classes must always stay
  body.classList.add("min-h-screen", "flex", "flex-col");

  // Reset Tailwind dark mode class first
  document.documentElement.classList.remove("dark");

  if (theme === "default") {
    body.classList.add("bg-gray-50", "text-gray-900");
  }

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    body.classList.add("bg-[#1a1a1a]", "text-gray-100");
  }

  if (theme === "light-blue") {
    body.classList.add("bg-sky-50", "text-slate-900");
  }

  // Accessibility-style themes (background-focused)
  if (theme === "protanopia") {
    body.classList.add("bg-slate-50", "text-slate-900");
  }

  if (theme === "deuteranopia") {
    body.classList.add("bg-gray-50", "text-slate-900");
  }

  if (theme === "tritanopia") {
    body.classList.add("bg-amber-50", "text-slate-900");
  }

  currentTheme = theme;

  var currentThemeDisplay = document.getElementById("currentThemeDisplay");
  var summaryTheme = document.getElementById("summaryTheme");

  if (currentThemeDisplay) currentThemeDisplay.innerText = theme;
  if (summaryTheme) summaryTheme.innerText = theme;

  // Persist theme choice (this is what other pages read)
  localStorage.setItem("theme", theme);
}

function loadTheme() {
  var t = localStorage.getItem("theme");
  setTheme(t || "default");
}

function resetTheme() {
  setTheme("default");
}

/* ---------------- CHART ---------------- */

function loadChart() {
  var categoryChart = document.getElementById("categoryChart");
  if (!categoryChart || typeof Chart === "undefined") return;

  chart = new Chart(categoryChart, {
    type: "doughnut",
    data: {
      labels: ["Food", "Transport", "Entertainment", "Shopping"],
      datasets: [{
        data: [30, 20, 25, 25],
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]
      }]
    }
  });
}

/* ---------------- EXPORT ---------------- */

function exportSettings() {
  var userName = document.getElementById("userName");
  var userEmail = document.getElementById("userEmail");

  var data = {
    name: userName ? userName.value : "",
    email: userEmail ? userEmail.value : "",
    theme: currentTheme
  };

  var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "settings.json";
  link.click();
}

/* ---------------- PRINT ---------------- */

function printSettings() {
  var userName = document.getElementById("userName");
  var userEmail = document.getElementById("userEmail");

  var printDate = document.getElementById("printDate");
  var printUser = document.getElementById("printUser");
  var printUserEmail = document.getElementById("printUserEmail");
  var printTheme = document.getElementById("printTheme");
  var printSection = document.getElementById("printSection");

  if (printDate) printDate.innerText = new Date().toString();
  if (printUser && userName) printUser.innerText = userName.value;
  if (printUserEmail && userEmail) printUserEmail.innerText = userEmail.value;
  if (printTheme) printTheme.innerText = currentTheme;

  if (printSection) printSection.classList.remove("hidden");
  window.print();
  if (printSection) printSection.classList.add("hidden");
}

/* ---------------- MOBILE MENU ---------------- */

function toggleMenu() {
  var mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) mobileMenu.classList.toggle("hidden");
}
