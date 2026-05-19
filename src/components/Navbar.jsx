import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? "text-cyan-400 bg-[#1E293B]/50 font-semibold"
        : "text-slate-400 hover:bg-[#1E293B] hover:text-slate-50"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-base font-medium transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? "text-cyan-400 bg-[#1E293B] font-semibold"
        : "text-slate-400 hover:bg-[#1E293B]/50 hover:text-slate-50"
    }`;

  return (
    <nav className="bg-[#111827] border-b border-slate-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-slate-50 tracking-wider flex items-center gap-2 select-none">
              <span className="text-2xl">🚗</span> AutoGallery
            </span>
          </div>

          <div className="hidden md:flex space-x-2">
            <NavLink to="/" className={linkClass}>
              <span>📁</span> Catálogo
            </NavLink>
            <NavLink to="/marcas" className={linkClass}>
              <span>🏷️</span> Marcas
            </NavLink>
            <NavLink to="/vehiculos" className={linkClass}>
              <span>🚘</span> Vehículos
            </NavLink>
            <NavLink to="/fotografias" className={linkClass}>
              <span>📸</span> Fotografías
            </NavLink>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-50 hover:bg-[#1E293B] focus:outline-none transition"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú de navegación</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden border-t border-slate-800 bg-[#111827]`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
          <NavLink
            to="/"
            className={mobileLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <span>📁</span> Catálogo
          </NavLink>
          <NavLink
            to="/marcas"
            className={mobileLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <span>🏷️</span> Marcas
          </NavLink>
          <NavLink
            to="/vehiculos"
            className={mobileLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <span>🚘</span> Vehículos
          </NavLink>
          <NavLink
            to="/fotografias"
            className={mobileLinkClass}
            onClick={() => setIsOpen(false)}
          >
            <span>📸</span> Fotografías
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
