import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Input,
  Tooltip,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
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
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get("http://localhost:3000/intern", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);

        const responseData = response.data.data || response.data;
        const dataArray = Array.isArray(responseData) ? responseData : [];
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
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleViewClick = (id) => {
    window.location.href = `/detail/${id}`;
  };



  



  if (error) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Card className="overflow-hidden">
                <CardBody className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              No
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Nama
                            </Typography>
                          </th>

                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Institusi
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Prodi/Jurusan
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Unit Kerja
                            </Typography>
                          </th>
                          
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Periode
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4 text-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Aksi
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageData().map((item, index) => {
                          if (!item) return null;

                          const startDate = item.tanggalMulai
                            ? new Date(
                                item.tanggalMulai
                              ).toLocaleDateString("id-ID")
                            : "-";
                          const endDate = item.tanggalSelesai
                            ? new Date(
                                item.tanggalSelesai
                              ).toLocaleDateString("id-ID")
                            : "-";

                          return (
                            <tr
                              key={item.id}
                              className="even:bg-gray-100/50"
                            >
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                >
                                  {(currentPage - 1) * itemsPerPage +
                                    index +
                                    1}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                >
                                  {item.biodata?.nama || "-"}
                                </Typography>
                              </td>

                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                >
                                  {item.institusi || "-"}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                >
                                  {item.jurusan || "-"}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                >
                                  {item.unitKerja} 
                                </Typography>
                              </td>
                            
                              <td className="p-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                >
                                  {startDate} - {endDate}
                                </Typography>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2 justify-center">
                                  <Tooltip
                                    content="Lihat detail"
                                    className="bg-blue-500"
                                  >
                                    <IconButton
                                      variant="text"
                                      color="blue"
                                      className="rounded-full"
                                      onClick={() =>
                                        handleViewClick(item.id)
                                      }
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
                                  
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredData.length === 0 && (
                          <tr>
                            <td colSpan="7" className="p-4 text-center">
                              <Typography variant="small" color="blue-gray">
                                No data found
                              </Typography>
                            </td>
                          </tr>
                        )}
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

          
            </>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default DiprosesPage;