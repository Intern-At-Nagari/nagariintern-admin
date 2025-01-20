import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  PlusIcon,
} from "@heroicons/react/24/outline";
import Modal from '../components/Modal';
import Sidebar from '../components/Sidebar';
import BreadcrumbsComponent from '../components/BreadcrumbsComponent';

const AnggaranPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sample data - replace with actual data from your backend
  const [anggaranData, setAnggaranData] = useState([
    { bulan: "Januari", jumlahPeserta: 10, estimasiBiaya: 5000000 },
    { bulan: "Februari", jumlahPeserta: 12, estimasiBiaya: 6000000 },
  ]);

  const handleModalSubmit = (data) => {
    setAnggaranData([...anggaranData, data]);
  };

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <BreadcrumbsComponent />
        
        <Card>
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Estimasi Anggaran Peserta Magang
                </Typography>
              </div>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusIcon className="h-4 w-4" /> Tambah Anggaran
              </Button>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Bulan</th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Jumlah Peserta</th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Estimasi Biaya</th>
                </tr>
              </thead>
              <tbody>
                {anggaranData.map((item, index) => (
                  <tr key={index}>
                    <td className="p-4 border-b border-blue-gray-50">{item.bulan}</td>
                    <td className="p-4 border-b border-blue-gray-50">{item.jumlahPeserta}</td>
                    <td className="p-4 border-b border-blue-gray-50">
                      Rp {item.estimasiBiaya.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Modal
          open={isModalOpen}
          handleOpen={() => setIsModalOpen(!isModalOpen)}
          onSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
};

export default AnggaranPage;