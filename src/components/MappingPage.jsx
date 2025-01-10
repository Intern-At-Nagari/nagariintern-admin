import React from 'react';
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChevronRightIcon,
  MapPinIcon,
  UsersIcon
} from "@heroicons/react/24/outline";
import Sidebar from './Sidebar';
import BreadcrumbsComponent from './BreadcrumbsComponent';

const MappingPage = () => {
  const branchData = [
    { branch: 'Alahan Panjang', interns: 3 },
    { branch: 'Bandung', interns: 5 },
    { branch: 'Batusangkar', interns: 4 },
    { branch: 'Bukittinggi', interns: 6 },
    { branch: 'Jakarta', interns: 8 },
    { branch: 'Koto Baru', interns: 2 },
    { branch: 'Padang Panjang', interns: 4 },
    { branch: 'Pariaman', interns: 3 },
    { branch: 'Payakumbuh', interns: 5 },
    { branch: 'Solok', interns: 4 }
  ];

  const totalInterns = branchData.reduce((sum, branch) => sum + branch.interns, 0);

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      
      {/* Sticky Header */}
     

      {/* Main Content */}
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
        <BreadcrumbsComponent />
          <Typography variant="h3" className="mb-8 font-bold text-gray-800 text-2xl md:text-3xl">
            Pemetaan Peserta Magang
          </Typography>

          {/* Summary Card */}
          <Card className="mb-8 shadow-lg">
            <CardBody className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
              <div className="rounded-xl p-3 bg-blue-500 shadow-blue-500/20 shadow-lg">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Total Peserta Magang
                </Typography>
                <Typography variant="h4" className="font-bold">
                  {totalInterns} Peserta
                </Typography>
              </div>
            </CardBody>
          </Card>

          {/* Branch Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {branchData.map((branch, index) => (
              <Card 
                key={index} 
                className="transform transition-all duration-300 hover:scale-105"
              >
                <CardBody className="flex items-center gap-4 p-4 md:p-6">
                  <div className="rounded-xl p-3 bg-blue-500 shadow-blue-500/20 shadow-md">
                    <MapPinIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h6" color="blue-gray" className="font-medium">
                      {branch.branch}
                    </Typography>
                    <Typography className="text-gray-700 text-lg font-bold">
                      {branch.interns} Peserta
                    </Typography>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappingPage;