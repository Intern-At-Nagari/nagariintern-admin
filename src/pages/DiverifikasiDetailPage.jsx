import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Spinner,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Input,
  Select,
  Option,
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
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  DocumentMagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { toast } from "react-toastify";
import ModalIframe from "../components/ModalIframe";

// Print Modal Component
const PrintModal = React.memo(
  ({ open, onClose, printForm, onSubmit, onChange, type }) => {
    const handleInputChange = useCallback(
      (e, field) => {
        onChange(field, e.target.value);
      },
      [onChange]
    );

    return (
      <Dialog open={open} handler={onClose} size="md">
        <DialogHeader>Print Surat Balasan</DialogHeader>
        <DialogBody divider className="h-[40vh] overflow-y-auto">
          <div className="space-y-4">
            <Input
              label="Nomor Surat"
              value={printForm.nomorSurat}
              onChange={(e) => handleInputChange(e, "nomorSurat")}
            />
            <Input
              label="Perihal"
              value={printForm.perihal}
              onChange={(e) => handleInputChange(e, "perihal")}
            />
            <Input
              label="Pejabat"
              value={printForm.pejabat}
              onChange={(e) => handleInputChange(e, "pejabat")}
            />
            <Input
              label="Institusi"
              value={printForm.institusi}
              onChange={(e) => handleInputChange(e, "institusi")}
            />
            {type === "Perguruan Tinggi" && (
              <Input
                label="Program Studi"
                value={printForm.prodi}
                onChange={(e) => handleInputChange(e, "prodi")}
              />
            )}
            <Textarea
              label="Detail Perihal"
              value={printForm.perihal_detail}
              onChange={(e) => handleInputChange(e, "perihal_detail")}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={onClose} className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="blue" onClick={onSubmit}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }
);

// Upload Modal Component
const UploadModal = React.memo(({ open, onClose, onSubmit }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (file) {
      onSubmit(file);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Upload Surat Balasan</DialogHeader>
      <DialogBody divider>
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          label="Upload PDF Surat"
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-1">
          <span>Cancel</span>
        </Button>
        <Button
          variant="gradient"
          color="blue"
          onClick={handleSubmit}
          disabled={!file}
        >
          <span>Upload</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
});

const DiverifikasiDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, name, prodi, idInstitusi, idProdi, idUnitKerja } =
    location.state || {};

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isWaliModalOpen, setIsWaliModalOpen] = useState(false);
  const [isPribadiModalOpen, setIsPribadiModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [printForm, setPrintForm] = useState({
    nomorSurat: "",
    perihal: "",
    pejabat: "",
    institusi: "",
    prodi: "",
    perihal_detail: "",
  });

  const handlePrintFormChange = useCallback((field, value) => {
    setPrintForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [idInstitusi, idProdi, idUnitKerja]);

  useEffect(() => {
    if (participants.length > 0) {
      const participant = participants[0];
      setPrintForm((prev) => ({
        ...prev,
      }));
    }
  }, [participants, type]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url;

      if (type === "Perguruan Tinggi") {
        url = `http://localhost:3000/intern/diverifikasi/univ/${idInstitusi}/${idProdi}/${idUnitKerja}`;
      } else {
        url = `http://localhost:3000/intern/diverifikasi/smk/${idInstitusi}/${idUnitKerja}`;
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

  const handleWaliModal = () => setIsWaliModalOpen(!isWaliModalOpen);
  const handlePribadiModal = () => setIsPribadiModalOpen(!isPribadiModalOpen);

  const handlePrintSubmit = useCallback(async () => {
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
        apiUrl = `http://localhost:3000/intern/diterima/univ/${idInstitusi}/${idProdi}`;
      } else {
        apiUrl = `http://localhost:3000/intern/diterima/smk/${idInstitusi}`;
      }

      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // Important for handling binary data
      });

      // Create blob and download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "surat_magang.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Surat berhasil dibuat!");
      setPrintForm((prev) => ({
        ...prev,
        nomorSurat: "",
        institusi: "",
        prodi: "",
        perihal: "",
        pejabat: "",
        perihal_detail: "",
      }));
      handlePrintOpen();
    } catch (err) {
      console.error("Error generating letter:", err);
      if (err.response) {
        // Server responded with a status other than 200 range
        console.error("Error response:", err.response.data);
        toast.error(
          `Gagal membuat surat! ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        // Request was made but no response received
        console.error("Error request:", err.request);
        toast.error("Gagal membuat surat! No response from server.");
      } else {
        // Something else happened
        console.error("Error message:", err.message);
        toast.error(`Gagal membuat surat! ${err.message}`);
      }
    }
  }, [printForm, type, idInstitusi, idProdi]);

  const handleUpload = async (file) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fileSuratBalasan", file); // Match the field name expected by req.files
      formData.append("responseArray", JSON.stringify(participants)); // Include the responseArray

      const response = await axios.post(
        `http://localhost:3000/intern/send-surat-balasan`,
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
        console.log("Response:", response.data);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Gagal mengirim surat balasan!"
      );
      console.error("Error sending letter:", err);
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
        <Button
          color="blue"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Button>
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

        {participants.map((participant, index) => (
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
            {participant.dokumen_urls && participant.dokumen_urls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participant.dokumen_urls[0] && (
              <div className="flex gap-2">
                <Button
                variant="outlined"
                className="flex items-center gap-2 normal-case flex-1"
                onClick={() =>
                  window.open(
                  `http://localhost:3000/uploads/${participant.dokumen_urls[0]}`,
                  "_blank"
                  )
                }
                >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Surat Pernyataan Wali
                </Button>
                <Button
                variant="outlined"
                color="blue"
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedPdfUrl(
                  `http://localhost:3000/uploads/${participant.dokumen_urls[0]}`
                  );
                  handleWaliModal();
                }}
                >
                <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                </Button>
              </div>
              )}
              {participant.dokumen_urls[1] && (
              <div className="flex gap-2">
                <Button
                variant="outlined"
                className="flex items-center gap-2 normal-case flex-1"
                onClick={() =>
                  window.open(
                  `http://localhost:3000/uploads/${participant.dokumen_urls[1]}`,
                  "_blank"
                  )
                }
                >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Surat Pernyataan Pribadi
                </Button>
                <Button
                variant="outlined"
                color="blue"
                className="flex items-center gap-2"
                onClick={() => {
                  setSelectedPdfUrl(
                  `http://localhost:3000/uploads/${participant.dokumen_urls[1]}`
                  );
                  handlePribadiModal();
                }}
                >
                <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                </Button>
              </div>
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
        ))}
      </div>
      </div>
      <PrintModal
      open={printOpen}
      onClose={handlePrintOpen}
      printForm={printForm}
      onSubmit={handlePrintSubmit}
      onChange={handlePrintFormChange}
      type={type}
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
      <UploadModal
      open={uploadOpen}
      onClose={() => setUploadOpen(false)}
      onSubmit={handleUpload}
      />
    </div>
    );
};

export default DiverifikasiDetailPage;
