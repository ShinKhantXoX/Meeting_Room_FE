import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { LogOut, CalendarDays, Shield, BarChart3, Users } from "lucide-react";
import PageTransition from "./PageTransition";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "./RoleBadge";

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-1.5 ${isActive ? "font-medium text-blue-600" : "text-gray-600 hover:text-gray-900"}`
            }
          >
            <CalendarDays size={16} />
            {t("nav.bookings")}
          </NavLink>
          {(user?.role === "admin" || user?.role === "owner") && (
            <NavLink
              to="/roles"
              className={({ isActive }) =>
                `flex items-center gap-1.5 ${isActive ? "font-medium text-blue-600" : "text-gray-600 hover:text-gray-900"}`
              }
            >
              <Shield size={16} />
              {t("nav.roles")}
            </NavLink>
          )}
          {(user?.role === "admin" || user?.role === "owner") && (
            <NavLink
              to="/summary"
              className={({ isActive }) =>
                `flex items-center gap-1.5 ${isActive ? "font-medium text-blue-600" : "text-gray-600 hover:text-gray-900"}`
              }
            >
              <BarChart3 size={16} />
              {t("nav.summary")}
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1.5 ${isActive ? "font-medium text-blue-600" : "text-gray-600 hover:text-gray-900"}`
              }
            >
              <Users size={16} />
              {t("nav.users")}
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i18n.changeLanguage("en")}
              className={`text-sm ${i18n.language === "en" ? "font-medium text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              EN
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => i18n.changeLanguage("my")}
              className={`text-sm ${i18n.language === "my" ? "font-medium text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              မြန်မာ
            </button>
          </div>
          <span className="text-gray-700">{user?.name}</span>
          <RoleBadge role={user?.role ?? "user"} />
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <LogOut size={16} />
            {t("nav.logout")}
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  );
}
