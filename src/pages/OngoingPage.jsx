import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import axios from "axios";
import {
  Typography,
  Input,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { MagnifyingGlassIcon, PencilIcon } from "@heroicons/react/24/outline";
import TableComponent from "../components/TableComponent";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OngoingPage = () => {
  const [internData, setInternData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/intern/start`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setInternData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    // Add your edit logic here
    console.log("Edit clicked for ID:", id);
  };

  const columns = [
    {
      label: "No",
      accessor: "id",
    },
    {
      label: "Nama",
      accessor: "nama",
    },
    {
      label: "NIM / NISN",
      accessor: "id_number",
    },
    {
      label: "Tempat Magang",
      accessor: "tempat_magang",
    },
    {
      label: "Tanggal Mulai",
      render: (intern) =>
        format(new Date(intern.tanggal_mulai), "dd MMMM yyyy"),
    },
    {
      label: "Tanggal Selesai",
      render: (intern) =>
        format(new Date(intern.tanggal_selesai), "dd MMMM yyyy"),
    },
  ];
  // Filter data based on search term
  const filteredData = internData.filter(
    (intern) =>
      intern.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.tempat_magang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <BreadcrumbsComponent />
          <div className="p-8">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <BreadcrumbsComponent />
          <div className="p-8">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1">
        <BreadcrumbsComponent />
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="w-72">
              <Input
                type="text"
                label="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="focus:border-blue-500"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <TableComponent
                data={filteredData}
                columns={columns}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                handleViewClick={handleEdit}
                actionIcon="pencil"
                actionTooltip="Edit data"
              />
            </div>

   

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No matching records found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingPage;
