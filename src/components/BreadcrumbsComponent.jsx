import React from "react";
import { Breadcrumbs as MTBreadcrumbs } from "@material-tailwind/react";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const routeMap = {
  "/": ["Home"],
  "/dashboard": ["Home", "Dashboard"],
  "/diproses": ["Home", "Permintaan", "Diproses"],
  "/diverifikasi": ["Home", "Permintaan", "Diverifikasi"],
  "/diterima": ["Home", "Permintaan", "Diterima"],
  "/mapping": ["Home", "Pemetaan"],
  "/anggaran": ["Home", "Anggaran"],
  "/intern/diterima/detail": ["Home", "Permintaan", "Diterima", "Detail"],
  "/diverifikasi/detail": ["Home", "Permintaan", "Diverifikasi", "Detail"],
  "/atur-jadwal-pendaftaran": ["Home", "Pengaturan Sistem", "Jadwal"],
  "/tambah-akun-cabang": ["Home", "Pengaturan Sistem", "Buat Akun Cabang"],
  "/riwayat-pendaftar-magang": ["Home", "Riwayat Pendaftar"],
  "/riwayat-pendaftar-magang/detail": ["Home", "Riwayat Pendaftar", "Detail"],
  "/monitoring-peserta-magang": ["Home", "Pengaturan Sistem","Monitoring Peserta"],
  
};

const getRouteForPaths = (paths) => {
  const pathString = paths.join("/");
  return Object.keys(routeMap).find(
    (key) => routeMap[key].join("/") === pathString
  );
};

const BreadcrumbsComponent = () => {
  const pathname = window.location.pathname;

  const getPathsForRoute = (path) => {
    // Handle the detail route with ID
    if (path.match(/^\/riwayat-pendaftar-magang\/detail\/\d+$/)) {
      return ["Home", "Riwayat Pendaftar", "Detail"];
    }
    if (path.match(/^\/detail\/\d+$/)) {
      return ["Home", "Permintaan", "Diproses", "Detail"];
    }
    return routeMap[path] || ["Home"];
  };
  

  const paths = getPathsForRoute(pathname);

  return (
    <div className="sticky top-4 z-40 bg-blue-gray-50/95 backdrop-blur-sm border border-blue-gray-100 mb-8 rounded-xl mx-4">
      <div className="py-4 flex items-center pl-5 lg:pl-4">
        <MTBreadcrumbs
          separator={
            <ChevronRightIcon className="h-4 w-4 text-blue-gray-500" />
          }
          className="bg-transparent p-0"
        >
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const currentPaths = paths.slice(0, index + 1); // Get the current path slice
            const route = getRouteForPaths(currentPaths); // Get the corresponding route

            return isLast ? (
              <span key={path} className="text-blue-gray-900 font-bold">
                {path}
              </span>
            ) : (
              <a
                key={path}
                href={route || "/"} // Use the route or fallback to "/"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-bold"
              >
                {index === 0 && <HomeIcon className="h-4 w-4" />}
                <span>{path}</span>
              </a>
            );
          })}
        </MTBreadcrumbs>
      </div>
    </div>
  );
};

export default BreadcrumbsComponent;
