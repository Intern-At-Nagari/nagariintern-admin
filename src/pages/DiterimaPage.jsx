import React, { useState, useEffect } from "react";
import {
  Input,
  Spinner,
  Button,
  Dialog,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TableComponent from "../components/TableComponent";
import CustomLoading from "../components/CustomLoading";
import endpoints from "../utils/api";


const DiterimaPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({
    universities: [],
    schools: [],
    participantDetails: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await endpoints.page.getDiterima();
      console.log("Data fetched:", response);
      setData(response);
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
    ...data.universities.flatMap((uni, index) =>
      uni.prodi.map((prodi) => ({
        id: `uni-${uni.id_univ}-${prodi.id_prodi}`, // Add unique id
        type: "Perguruan Tinggi",
        name: uni.nama_institusi,
        prodi: prodi.nama_prodi,
        total: prodi.total_diterima,
        idInstitusi: uni.id_univ,
        idProdi: prodi.id_prodi,
      }))
    ),
    ...data.schools.map((school, index) => ({
      id: `school-${school.id_smk}`, // Add unique id
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

  const handleViewDetail = (item) => {
    if (!item) {
      console.error("Item is undefined");
      toast.error("Error accessing data. Please try again.");
      return;
    }

    navigate(`/intern/diterima/detail`, {
      state: {
        type: item.type,
        name: item.name,
        prodi: item.prodi,
        idInstitusi: item.idInstitusi,
        idProdi: item.idProdi,
      },
    });
  };

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      const responses = await endpoints.generateDocument.lampiranRekomen(selectedTypes);
      
      // Process each response and create download links
      responses.forEach((response, index) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `lampiran_${selectedTypes[index]}.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });

      handlePrintClose();
      toast.success("Dokumen berhasil digenerate.");
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Gagal menghasilkan dokumen. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const columns = [
    { label: "No" },
    { label: "Tipe Institusi", accessor: "type" },
    { label: "Nama Institusi", accessor: "name" },
    { label: "Program Studi", accessor: "prodi" },
    { label: "Total Diterima", accessor: "total" },
  ];
  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
          <BreadcrumbsComponent />
          <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
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
            <CustomLoading/>
          ) : (
            <TableComponent
              data={filteredData}
              columns={columns}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              actionIcon="eye"
              actionTooltip="Lihat detail"
              handleViewClick={(id) => {
                const item = filteredData.find((item) => item.id === id);
                if (item) {
                  navigate(`/intern/diterima/detail`, {
                    state: {
                      type: item.type,
                      name: item.name,
                      prodi: item.prodi,
                      idInstitusi: item.idInstitusi,
                      idProdi: item.idProdi,
                    },
                  });
                } else {
                  console.error("Item not found for id:", id);
                  toast.error("Error accessing data. Please try again.");
                }
              }}
            />
          )}
        
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
