import React, { useState} from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChevronRightIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import ApprovalModal from "./ApprovalModal";
import BreadcrumbsComponent from "./BreadcrumbsComponent";

const DetailPage = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
  });

  const data = {
    alamat: "Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat",
    createdAt: "2025-01-09T06:26:21.000Z",
    departemen: "it",
    fileCv: "fileCv-1736403981081-458202965.pdf",
    fileKtp: "fileKtp-1736403981091-308009098.pdf",
    fileSuratPengantar: "fileSuratPengantar-1736403981103-410762374.pdf",
    fileTranskrip: "fileTranskrip-1736403981084-684445750.pdf",
    id: 5,
    institusi: "Universitas Andalas",
    jurusan: "Sistem Informasi",
    noHp: "087780687924",
    statusPermohonan: "menunggu",
    statusPersetujuanPSDM: "menunggu",
    statusPersetujuanPimpinan: "menunggu",
    tanggalMulai: "2025-01-09",
    tanggalPengajuan: "2025-01-09",
    tanggalSelesai: "2025-01-23",
    tipePemohon: "mahasiswa",
    updatedAt: "2025-01-09T06:26:21.000Z",
    userId: 6,
    waktuPersetujuanPSDM: null,
    waktuPersetujuanPimpinan: null,
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  const handleSubmit = (notes) => {
    // Handle the submission logic here
    console.log('Submitted with notes:', notes);
    console.log('Submission type:', modalState.type);
    // Add your API call or state update logic here
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <BreadcrumbsComponent/>

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

          {/* Combined Information Card */}
          <Card>
            <CardBody className="p-4 md:p-6">
              {/* Personal Information Section */}
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Informasi Pendaftar
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
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
                        {data.tipePemohon.charAt(0).toUpperCase() +
                          data.tipePemohon.slice(1)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Institusi & Jurusan
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.institusi} - {data.jurusan}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <PhoneIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Nomor HP
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.noHp}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
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
                    <ClockIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Tanggal Pengajuan
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {formatDate(data.tanggalPengajuan)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Departemen
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.departemen.toUpperCase()}
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
                    onClick={() =>
                      window.open(`/api/download/${doc.file}`, "_blank")
                    }
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    Download {doc.name}
                  </Button>
                ))}
              </div>

              {/* Action Buttons */}
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
