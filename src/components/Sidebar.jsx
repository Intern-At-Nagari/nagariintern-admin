import React from 'react';
import {
  UserCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";

const Sidebar = () => {
  const [openPermintaan, setOpenPermintaan] = React.useState(true);
  const [openMonitoring, setOpenMonitoring] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="w-72 min-h-[calc(100vh-2rem)] bg-gradient-to-b from-blue-600 to-blue-800 p-6 text-white shadow-xl rounded-3xl">
        <div className="mb-8 flex items-center gap-3">
          <Squares2X2Icon className="h-8 w-8" color='white' />
          <Typography variant="h4" className="font-bold text-white">
            Nagari Intern
          </Typography>
        </div>

        <div className="mb-8 p-4 bg-white/15 rounded-xl backdrop-blur-lg transform transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-3">
            <UserCircleIcon className="h-12 w-12" />
            <div>
              <Typography variant="h6" className="text-white font-semibold">Admin Dashboard</Typography>
              <Typography variant="small" className="text-blue-100">
                admin@nagari.com
              </Typography>
            </div>
          </div>
        </div>

        <div className="space-y-2">
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
                  href="#"
                  className="block p-3 hover:bg-white/20 rounded-xl transition-all duration-300 text-blue-100 hover:text-white hover:translate-x-1"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <button
            onClick={() => setOpenMonitoring(!openMonitoring)}
            className="flex items-center justify-between w-full p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <ClipboardDocumentCheckIcon className="h-5 w-5" />
              <span className="font-medium text-white">Monitoring Peserta</span>
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
              {["Sedang Berlangsung", "Selesai"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block p-3 hover:bg-white/20 rounded-xl transition-all duration-300 text-blue-100 hover:text-white hover:translate-x-1"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          <a 
            href="#" 
            className="flex items-center gap-3 p-3 hover:bg-white/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span className="font-medium text-white">Pemetaan</span>
          </a>

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
  );
};

export default Sidebar;