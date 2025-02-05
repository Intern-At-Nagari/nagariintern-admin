import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Input,
  Spinner,
  Tooltip,
  Button,
  Dialog,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

const DiterimaPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({
    universities: [],
    schools: [],
    participantDetails: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(10); // Items per page

  // Add new states for modal
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false); // Add new state for download loading

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/intern/diterima`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Data fetched:", response.data);
      setData(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Access denied. Please login again.");
      } else {
        setError("Failed to fetch data. Please try again later.");
      }
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const navigate = useNavigate();

  const filteredData = [
    ...data.universities.flatMap((uni) =>
      uni.prodi.map((prodi) => ({
        type: "Perguruan Tinggi",
        name: uni.nama_institusi,
        prodi: prodi.nama_prodi,
        total: prodi.total_diterima,
        idInstitusi: uni.id_univ,
        idProdi: prodi.id_prodi,
      }))
    ),
    ...data.schools.map((school) => ({
      type: "Sekolah",
      name: school.nama_institusi,
      prodi: "-",
      total: school.total_diterima,
      idInstitusi: school.id_smk,
      idProdi: null,
    })),
  ].filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prodi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Add handlers for modal
  const handlePrintOpen = () => setOpenPrintModal(true);
  const handlePrintClose = () => {
    setOpenPrintModal(false);
    setSelectedTypes([]);
  };

  const handleTypeSelect = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handlePrint = async () => {
    setIsGenerating(true);
    const token = localStorage.getItem("token");

    try {
      for (const type of selectedTypes) {
        const url =
          type === "mahasiswa"
            ? `${API_BASE_URL}/generate-lampiran-rekomen-mhs`
            : `${API_BASE_URL}/generate-lampiran-rekomen-siswa`;

        const response = await axios({
          url,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for file download
        });

        // Create download link
        const downloadUrl = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `lampiran_${type}.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      handlePrintClose();
    } catch (error) {
      console.error("Error generating document:", error);
      alert("Gagal menghasilkan dokumen. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
      toast.success("Dokumen berhasil digenerate.");
    }
  };

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button
                color="blue"
                className="flex items-center gap-2"
                onClick={handlePrintOpen}
              >
                <PrinterIcon className="h-4 w-4" /> Cetak Lampiran Rekomendasi
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="relative flex w-full max-w-[24rem]">
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
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
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
                            Tipe Institusi
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            Nama Institusi
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            Program Studi
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            Total Diterima
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
                      {currentItems.map((item, index) => (
                        <tr key={index} className="even:bg-gray-100/50">
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {indexOfFirstItem + index + 1}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {item.type}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {item.name}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {item.prodi}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {item.total}
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
                                    navigate(`/intern/diterima/detail`, {
                                      state: {
                                        type: item.type,
                                        name: item.name,
                                        prodi: item.prodi,
                                        idInstitusi: item.idInstitusi,
                                        idProdi: item.idProdi,
                                      },
                                    })
                                  }
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredData.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-4 text-center">
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
              {/* Pagination Component */}
              <Pagination
                active={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </Card>
          )}
        </div>
      </div>

      {/* Add Print Modal */}
      <Dialog open={openPrintModal} handler={handlePrintClose}>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Pilih Tipe Lampiran</h3>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTypes.includes("mahasiswa")}
                onChange={() => handleTypeSelect("mahasiswa")}
                className="form-checkbox"
              />
              <span>Lampiran Mahasiswa</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTypes.includes("siswa")}
                onChange={() => handleTypeSelect("siswa")}
                className="form-checkbox"
              />
              <span>Lampiran Siswa</span>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="text" color="red" onClick={handlePrintClose}>
              Cancel
            </Button>
            <Button color="blue" onClick={handlePrint} disabled={isGenerating}>
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Generating...
                </div>
              ) : (
                "Cetak"
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DiterimaPage;
