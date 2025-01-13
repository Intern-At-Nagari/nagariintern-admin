import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  UserCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Typography, } from "@material-tailwind/react";

const Sidebar = () => {
  const location = useLocation();
  const [openPermintaan, setOpenPermintaan] = useState(false);
  const [openMonitoring, setOpenMonitoring] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const path = location.pathname.slice(1);
    if (["diproses", "diverifikasi", "diterima"].includes(path)) {
      setActiveItem(path.charAt(0).toUpperCase() + path.slice(1));
      setActiveDropdown("Permintaan");
      setOpenPermintaan(true);
    } else if (["sedang-berlangsung", "selesai"].includes(path)) {
      setActiveItem(
        path === "sedang-berlangsung" ? "Sedang Berlangsung" : "Selesai"
      );
      setActiveDropdown("Monitoring");
      setOpenMonitoring(true);
    } else if (path === "mapping") {
      setActiveItem("Pemetaan");
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMobileOpen(false);
    }
  };

  const handleItemClick = (item, dropdown) => {
    setActiveItem(item);
    setActiveDropdown(dropdown);
    if (dropdown === "Permintaan") {
      setOpenPermintaan(true);
    } else if (dropdown === "Monitoring") {
      setOpenMonitoring(true);
    }
  };
  const getPemetaanClassName = () => {
    const isActive = activeItem === "Pemetaan";
    const isHovered = hoveredItem === "Pemetaan";

    return `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 
      ${
        isActive || isHovered
          ? "bg-white/20 text-white translate-x-1"
          : "hover:bg-white/20 hover:text-white hover:translate-x-1"
      }`;
  };

  const getItemClassName = (item, dropdown) => {
    const isActive = activeItem === item && activeDropdown === dropdown;
    const isHovered = hoveredItem === item;

    return `block p-3 rounded-xl transition-all duration-300 text-blue-100 
      ${
        isActive || isHovered
          ? "bg-white/20 text-white translate-x-1"
          : "hover:bg-white/20 hover:text-white hover:translate-x-1"
      }`;
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isMobileOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={handleOverlayClick}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-40 h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="min-h-screen bg-slate-100 p-4">
          <div className="w-72 min-h-[calc(100vh-2rem)] bg-gradient-to-b from-blue-600 to-blue-800 p-6 text-white shadow-xl rounded-3xl relative">
            {/* Logo and Title */}
            <div className="mb-8 flex items-center gap-3">
              <Squares2X2Icon className="h-8 w-8" color="white" />
              <Typography variant="h4" className="font-bold text-white">
                Nagari Intern
              </Typography>
            </div>

            {/* Profile Card */}
            <div className="mb-8 p-4 bg-white/15 rounded-xl backdrop-blur-lg transform transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <UserCircleIcon className="h-12 w-12" />
                <div>
                  <Typography variant="h6" className="text-white font-semibold">
                    Admin Dashboard
                  </Typography>
                  <Typography variant="small" className="text-blue-100">
                    admin@nagari.com
                  </Typography>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {/* Permintaan Dropdown */}
              <button
                onClick={() => setOpenPermintaan(!openPermintaan)}
                className="flex items-center justify-between w-full p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="h-5 w-5" />
                  <span className="font-medium text-white">Permintaan</span>
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-500 ease-in-out ${
                    openPermintaan ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openPermintaan ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-7 space-y-1 pt-1">
                  {["Diproses", "Diverifikasi", "Diterima"].map((item) => (
                    <a
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      onClick={() => handleItemClick(item, "Permintaan")}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={getItemClassName(item, "Permintaan")}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Monitoring Dropdown */}
              <button
                onClick={() => setOpenMonitoring(!openMonitoring)}
                className="flex items-center justify-between w-full p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                  <span className="font-medium text-white">
                    Monitoring Peserta
                  </span>
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-500 ease-in-out ${
                    openMonitoring ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openMonitoring ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-7 space-y-1 pt-1">
                  {[
                    {
                      label: "Sedang Berlangsung",
                      path: "/sedang-berlangsung",
                    },
                    { label: "Selesai", path: "/selesai" },
                  ].map(({ label, path }) => (
                    <a
                      key={label}
                      href={path}
                      onClick={() => handleItemClick(label, "Monitoring")}
                      onMouseEnter={() => setHoveredItem(label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={getItemClassName(label, "Monitoring")}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Pemetaan Link */}
              <a
                href="/mapping"
                onClick={() => setActiveItem("Pemetaan")}
                onMouseEnter={() => setHoveredItem("Pemetaan")}
                onMouseLeave={() => setHoveredItem(null)}
                className={getPemetaanClassName()}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span className="font-medium text-white">Pemetaan</span>
              </a>

              {/* Logout Section */}
              <div className="pt-6 mt-6 border-t border-white/30">
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 font-bold hover:bg-white rounded-xl transition-all duration-300 text-red-white hover:text-red-600 hover:shadow-lg hover:scale-[1.02]"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="font-medium">Log Out</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
