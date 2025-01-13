import React from 'react';
import { Breadcrumbs as MTBreadcrumbs } from "@material-tailwind/react";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const routeMap = {
  '/': ['Home'],
  '/dashboard': ['Home', 'Dashboard'],
  '/diproses': ['Home', 'Permintaan', 'Diproses'],
  '/diverifikasi': ['Home', 'Permintaan', 'Diverifikasi'],
  '/diterima': ['Home', 'Permintaan', 'Diterima'],
  '/sedang-berlangsung': ['Home', 'Monitoring Peserta', 'Sedang Berlangsung'],
  '/monitoring/completed': ['Home', 'Monitoring Peserta', 'Selesai'],
  '/mapping': ['Home', 'Pemetaan'],
  '/detail': ['Home', 'Permintaan','Detail'],
  '/selesai': ['Home','Monitoring', 'Selesai'],
  '/cetak-sertif': ['Home', 'Cetak Sertifikat']
};

const BreadcrumbsComponent = () => {
  const pathname = window.location.pathname;
  const paths = routeMap[pathname] || ['Home'];

  return (
    <div className="sticky top-4 z-40 bg-blue-gray-50/95 backdrop-blur-sm border border-blue-gray-100 mb-8 rounded-xl mx-4">
      <div className="py-4 flex items-center pl-8 lg:pl-4">
        <MTBreadcrumbs
          separator={<ChevronRightIcon className="h-4 w-4 text-blue-gray-500" />}
          className="bg-transparent p-0"
        >
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            return isLast ? (
              <span key={path} className="text-blue-gray-900 font-medium">
                {path}
              </span>
            ) : (
              <a
                key={path}
                href={index === 0 ? "/dashboard" : "#"}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
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