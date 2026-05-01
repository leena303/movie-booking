"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
type Language = "VI" | "EN";

const SETTINGS_EVENT = "app-settings-change";

function emitSettingsChange() {
  window.dispatchEvent(new Event(SETTINGS_EVENT));
}

function subscribeSettings(callback: () => void) {
  window.addEventListener(SETTINGS_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(SETTINGS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSettingsSnapshot() {
  const theme = localStorage.getItem("app_theme");
  const language = localStorage.getItem("app_language");
  const emailBooking = localStorage.getItem("email_booking");

  return JSON.stringify({
    theme: theme === "dark" ? "dark" : "light",
    language: language === "EN" ? "EN" : "VI",
    emailBooking: emailBooking === null ? true : emailBooking === "true",
  });
}

function getServerSettingsSnapshot() {
  return JSON.stringify({
    theme: "light",
    language: "VI",
    emailBooking: true,
  });
}

function applyTheme(theme: Theme) {
  localStorage.setItem("app_theme", theme);
  document.documentElement.setAttribute("data-app-theme", theme);
  emitSettingsChange();
}

function applyLanguage(language: Language) {
  localStorage.setItem("app_language", language);
  document.documentElement.setAttribute("data-app-language", language);
  emitSettingsChange();
}

function applyEmailBooking(value: boolean) {
  localStorage.setItem("email_booking", String(value));
  emitSettingsChange();
}

const text = {
  VI: {
    title: "Cài đặt",
    desc: "Quản lý giao diện, thông báo và ngôn ngữ của tài khoản.",
    theme: "Giao diện",
    themeDesc: "Chuyển đổi chế độ sáng / tối",
    notification: "Thông báo",
    emailBooking: "Email booking",
    language: "Ngôn ngữ",
    languageDesc: "Chọn ngôn ngữ hiển thị",
  },
  EN: {
    title: "Settings",
    desc: "Manage appearance, notifications, and account language.",
    theme: "Appearance",
    themeDesc: "Switch between light and dark mode",
    notification: "Notifications",
    emailBooking: "Booking email",
    language: "Language",
    languageDesc: "Choose display language",
  },
};

export default function SettingsPage() {
  const snapshot = useSyncExternalStore(
    subscribeSettings,
    getSettingsSnapshot,
    getServerSettingsSnapshot,
  );

  const settings = JSON.parse(snapshot) as {
    theme: Theme;
    language: Language;
    emailBooking: boolean;
  };

  const t = text[settings.language];

  function handleToggleTheme() {
    const nextTheme = settings.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  }

  function handleChangeLanguage(language: Language) {
    applyLanguage(language);
  }

  function handleToggleEmailBooking(value: boolean) {
    applyEmailBooking(value);
  }

  return (
    <main className="py-5" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <div className="mb-4">
          <h2 className="fw-bold mb-1">{t.title}</h2>
          <p className="text-muted">{t.desc}</p>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
              <div>
                <h5 className="mb-1 fw-semibold">{t.theme}</h5>
                <p className="small text-muted mb-0">{t.themeDesc}</p>
              </div>

              <button
                type="button"
                onClick={handleToggleTheme}
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                style={{ width: 44, height: 44, borderRadius: "50%" }}
                aria-label="Toggle theme"
              >
                {settings.theme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>
            </div>

            <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
              <div>
                <h5 className="mb-1 fw-semibold">{t.notification}</h5>
                <p className="small text-muted mb-0">{t.emailBooking}</p>
              </div>

              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={settings.emailBooking}
                  onChange={(e) => handleToggleEmailBooking(e.target.checked)}
                  style={{ width: 48, height: 24 }}
                />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between py-3">
              <div>
                <h5 className="mb-1 fw-semibold">{t.language}</h5>
                <p className="small text-muted mb-0">{t.languageDesc}</p>
              </div>

              <div className="btn-group">
                <button
                  type="button"
                  className={`btn ${
                    settings.language === "VI"
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() => handleChangeLanguage("VI")}
                >
                  VI
                </button>

                <button
                  type="button"
                  className={`btn ${
                    settings.language === "EN"
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() => handleChangeLanguage("EN")}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
