import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import axios from "axios";
import {
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import TableComponent from "../components/TableComponent";
import CustomLoading from "../components/CustomLoading";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OngoingPage = () => {
  const [internData, setInternData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [newEndDate, setNewEndDate] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/superadmin/interns/start`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInternData(response.data);
      console.log("Data fetched:", response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };
  const handleEdit = (itemId) => {
    try {
      console.log("Edit ID:", itemId);
      console.log("Current internData:", internData); // Add this to debug

      // Find the intern with matching id from internData
      const intern = internData.find((item) => item.id === itemId);
      console.log("Found intern:", intern);

      // Check if intern exists and has an id
      if (!intern) {
        console.log("No intern found with id:", itemId); // Add this debug log
        toast.error("Data intern tidak ditemukan");
        return;
      }

      setSelectedIntern(intern);
      const formattedDate = format(
        new Date(intern.tanggal_selesai),
        "yyyy-MM-dd"
      );
      setNewEndDate(formattedDate);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
      toast.error("Terjadi kesalahan saat membuka data");
    }
  };
  const handleUpdateEndDate = async () => {
    if (!selectedIntern?.id || !newEndDate) {
      toast.error("Data tidak lengkap");
      return;
    }

    setUpdateLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.patch(
        `${API_BASE_URL}/superadmin/interns/ongoing/${selectedIntern.id}`,
        {
          tanggalSelesai: newEndDate, // Match backend parameter name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        await fetchData();
        setIsModalOpen(false);
        toast.success(
          response.data.message || "Tanggal selesai berhasil diperbarui"
        );
      } else {
        throw new Error(response.data.message || "Failed to update end date");
      }
    } catch (error) {
      console.error("Failed to update end date:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Gagal memperbarui tanggal selesai"
      );
    } finally {
      setUpdateLoading(false);
    }
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
    setCurrentPage(1);
  };

  if (loading) {
    return <CustomLoading />;
  }

  const renderContent = () => (
    <div className="flex-1 p-6">
      <BreadcrumbsComponent />
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
          <Input
            type="text"
            label="Search"
            value={searchTerm}
            onChange={handleSearch}
            className="focus:border-blue-500"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
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
              handleViewClick={handleEdit} // Pass the function directly
              actionIcon="pencil"
              actionTooltip="Edit tanggal selesai"
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
  );

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      {error ? (
        <div className="flex-1 p-6">
          <div className="text-red-500">Error: {error}</div>
        </div>
      ) : (
        renderContent()
      )}

      {/* Edit Modal */}
      <Dialog open={isModalOpen} handler={() => setIsModalOpen(false)}>
        <DialogHeader>Perbarui Tanggal Selesai Magang</DialogHeader>
        <DialogBody>
          {selectedIntern && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nama Peserta</p>
                <p className="font-medium">{selectedIntern.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIM/NISN</p>
                <p className="font-medium">{selectedIntern.id_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Tanggal Selesai Saat Ini
                </p>
                <p className="font-medium">
                  {format(
                    new Date(selectedIntern.tanggal_selesai),
                    "dd MMMM yyyy"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Selesai Baru</p>
                <Input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="mt-1"
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsModalOpen(false)}
            className="mr-1"
            disabled={updateLoading}
          >
            Batal
          </Button>
          <Button
            variant="gradient"
            color="blue"
            onClick={handleUpdateEndDate}
            disabled={updateLoading}
          >
            {updateLoading ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                <span>Memperbarui...</span>
              </div>
            ) : (
              "Simpan"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default OngoingPage;
