import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Alert,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import Sidebar from '../components/Sidebar';
import BreadcrumbsComponent from '../components/BreadcrumbsComponent';
import Pagination from '../components/Pagination';

const AnggaranPage = () => {
  const [anggaranData, setAnggaranData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  const fetchData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/admin/estimate-cost', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        setLoading(false);
        // Redirect to login page or handle token refresh here
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === 'success') {
        setAnggaranData(result.data);
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

  // Pagination logic
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return anggaranData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(anggaranData.length / itemsPerPage);
  const totalEstimasiBiaya = anggaranData.reduce((total, item) => total + item.totalCost, 0);

  const handleViewClick = (item) => {
    // Handle view action here
    console.log('View item:', item);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <BreadcrumbsComponent />
        
        {error && (
          <Alert
            color="red"
            className="mb-4"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Summary Card for Total Estimasi Biaya */}
        <Card className="mb-6">
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Total Estimasi Biaya
            </Typography>
            <Typography variant="h3" color="green">
              Rp {totalEstimasiBiaya.toLocaleString()}
            </Typography>
          </CardBody>
        </Card>

        {/* Table Card */}
        <Card className="overflow-hidden">
          <CardBody className="p-0">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold leading-none"
                      >
                        No
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold leading-none"
                      >
                        Nama
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold leading-none"
                      >
                        Tanggal Mulai
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold leading-none"
                      >
                        Tanggal Selesai
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold leading-none"
                      >
                        Total Hari
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold leading-none"
                      >
                        Hari Kerja
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold leading-none"
                      >
                        Total Biaya
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-gray-100 p-4 text-start">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold leading-none"
                      >
                        Aksi
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageData().map((item, index) => (
                    <tr key={item.id} className="even:bg-gray-100/50">
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray">
                          {item.name}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray">
                          {new Date(item.startDate).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray">
                          {new Date(item.endDate).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray">
                          {item.totalDays}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray">
                          {item.workingDays}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" color="blue-gray">
                          Rp {item.totalCost.toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Tooltip
                            content="Lihat Detail"
                            className="bg-blue-500"
                          >
                            <IconButton
                              variant="text"
                              color="blue"
                              className="rounded-full"
                              onClick={() => handleViewClick(item)}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
          <Pagination
            active={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Card>
      </div>
    </div>
  );
};

export default AnggaranPage;