import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Button,
  IconButton,
  
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  PrinterIcon,
  UserIcon,
  IdentificationIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  ClockIcon,
  CalendarDaysIcon,
  ArrowUpTrayIcon,
  DocumentDuplicateIcon,
  DocumentMagnifyingGlassIcon,
  ListBulletIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import PrintModal from "../components/DiverifikasiDetail/PrintModal";
import UploadModal from "../components/DiverifikasiDetail/UploadModal";
import TableView from "../components/DiverifikasiDetail/TableView";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import ModalIframe from "../components/ModalIframe";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DiverifikasiDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, name, prodi, idInstitusi, idProdi, idUnitKerja } =
    location.state || {};

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isWaliModalOpen, setIsWaliModalOpen] = useState(false);
  const [isPribadiModalOpen, setIsPribadiModalOpen] = useState(false);
  const [isTabunganModalOpen, setTabunganModalOpen] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [printForm, setPrintForm] = useState({
    nomorSurat: "",
    perihal: "",
    pejabat: "",
    terbilang: "",
    institusi: "",
    prodi: "",
    tmptMagang: "",
  });

  const toggleView = () => setIsListView(!isListView);

  const handleDocumentView = (url) => {
    setSelectedPdfUrl(`${API_BASE_URL}/uploads/${url}`);
    handleWaliModal();
  };
  const toTitleCase = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handlePrintFormChange = useCallback((field, value) => {
    setPrintForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchData();
  }, [idInstitusi, idProdi, idUnitKerja]);

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

        }));
      }
    }, [participants, type]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url;

      if (type === "Perguruan Tinggi") {
        url = `${API_BASE_URL}/intern/diverifikasi/univ/${idInstitusi}/${idProdi}/${idUnitKerja}`;
      } else {
        url = `${API_BASE_URL}/intern/diverifikasi/smk/${idInstitusi}/${idUnitKerja}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.length > 0) {
        setParticipants(response.data);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWaliModal = () => setIsWaliModalOpen(!isWaliModalOpen);
  const handlePribadiModal = () => setIsPribadiModalOpen(!isPribadiModalOpen);
  const handleTabunganModal = () => setTabunganModalOpen(!isTabunganModalOpen);

  const handlePrintSubmit = useCallback(async () => {
    setPrintLoading(true);
    try {
      const token = localStorage.getItem("token");

      const requestBody = {
        nomorSurat: printForm.nomorSurat,
        perihal: printForm.perihal,
        pejabat: printForm.pejabat,
        terbilang: printForm.terbilang,
        institusi: printForm.institusi,
        prodi: printForm.prodi,
        tmptMagang: printForm.tmptMagang,
      };

      let apiUrl;
      if (type === "Perguruan Tinggi") {
        apiUrl = `${API_BASE_URL}/intern/diverifikasi/univ/${idInstitusi}/${idProdi}/${idUnitKerja}`;
      } else {
        apiUrl = `${API_BASE_URL}/intern/diverifikasi/smk/${idInstitusi}/${idUnitKerja}`;
      }

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "surat_pengantar.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Surat berhasil dibuat!");
      setPrintForm({
        nomorSurat: "",
        perihal: "",
        pejabat: "",
        terbilang: "",
        institusi: "",
        prodi: "",
        tmptMagang: "",
      });
      handlePrintOpen();
    } catch (err) {
      console.error("Error generating letter:", err);
      toast.error(err.response?.data?.message || "Gagal membuat surat!");
    } finally {
      setPrintLoading(false);
    }
  }, [printForm, type, idInstitusi, idProdi, idUnitKerja]);
  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-blue-gray-500 mt-1 flex-shrink-0" />
      <div>
        <dt className="font-medium text-blue-gray-700">{label}:</dt>
        <dd className="text-blue-gray-600">{value}</dd>
      </div>
    </div>
  );

  const handleUpload = async (file) => {
    setUploadLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("SuratPengantar", file);
      formData.append("responseArray", JSON.stringify(participants));

      const response = await axios.post(
        `${API_BASE_URL}/intern/send-surat-pengantar`,
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
      navigate("/diverifikasi");
    }
  };

  const handlePrintOpen = useCallback(() => {
    setPrintOpen((prev) => !prev);
  }, []);

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
                <PrinterIcon className="h-4 w-4" /> Cetak Surat Pengantar
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
                  handleDocumentView={handleDocumentView}
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

                  <div className="mt-8">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="mb-4 flex items-center gap-2"
                    >
                      <DocumentDuplicateIcon className="h-5 w-5" />
                      Surat Pernyataan
                    </Typography>
                    {participant.dokumen_urls &&
                    participant.dokumen_urls.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {participant.dokumen_urls[0] && (
                          <Button
                            variant="outlined"
                            color="blue"
                            className="flex items-center gap-2 normal-case"
                            onClick={() => {
                              setSelectedPdfUrl(
                                `${API_BASE_URL}/uploads/${participant.dokumen_urls[0]}`
                              );
                              handleWaliModal();
                            }}
                          >
                            <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                            Lihat Surat Pernyataan Wali
                          </Button>
                        )}
                        {participant.dokumen_urls[1] && (
                          <Button
                            variant="outlined"
                            color="blue"
                            className="flex items-center gap-2 normal-case"
                            onClick={() => {
                              setSelectedPdfUrl(
                                `${API_BASE_URL}/uploads/${participant.dokumen_urls[1]}`
                              );
                              handlePribadiModal();
                            }}
                          >
                            <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                            Lihat Surat Pernyataan Pribadi
                          </Button>
                        )}
                        {participant.dokumen_urls[2] && (
                          <Button
                            variant="outlined"
                            color="blue"
                            className="flex items-center gap-2 normal-case"
                            onClick={() => {
                              setSelectedPdfUrl(
                                `${API_BASE_URL}/uploads/${participant.dokumen_urls[2]}`
                              );
                              handleTabunganModal();
                            }}
                          >
                            <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                            Lihat Buku Tabungan
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Typography color="red" className="text-center">
                        Surat Pernyataan Belum Diupload
                      </Typography>
                    )}
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
      <ModalIframe
        isOpen={isWaliModalOpen}
        handleOpen={handleWaliModal}
        pdfUrl={selectedPdfUrl}
        title="Surat Pernyataan Wali"
      />
      <ModalIframe
        isOpen={isPribadiModalOpen}
        handleOpen={handlePribadiModal}
        pdfUrl={selectedPdfUrl}
        title="Surat Pernyataan Pribadi"
      />
      <ModalIframe
        isOpen={isTabunganModalOpen}
        handleOpen={handleTabunganModal}
        pdfUrl={selectedPdfUrl}
        title="File Buku Tabungan"
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

export default DiverifikasiDetailPage;