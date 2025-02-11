import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import TableComponent from "../components/TableComponent";
import CustomLoading from "../components/CustomLoading";
import endpoints from "../utils/api";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DiprosesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [types, setTypes] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
      const responseData = await endpoints.page.getDiproses();
      const dataArray = Array.isArray(responseData.data) ? responseData.data : [];
      setData(dataArray);

      // Extract unique institutions and types from the data
      const uniqueInstitutions = [
        ...new Set(dataArray.map((item) => item.institusi).filter(Boolean)),
      ];
      const uniqueTypes = [
        ...new Set(dataArray.map((item) => item.type).filter(Boolean)),
      ];

      setInstitutions(uniqueInstitutions);
      setTypes(uniqueTypes);
      } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch data"
      );
      console.error("Error details:", err);
      } finally {
      setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const handleInstitutionChange = (value) => {
    setSelectedInstitution(value);
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    if (!item || item.status.name !== "Diproses") return false;

    const matchesSearch = [
      item.biodata?.nama || "",
      item.institusi || "",
      item.type || "",
      item.status.name || "",
      item.jurusan || "",
      item.unitKerja || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType = !selectedType || item.type === selectedType;
    const matchesInstitution =
      !selectedInstitution || item.institusi === selectedInstitution;

    return matchesSearch && matchesType && matchesInstitution;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const navigate = useNavigate();
  
  const handleViewClick = (id) => {
    navigate(`/diproses/detail/${id}`);
  };
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

// Update columns definition
const columns = [
  { 
    label: "No", 
    accessor: "no"
  },
  { 
    label: "Nama", 
    accessor: "biodata.nama" 
  },
  { 
    label: "Institusi", 
    accessor: "institusi" 
  },
  { 
    label: "Prodi/Jurusan", 
    accessor: "jurusan" 
  },
  { 
    label: "Unit Kerja", 
    accessor: "unitKerja" 
  },
  { 
    label: "Periode", 
    accessor: "periode",
    render: (item) => `${item.tanggalMulai ? formatDate(item.tanggalMulai) : 'N/A'} - ${item.tanggalSelesai ? formatDate(item.tanggalSelesai) : 'N/A'}`
  },
];
return (
  <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
    <Sidebar />
    <div className="flex-1 p-6">
      <BreadcrumbsComponent />
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="relative flex w-full">
              <Input
                type="search"
                label="Cari data..."
                value={searchQuery}
                onChange={handleSearch}
                className="pr-20"
                containerProps={{
                  className: "min-w-0",
                }}
                icon={
                  <MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-500" />
                }
              />
            </div>

            <Select
              label="Filter Institusi"
              value={selectedInstitution}
              onChange={handleInstitutionChange}
              searchable
            >
              <Option value="">Semua Institusi</Option>
              {institutions.map((institution) => (
                <Option key={institution} value={institution}>
                  {institution}
                </Option>
              ))}
            </Select>

            <Select
              label="Filter Tipe"
              value={selectedType}
              onChange={handleTypeChange}
              searchable
            >
              <Option value="">Semua Tipe</Option>
              {types.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <CustomLoading/>
      ) : (
        <TableComponent
          data={filteredData}
          columns={columns}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          handleViewClick={handleViewClick}
        />
      )}
    </div>
  </div>
);
};

export default DiprosesPage;