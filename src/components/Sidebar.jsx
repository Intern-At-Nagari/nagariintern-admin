import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  UserCircleIcon,
  UserGroupIcon,
  BanknotesIcon,
  ClockIcon,
  ArrowRightEndOnRectangleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openPermintaan, setOpenPermintaan] = useState(false);
  const [openPengaturan, setOpenPengaturan] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);

    const path = location.pathname.slice(1);
    if (["diproses", "diterima", "diverifikasi"].includes(path)) {
      setActiveItem(path.charAt(0).toUpperCase() + path.slice(1));
      setActiveDropdown("Permintaan");
      setOpenPermintaan(true);
    } else if (
      [
        "tambah-akun-cabang",
        "atur-jadwal-pendaftaran",
        "monitoring-peserta-magang",
      ].includes(path)
    ) {
      setActiveItem(
        path === "tambah-akun-cabang"
          ? "Buat Akun Cabang"
          : path === "atur-jadwal-pendaftaran"
          ? "Atur Jadwal Pendaftaran"
          : "Monitoring Peserta"
      );
      setActiveDropdown("Pengaturan");
      setOpenPengaturan(true);
    } else if (path === "mapping") {
      setActiveItem("Pemetaan");
    } else if (path === "anggaran") {
      setActiveItem("Anggaran");
    } else if (path === "riwayat-pendaftar-magang") {
      setActiveItem("Riwayat Pendaftar Magang");
    } else if (path === "pengambilan-data") {
      setActiveItem("Pengambilan Data");
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
    } else if (dropdown === "Pengaturan") {
      setOpenPengaturan(true);
    }
  };

  const getPemetaanClassName = () => {
    const isActive = activeItem === "Pemetaan";
    const isHovered = hoveredItem === "Pemetaan";

    return `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      isActive || isHovered
        ? "bg-white/20 text-white translate-x-1"
        : "hover:bg-white/20 hover:text-white hover:translate-x-1"
    }`;
  };

  const getAnggaranClassName = () => {
    const isActive = activeItem === "Anggaran";
    const isHovered = hoveredItem === "Anggaran";

    return `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      isActive || isHovered
        ? "bg-white/20 text-white translate-x-1"
        : "hover:bg-white/20 hover:text-white hover:translate-x-1"
    }`;
  };

  const getHistoryClassName = () => {
    const isActive = activeItem === "Riwayat Pendaftar Magang";
    const isHovered = hoveredItem === "Riwayat Pendaftar Magang";

    return `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      isActive || isHovered
        ? "bg-white/20 text-white translate-x-1"
        : "hover:bg-white/20 hover:text-white hover:translate-x-1"
    }`;
  };

  const getItemClassName = (item, dropdown) => {
    const isActive = activeItem === item && activeDropdown === dropdown;
    const isHovered = hoveredItem === item;

    return `block p-3 rounded-xl transition-all duration-300 text-blue-100 ${
      isActive || isHovered
        ? "bg-white/20 text-white translate-x-1"
        : "hover:bg-white/20 hover:text-white hover:translate-x-1"
    }`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const pengaturanItems = [
    { label: "Buat Akun Cabang", path: "/tambah-akun-cabang" },
    { label: "Atur Jadwal Pendaftaran", path: "/atur-jadwal-pendaftaran" },
    { label: "Monitoring Peserta", path: "/monitoring-peserta-magang" },
  ];

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isMobileOpen ? (
          <XMarkIcon className="h-6 w-6 text-white" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-white" />
        )}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={handleOverlayClick}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-40 h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-screen bg-slate-100 p-4 overflow-hidden">
          <div className="w-72 h-full bg-gradient-to-b from-blue-600 to-blue-800 rounded-3xl shadow-xl relative flex flex-col">
            {/* Fixed Header Section */}
            <div className="p-6">
              {/* Logo and Title */}
              <div className="mb-8 flex items-center gap-3">
                <Squares2X2Icon className="h-8 w-8 text-white" />
                <Typography variant="h4" className="font-bold text-white">
                  Nagari Intern
                </Typography>
              </div>

              {/* Profile Card */}
              <div className="mb-8 p-4 bg-white/15 rounded-xl backdrop-blur-lg transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="h-12 w-12 text-white" />
                  <div>
                    <Typography
                      variant="h6"
                      className="text-white font-semibold"
                    >
                      Admin Dashboard
                    </Typography>
                    <Typography variant="small" className="text-blue-100">
                      {userData?.email}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="space-y-2">
                {/* Permintaan Dropdown */}
                <button
                  onClick={() => setOpenPermintaan(!openPermintaan)}
                  className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${
                    activeDropdown === "Permintaan"
                      ? "bg-white/20 text-white translate-x-1"
                      : "hover:bg-white/20 hover:text-white hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <DocumentTextIcon className="h-5 w-5 text-white" />
                    <span className="font-medium text-white">Permintaan</span>
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-white transition-transform duration-500 ease-in-out ${
                      openPermintaan ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openPermintaan
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-7 space-y-1 pt-1">
                    {["Diproses", "Diterima", "Diverifikasi"].map((item) => (
                      <a
                        key={item}
                        href={`/${item.toLowerCase()}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/${item.toLowerCase()}`);
                          handleItemClick(item, "Permintaan");
                        }}
                        onMouseEnter={() => setHoveredItem(item)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={getItemClassName(item, "Permintaan")}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Pengaturan Sistem Dropdown */}
                <button
                  onClick={() => setOpenPengaturan(!openPengaturan)}
                  className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${
                    activeDropdown === "Pengaturan"
                      ? "bg-white/20 text-white translate-x-1"
                      : "hover:bg-white/20 hover:text-white hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Cog6ToothIcon className="h-5 w-5 text-white" />
                    <span className="font-medium text-white">
                      Pengaturan Sistem
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={`h-4 w-4 text-white transition-transform duration-500 ease-in-out ${
                      openPengaturan ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openPengaturan
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-7 space-y-1 pt-1">
                    {pengaturanItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.path}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.path);
                          handleItemClick(item.label, "Pengaturan");
                        }}
                        onMouseEnter={() => setHoveredItem(item.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={getItemClassName(item.label, "Pengaturan")}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Pemetaan Link */}
                <a
                  href="/mapping"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/mapping");
                    setActiveItem("Pemetaan");
                  }}
                  onMouseEnter={() => setHoveredItem("Pemetaan")}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={getPemetaanClassName()}
                >
                  <UserGroupIcon className="h-5 w-5 text-white" />
                  <span className="font-medium text-white">Pemetaan</span>
                </a>

                {/* Anggaran Link */}
                <a
                  href="/anggaran"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/anggaran");
                    setActiveItem("Anggaran");
                  }}
                  onMouseEnter={() => setHoveredItem("Anggaran")}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={getAnggaranClassName()}
                >
                  <BanknotesIcon className="h-5 w-5 text-white" />
                  <span className="font-medium text-white">Anggaran</span>
                </a>

                {/* History Link */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/riwayat-pendaftar-magang");
                    setActiveItem("Riwayat Pendaftar Magang");
                  }}
                  onMouseEnter={() =>
                    setHoveredItem("Riwayat Pendaftar Magang")
                  }
                  onMouseLeave={() => setHoveredItem(null)}
                  className={getHistoryClassName()}
                >
                  <ClockIcon className="h-5 w-5 text-white" />
                  <span className="font-medium text-white">
                    Riwayat Pendaftar
                  </span>
                </a>

                {/* Pengambilan Data Link */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/pengambilan-data");
                    setActiveItem("Pengambilan Data");
                  }}
                  onMouseEnter={() => setHoveredItem("Pengambilan Data")}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    activeItem === "Pengambilan Data" ||
                    hoveredItem === "Pengambilan Data"
                      ? "bg-white/20 text-white translate-x-1"
                      : "hover:bg-white/20 hover:text-white hover:translate-x-1"
                  }`}
                >
                  <DocumentDuplicateIcon className="h-5 w-5 text-white" />
                  <span className="font-medium text-white">
                    Pengambilan Data
                  </span>
                </a>
              </div>
            </div>

            {/* Fixed Footer Section */}
            <div className="p-6 border-t border-white/30">
              <button
                onClick={handleLogout}
                className="flex items-center text-white w-full gap-3 p-3 font-bold hover:bg-white rounded-xl transition-all duration-300 text-red-white hover:text-red-600 hover:shadow-lg hover:scale-[1.02]"
              >
                <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
