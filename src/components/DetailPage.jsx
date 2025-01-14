import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
} from "@material-tailwind/react";
import {
  DocumentArrowDownIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "./Sidebar";
import ApprovalModal from "./ApprovalModal";
import BreadcrumbsComponent from "./BreadcrumbsComponent";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/intern/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch intern details");
        console.error("Error fetching data:", err);
        console.log("err.response");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "diterima":
        return "text-green-500 bg-green-50";
      case "ditolak":
        return "text-red-500 bg-red-50";
      case "menunggu":
        return "text-yellow-500 bg-yellow-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const handleModalOpen = (type = null) => {
    setModalState({
      isOpen: !modalState.isOpen,
      type,
    });
  };

  const handleSubmit = async (notes) => {
    try {
      const action = modalState.type === 'accept' ? 'approve' : 'reject';
      await axios.put(`http://localhost:3000/intern/${id}/${action}`, 
        { notes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Refresh data after update
      const response = await axios.get(`http://localhost:3000/intern/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data);
      handleModalOpen();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      console.error("Error updating status:", err);
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:3000/download/${fileName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to download file");
      console.error("Error downloading file:", err);
    }
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'N/A'}
    </span>
  );

  if (loading) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 p-4">
        <Alert color="red">{error}</Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 p-4">
        <Alert color="blue">No data found</Alert>
      </div>
    );
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardBody className="p-4 md:p-6">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Status Permohonan
                </Typography>
                <StatusBadge status={data.statusPermohonan} />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 md:p-6">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Status PSDM
                </Typography>
                <StatusBadge status={data.statusPersetujuanPSDM} />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="p-4 md:p-6">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Status Pimpinan
                </Typography>
                <StatusBadge status={data.statusPersetujuanPimpinan} />
              </CardBody>
            </Card>
          </div>

          {/* Main Information Card */}
          <Card>
            <CardBody className="p-4 md:p-6">
              {/* Personal Information */}
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Informasi Pendaftar
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Tipe Pemohon
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {data.tipePemohon?.charAt(0).toUpperCase() + data.tipePemohon?.slice(1)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Institusi & Jurusan
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {data.institusi} - {data.jurusan}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <PhoneIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Nomor HP
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {data.noHp}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Periode Magang
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {formatDate(data.tanggalMulai)} - {formatDate(data.tanggalSelesai)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Tanggal Pengajuan
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {formatDate(data.tanggalPengajuan)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Departemen
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {data.departemen?.toUpperCase()}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Dokumen Pendukung
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { name: "CV", file: data.fileCv },
                  { name: "KTP", file: data.fileKtp },
                  { name: "Surat Pengantar", file: data.fileSuratPengantar },
                  { name: "Transkrip", file: data.fileTranskrip },
                ].map((doc) => (
                  <Button
                    key={doc.name}
                    variant="outlined"
                    className="flex items-center gap-3 normal-case"
                    onClick={() => handleDownload(doc.file)}
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    Download {doc.name}
                  </Button>
                ))}
              </div>

              {/* Action Buttons */}
              {data.statusPermohonan === "menunggu" && (
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 pt-6 border-t">
                  <Button
                    variant="outlined"
                    color="red"
                    className="flex items-center gap-2"
                    onClick={() => handleModalOpen("reject")}
                  >
                    Tolak
                  </Button>
                  <Button
                    variant="filled"
                    color="green"
                    className="flex items-center gap-2"
                    onClick={() => handleModalOpen("accept")}
                  >
                    Terima
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
      
      <ApprovalModal
        open={modalState.isOpen}
        handleOpen={() => handleModalOpen()}
        onSubmit={handleSubmit}
        type={modalState.type}
      />
    </div>
  );
};

export default DetailPage;