import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  PrinterIcon,
  ArrowUpTrayIcon,
  UserIcon,
  IdentificationIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  ClockIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import PrintModal from "../components/DiterimaDetail/PrintModal";
import UploadModal from "../components/DiterimaDetail/UploadModal";
import TableView from "../components/DiterimaDetail/TableView";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DiterimaDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, name, prodi, idInstitusi, idProdi } = location.state || {};

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [printForm, setPrintForm] = useState({
    nomorSurat: "",
    perihal: "",
    pejabat: "",
    institusi: "",
    prodi: "",
    perihal_detail: "",
  });

  const toTitleCase = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handlePrintFormChange = useCallback((field, value) => {
    setPrintForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [idInstitusi, idProdi]);

  useEffect(() => {
    if (participants.length > 0) {
      const participant = participants[0];
      setPrintForm((prev) => ({
        ...prev,
        institusi: toTitleCase(participant.institusi || ""),
        prodi:
          type === "Perguruan Tinggi"
            ? toTitleCase(participant.program_studi || "")
            : toTitleCase(participant.jurusan || ""),
        nomorSurat: prev.nomorSurat,
        perihal: prev.perihal,
        pejabat: prev.pejabat,
      }));
    }
  }, [participants, type]);

  const toggleView = () => setIsListView(!isListView);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url;

      if (type === "Perguruan Tinggi") {
        url = `${API_BASE_URL}/intern/diterima/univ/${idInstitusi}/${idProdi}`;
      } else {
        url = `${API_BASE_URL}/intern/diterima/smk/${idInstitusi}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("response:", response.data);
      setParticipants(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintSubmit = useCallback(async () => {
    setPrintLoading(true);
    try {
      const token = localStorage.getItem("token");

      let apiUrl;
      let requestBody = {
        nomorSurat: printForm.nomorSurat,
        perihal: printForm.perihal,
        pejabat: printForm.pejabat,
        prodi: printForm.prodi,
        institusi: printForm.institusi,
        perihal_detail: printForm.perihal_detail,
      };

      if (type === "Perguruan Tinggi") {
        apiUrl = `${API_BASE_URL}/intern/print/univ/${idInstitusi}/${idProdi}`;
      } else {
        apiUrl = `${API_BASE_URL}/intern/print/smk/${idInstitusi}`;
      }

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      });

      // Create blob and download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "surat_balasan.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Surat berhasil dibuat!");
      setPrintForm({
        nomorSurat: "",
        perihal: "",
        pejabat: "",
        institusi: "",
        prodi: "",
        perihal_detail: "",
      });
      handlePrintOpen();
    } catch (err) {
      console.error("Error generating letter:", err);
      toast.error(err.response?.data?.message || "Gagal membuat surat!");
    } finally {
      setPrintLoading(false);
    }
  }, [printForm, type, idInstitusi, idProdi]);

  const handleUpload = async (file) => {
    setUploadLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("SuratBalasan", file);
      formData.append("responseArray", JSON.stringify(participants));

      const response = await axios.post(
        `${API_BASE_URL}/intern/send-surat-balasan`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Surat balasan berhasil dikirim!");
        setUploadOpen(false);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Gagal mengirim surat balasan!"
      );
      console.error("Error sending letter:", err);
    } finally {
      setUploadLoading(false);
      navigate("/diterima");
    }
  };

  const handlePrintOpen = useCallback(() => {
    setPrintOpen((prev) => !prev);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-blue-gray-500 mt-1 flex-shrink-0" />
      <div>
        <dt className="font-medium text-blue-gray-700">{label}:</dt>
        <dd className="text-blue-gray-600">{value}</dd>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 flex items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h6" color="red" className="mb-2">
            {error}
          </Typography>
          <Button onClick={fetchData} color="blue">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!participants || participants.length === 0) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 flex items-center justify-center">
        <Typography variant="h6" color="red">
          No participants found
        </Typography>
      </div>
    );
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Button
                color="blue"
                className="flex items-center gap-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeftIcon className="h-4 w-4" /> Back
              </Button>
              <IconButton color="blue" onClick={toggleView}>
                {isListView ? (
                  <ViewColumnsIcon className="h-4 w-4" />
                ) : (
                  <ListBulletIcon className="h-4 w-4" />
                )}
              </IconButton>
            </div>
            <div className="flex gap-2">
              <Button
                color="blue"
                className="flex items-center gap-2"
                onClick={handlePrintOpen}
              >
                <PrinterIcon className="h-4 w-4" /> Cetak Surat Balasan
              </Button>
              <Button
                color="green"
                className="flex items-center gap-2"
                onClick={() => setUploadOpen(true)}
              >
                <ArrowUpTrayIcon className="h-4 w-4" /> Upload Surat
              </Button>
            </div>
          </div>

          <Typography variant="h5" color="blue-gray" className="mb-4">
            {name} - {prodi !== "-" ? prodi : "All Programs"}
          </Typography>

          {isListView ? (
            <Card className="shadow-lg">
              <CardBody>
                <TableView
                  participants={participants}
                  type={type}
                  formatDate={formatDate}
                />
              </CardBody>
            </Card>
          ) : (
            participants.map((participant, index) => (
              <Card key={index} className="mb-4 shadow-lg">
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="mb-4 flex items-center gap-2"
                      >
                        <UserIcon className="h-5 w-5" />
                        Informasi Pribadi
                      </Typography>
                      <dl className="space-y-4">
                        <InfoItem
                          icon={UserIcon}
                          label="Nama"
                          value={participant.nama_peserta}
                        />
                        <InfoItem
                          icon={IdentificationIcon}
                          label={type === "Perguruan Tinggi" ? "NIM" : "NISN"}
                          value={
                            type === "Perguruan Tinggi"
                              ? participant.nim
                              : participant.nisn
                          }
                        />
                        <InfoItem
                          icon={EnvelopeIcon}
                          label="Email"
                          value={participant.email}
                        />
                        <InfoItem
                          icon={PhoneIcon}
                          label="No. HP"
                          value={participant.no_hp}
                        />
                        <InfoItem
                          icon={MapPinIcon}
                          label="Alamat"
                          value={participant.alamat}
                        />
                      </dl>
                    </div>

                    <div className="space-y-6">
                      <Typography
                        variant="h6"
                        color="blue-gray"
                        className="mb-4 flex items-center gap-2"
                      >
                        <AcademicCapIcon className="h-5 w-5" />
                        Informasi Akademik
                      </Typography>
                      <dl className="space-y-4">
                        <InfoItem
                          icon={BuildingOfficeIcon}
                          label="Institusi"
                          value={participant.institusi}
                        />
                        <InfoItem
                          icon={AcademicCapIcon}
                          label={
                            type === "Perguruan Tinggi"
                              ? "Program Studi"
                              : "Jurusan"
                          }
                          value={
                            type === "Perguruan Tinggi"
                              ? participant.program_studi
                              : participant.jurusan
                          }
                        />
                        <InfoItem
                          icon={BuildingOffice2Icon}
                          label="Unit Kerja"
                          value={participant.unit_kerja}
                        />
                        <InfoItem
                          icon={CalendarIcon}
                          label="Tanggal Mulai"
                          value={formatDate(participant.tanggal_mulai)}
                        />
                        <InfoItem
                          icon={ClockIcon}
                          label="Tanggal Selesai"
                          value={formatDate(participant.tanggal_selesai)}
                        />
                        <InfoItem
                          icon={CalendarDaysIcon}
                          label="Tanggal Daftar"
                          value={formatDate(participant.tanggal_daftar)}
                        />
                      </dl>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
      <PrintModal
        open={printOpen}
        onClose={handlePrintOpen}
        printForm={printForm}
        onSubmit={handlePrintSubmit}
        onChange={handlePrintFormChange}
        type={type}
        isLoading={printLoading}
      />
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleUpload}
        isLoading={uploadLoading}
      />
    </div>
  );
};

export default DiterimaDetailPage;