import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Alert,
} from "@material-tailwind/react";
import {
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  IdentificationIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import ModalIframe from "../components/ModalIframe";
import axios from "axios";
import CustomLoading from "../components/CustomLoading";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DetailDonePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({ url: "", title: "" });

  const handleOpenModal = (doc, title) => {
    // Construct the full URL for the document
    const fullUrl = `${API_BASE_URL}/uploads/${doc}`;
    setSelectedDoc({ url: fullUrl, title });
    setIsModalOpen(true);
  };

  const getDocumentType = (filename) => {
    if (!filename) return "";

    const documentTypes = {
      fileCv: "CV",
      fileTranskrip: "Transkrip",
      fileKtp: "KTP",
      fileSuratPengantar: "Surat Pengantar",
      SuratPengantar: "Surat Pengantar Divisi",
      fileSuratBalasan: "Surat Balasan",
      fileSuratPernyataanWali: "Surat Pernyataan Wali",
      fileSuratPernyataanSiswa: "Surat Pernyataan Siswa",
      fileTabungan: "Tabungan",
    };

    // Extract the base filename without the timestamp and random number
    const baseFilename = filename.split("-")[0];

    // Look up the document type
    return documentTypes[baseFilename] || "Document";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/admin/intern/done/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setData(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error details:", err);
        setError(
          err.response?.data?.message || "Failed to fetch intern details"
        );
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

  if (loading) {
    return (
      <CustomLoading/>
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
      <div className="flex-1 p-6">
          <BreadcrumbsComponent />

          <Card className="mb-6">
            <CardBody className="p-6">
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-6 pb-2 border-b"
              >
                Informasi Pendaftar
              </Typography>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Personal Details */}
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Tipe Pemohon
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.type?.charAt(0).toUpperCase() +
                          data.type?.slice(1)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        {data.type === "siswa"
                          ? "SMK & Jurusan"
                          : "Institusi & Program Studi"}
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.type === "siswa"
                          ? `${data.Smk?.name} - ${data.Jurusan?.name}`
                          : `${data.PerguruanTinggi?.name} - ${data.Prodi?.name}`}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.User?.email}
                      </Typography>
                    </div>
                  </div>

                  {data.type === "mahasiswa" && (
                    <div className="flex items-start gap-3">
                      <IdentificationIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                      <div className="flex-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          NIM
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-blue-gray-500"
                        >
                          {data.User?.Mahasiswas[0]?.nim || "-"}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Details */}
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        No. Telepon
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {(data.type === "siswa"
                          ? data.User?.Siswas[0]?.no_hp
                          : data.User?.Mahasiswas[0]?.no_hp) || "-"}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Alamat
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {(data.type === "siswa"
                          ? data.User?.Siswas[0]?.alamat
                          : data.User?.Mahasiswas[0]?.alamat) || "-"}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Periode Magang
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {formatDate(data.tanggalMulai)} -{" "}
                        {formatDate(data.tanggalSelesai)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Unit Kerja Penempatan
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.UnitKerjaPenempatan?.name}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-4 pb-2 border-b"
              >
                Dokumen
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.Dokumens?.map((doc, index) => {
                  const documentTitle = getDocumentType(doc.url);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <Typography
                        variant="small"
                        className="text-blue-gray-700 font-medium"
                      >
                        {documentTitle}
                      </Typography>
                      <button
                        onClick={() => handleOpenModal(doc.url, documentTitle)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        Lihat Dokumen
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        
      </div>

      <ModalIframe
        isOpen={isModalOpen}
        handleOpen={() => setIsModalOpen(false)}
        pdfUrl={selectedDoc.url}
        title={selectedDoc.title}
      />
    </div>
  );
};

export default DetailDonePage;