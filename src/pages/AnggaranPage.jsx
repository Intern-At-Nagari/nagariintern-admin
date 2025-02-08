import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, CurrencyDollarIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Sidebar from '../components/Sidebar';
import BreadcrumbsComponent from '../components/BreadcrumbsComponent';
import Pagination from '../components/Pagination';
import CustomLoading from '../components/CustomLoading';
import TableComponent from '../components/TableComponent';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AnggaranPage = () => {
  const [anggaranData, setAnggaranData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/absensi/rekap`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        setAnggaranData(result.data);
        setFilteredData(result.data);
        setError(null);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter by search term first
    const searchFiltered = anggaranData.filter(item =>
      Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    // Then filter by current month
    const monthFiltered = searchFiltered.filter(item => {
      const monthNumber = getMonthNumber(item.bulan);
      return monthNumber === currentMonth;
    });
    
    setFilteredData(monthFiltered);
    setCurrentPage(1);
  }, [searchTerm, anggaranData, currentMonth]);

  // Helper function to convert month name to number
  const getMonthNumber = (monthName) => {
    const months = {
      'januari': 1, 'februari': 2, 'maret': 3, 'april': 4,
      'mei': 5, 'juni': 6, 'juli': 7, 'agustus': 8,
      'september': 9, 'oktober': 10, 'november': 11, 'desember': 12
    };
    return months[monthName.toLowerCase()];
  };

  // Get month name from number
  const getMonthName = (monthNumber) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[monthNumber - 1];
  };

  // Pagination logic
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const totalEstimasiBiaya = filteredData.reduce((total, item) => 
    total + parseInt(item.total_biaya.replace(/\./g, '')), 0
  );

  const columns = [
    {
      label: "No",
      accessor: "id",
    },
    {
      label: "Unit Kerja",
      accessor: "unit_kerja",
    },
    {
      label: "Bulan",
      accessor: "bulan",
    },
    {
      label: "Tahun",
      accessor: "tahun",
    },
    {
      label: "Total Peserta",
      accessor: "total_peserta",
    },
    {
      label: "Total Biaya",
      render: (item) => `Rp ${item.total_biaya.toLocaleString('id-ID')}`,
    },
  ];

  const handleViewClick = (item) => {
    console.log("Viewing details for:", item);
    // Add your view logic here
  };

  const SearchInput = () => (
    <div className="relative">
      <input
        type="text"
        placeholder="Cari data anggaran..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 pr-12 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
      />
      <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
  );

  const MonthSelector = () => (
    <div className="relative">
      <select
        value={currentMonth}
        onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
        className="w-full px-4 py-2 text-sm border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer pr-10"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option 
            key={month} 
            value={month}
            className="py-2"
          >
            {getMonthName(month)}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );

  if (loading) return <CustomLoading />;

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <BreadcrumbsComponent />
        
        {error && (
          <Alert color="red" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-1 font-medium">
                    Biaya Bulan {getMonthName(currentMonth)}
                  </Typography>
                  <Typography variant="h3" color="green" className="font-bold">
                    Rp {totalEstimasiBiaya.toLocaleString('id-ID')}
                  </Typography>
                </div>
                <div className="p-4 bg-green-100 rounded-full">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardBody className="p-6">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Pencarian
                  </Typography>
                  <SearchInput />
                </div>
                <div className="space-y-2">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Pilih Bulan
                  </Typography>
                  <MonthSelector />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <TableComponent
            data={getCurrentPageData()}
            columns={columns}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            handleViewClick={handleViewClick}
            actionIcon="eye"
            actionTooltip="Lihat detail anggaran"
          />
          
          {totalPages > 1 && (
            <Card className="shadow-lg">
              <Pagination
                active={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnggaranPage;