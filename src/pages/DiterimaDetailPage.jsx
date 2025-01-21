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
  Option
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
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import { branches } from "../Data/Unit";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { toast } from "react-toastify";



// Print Modal Component
const PrintModal = React.memo(({ 
  open, 
  onClose, 
  printForm, 
  onSubmit, 
  onChange 
}) => {
  const handleInputChange = useCallback((e, field) => {
    onChange(field, e.target.value);
  }, [onChange]);

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader>Print Surat Balasan</DialogHeader>
      <DialogBody divider className="h-[40vh] overflow-y-auto">
        <div className="space-y-4">
          <Input
            label="Nomor Surat"
            value={printForm.nomorSurat}
            onChange={(e) => handleInputChange(e, 'nomorSurat')}
          />
          <Input
            label="Perihal"
            value={printForm.perihal}
            onChange={(e) => handleInputChange(e, 'perihal')}
          />
          <Input
            label="Pejabat"
            value={printForm.pejabat}
            onChange={(e) => handleInputChange(e, 'pejabat')}
          />
          <Input
            label="Institusi"
            value={printForm.institusi}
            onChange={(e) => handleInputChange(e, 'institusi')}
          />
          <Input
            label="Program Studi"
            value={printForm.prodi}
            onChange={(e) => handleInputChange(e, 'prodi')}
          />
          <Textarea
            label="Detail Perihal"
            value={printForm.perihal_detail}
            onChange={(e) => handleInputChange(e, 'perihal_detail')}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={onClose}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="blue" onClick={onSubmit}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
});


const DiterimaDetailPage = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [printOpen, setPrintOpen] = useState(false);
  const [printForm, setPrintForm] = useState({
    nomorSurat: "",
    perihal: "",
    pejabat: "",
    institusi: "",
    prodi: "",
    perihal_detail: "",
  });


  const handlePrintFormChange = useCallback((field, value) => {
    setPrintForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { type, name, prodi, idInstitusi, idProdi } = location.state || {};

  useEffect(() => {
    fetchData();
  }, [idInstitusi, idProdi]);

  useEffect(() => {
    if (participants.length > 0) {
      const participant = participants[0];
      setPrintForm(prev => ({
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
    try {
      // Add console logs to show form data
      console.log("Submitting form with data:");
      console.log("printForm:", printForm);
      console.log("type:", type);
      console.log("idInstitusi:", idInstitusi);
      console.log("idProdi:", idProdi);
  
      const token = localStorage.getItem("token");
      
      let apiUrl;
      if (type === "Perguruan Tinggi") {
        apiUrl = `http://localhost:3000/intern/diterima/univ/${idInstitusi}/${idProdi}`;
      } else {
        apiUrl = `http://localhost:3000/intern/diterima/smk/${idInstitusi}`;
      }
  
      // Make POST request without responseType: 'blob'
      const response = await axios.post(
        apiUrl,
        printForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
  
      // Show success message (assuming you have some notification system)
      // For example with toast:
      toast.success("Surat berhasil dibuat!");
      
      // Reset form
      setPrintForm(prev => ({
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
      toast.error("Gagal membuat surat!");
    }
  }, [printForm, type, idInstitusi, idProdi]);

  const handlePrintOpen = useCallback(() => {
    setPrintOpen(prev => !prev);
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
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={handlePrintOpen}
            >
              <PrinterIcon className="h-4 w-4" /> Cetak Surat Balasan
            </Button>
          </div>

          <Typography variant="h5" color="blue-gray" className="mb-4">
            {name} - {prodi !== "-" ? prodi : "All Programs"}
          </Typography>

          {participants.map((participant, index) => (
            <Card key={index} className="mb-4 shadow-lg">
              <CardBody className="p-6">
                {/* Rest of your participant card content remains the same */}
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
          ))}
        </div>
      </div>
      <PrintModal 
        open={printOpen}
        onClose={handlePrintOpen}
        printForm={printForm}
        onSubmit={handlePrintSubmit}
        onChange={handlePrintFormChange}
      />
    </div>
  );
};

export default DiterimaDetailPage;