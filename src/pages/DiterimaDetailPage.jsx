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
  IconButton,
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
  DocumentIcon,
  XMarkIcon,
  ViewColumnsIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { toast } from "react-toastify";
import AnimatedButton from "../components/AnimatedButton";
import Pagination from "../components/Pagination";


// Print Modal Component
const PrintModal = React.memo(
  ({ open, onClose, printForm, onSubmit, onChange, type, isLoading }) => {
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
        <DialogFooter className="space-x-2">
          <Button variant="text" color="red" onClick={onClose}>
            Cancel
          </Button>
          <AnimatedButton
            onClick={onSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Confirm
          </AnimatedButton>
        </DialogFooter>
      </Dialog>
    );
  }
);

// Upload Modal Component
const UploadModal = React.memo(({ open, onClose, onSubmit, isLoading }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 5242880) {
      setFile(selectedFile);
    } else {
      toast.error("File size should be less than 5MB");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      if (droppedFile.size <= 5242880) {
        setFile(droppedFile);
      } else {
        toast.error("File size should be less than 5MB");
      }
    } else {
      toast.error("Please upload PDF file only");
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Upload Surat Balasan</DialogHeader>
      <DialogBody divider>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center">
            <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm text-gray-600 justify-center">
              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                <span>Upload a file</span>
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF up to 5MB</p>
          </div>
          {file && (
            <div className="mt-4 flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <DocumentIcon className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-sm text-gray-500">{file.name}</span>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" color="red" onClick={onClose}>
          Cancel
        </Button>
        <AnimatedButton
          onClick={() => onSubmit(file)}
          disabled={!file || isLoading}
          isLoading={isLoading}
        >
          Upload
        </AnimatedButton>
      </DialogFooter>
    </Dialog>
  );
});

const TableView = ({ participants, type, formatDate }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          {[
            "No",
            "Nama",
            type === "Perguruan Tinggi" ? "NIM" : "NISN",
            "Email",
            "No. HP",
            "Unit Kerja",
            "Periode",
          ].map((head) => (
            <th
              key={head}
              className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                {head}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {participants.map((participant, index) => (
          <tr key={index} className="even:bg-blue-gray-50/50">
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {index + 1}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {participant.nama_peserta}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {type === "Perguruan Tinggi"
                  ? participant.nim
                  : participant.nisn}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {participant.email}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {participant.no_hp}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {participant.unit_kerja}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {formatDate(participant.tanggal_mulai)} -{" "}
                {formatDate(participant.tanggal_selesai)}
              </Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

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
        url = `http://localhost:3000/intern/diterima/univ/${idInstitusi}/${idProdi}`;
      } else {
        url = `http://localhost:3000/intern/diterima/smk/${idInstitusi}`;
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
    } finally {
      setPrintLoading(false);
    }
  }, [printForm, type, idInstitusi, idProdi]);

  const handleUpload = async (file) => {
    setUploadLoading(true);
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
    } finally {
      setUploadLoading(false);
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
              
            )
          )
            
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
