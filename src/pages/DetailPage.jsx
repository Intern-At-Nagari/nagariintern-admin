import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import {
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  IdentificationIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { toast } from "react-toastify";
import ModalIframe from "../components/ModalIframe";
import CustomLoading from "../components/CustomLoading";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [notes, setNotes] = useState("");
  const [unitKerjaList, setUnitKerjaList] = useState([]);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({
    url: "",
    title: ""
  });

  const fetchUnitKerja = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/unit-kerja`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUnitKerjaList(response.data.unitKerja);
    } catch (err) {
      console.error("Error fetching unit kerja:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [internResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/intern/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetchUnitKerja(),
        ]);
        setData(internResponse.data);
        setSelectedUnit(internResponse.data.UnitKerjaPengajuan.id);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch intern details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getUnitKerjaOptions = () => {
    if (!data || !unitKerjaList?.length) {
      return [];
    }

    return unitKerjaList.map((unit) => {
      const remainingQuota =
        data.type === "siswa" ? unit.kuotaSiswa : unit.kuotaMhs;
      const quotaText =
        remainingQuota > 0
          ? `(Sisa Kuota: ${remainingQuota})`
          : "(Kuota Penuh)";

      return {
        id: unit.id,
        name: `${unit.name} ${quotaText}`,
        disabled: remainingQuota <= 0,
      };
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };



  const handleModalOpen = (type = null) => {
    setModalType(type);
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setSelectedUnit("");
      setNotes("");
    }
  };

  const handleSubmit = async () => {
    try {
      const action = modalType === "accept" ? "approve" : "reject";
      const payload =
        modalType === "accept" ? { penempatan: selectedUnit } : {};

      await axios.patch(
        `${API_BASE_URL}/intern/${id}/${action}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await axios.get(`${API_BASE_URL}/intern/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data);
      handleModalOpen();
      toast.success(
        `Request successfully ${action === "approve" ? "approved" : "rejected"}`
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      toast.error("Error updating status");
      console.error("Error updating status:", err);
    }
  };

  const handleDocumentModal = (url = "", title = "") => {
    setSelectedDocument({ url, title });
    setIsDocumentModalOpen(!isDocumentModalOpen);
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
              {/* Personal Information Section */}
              <Typography variant="h6" color="blue-gray" className="mb-6 pb-2 border-b">
                Informasi Pendaftar
              </Typography>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Personal Details */}
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Tipe Pemohon
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {data.type?.charAt(0).toUpperCase() + data.type?.slice(1)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {data.type === "siswa" ? "SMK & Jurusan" : "Institusi & Program Studi"}
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {data.type === "siswa"
                          ? `${data.Smk?.name} - ${data.Jurusan?.name}`
                          : `${data.PerguruanTinggi?.name} - ${data.Prodi?.name}`}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Email
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {data.User?.email}
                      </Typography>
                    </div>
                  </div>

                  {data.type === "mahasiswa" && (
                    <div className="flex items-start gap-3">
                      <IdentificationIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                      <div className="flex-1">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          NIM
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-500">
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
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        No. Telepon
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {(data.type === "siswa"
                          ? data.User?.Siswas[0]?.no_hp
                          : data.User?.Mahasiswas[0]?.no_hp) || "-"}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Alamat
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {(data.type === "siswa"
                          ? data.User?.Siswas[0]?.alamat
                          : data.User?.Mahasiswas[0]?.alamat) || "-"}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Periode Magang
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {formatDate(data.tanggalMulai)} - {formatDate(data.tanggalSelesai)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Unit Kerja
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {data.UnitKerjaPengajuan?.name}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        Status
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500">
                        {data.Status?.name}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <Typography variant="h6" color="blue-gray" className="mb-4 pb-2 border-b">
                Dokumen Pendukung
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {data.Dokumens && [
                  { label: "Curriculum Vitae", index: 0 },
                  { label: "Kartu Tanda Penduduk", index: 2 },
                  { label: "Surat Pengantar", index: 3 },
                  { label: "Transkrip Nilai", index: 1 }
                ].map(doc => (
                  <div key={doc.label} className="flex gap-2">
                    <Button
                      variant="outlined"
                      className="flex items-center gap-2 normal-case flex-1"
                      onClick={() => {
                        handleDocumentModal(
                          `${API_BASE_URL}/uploads/${data.Dokumens[doc.index].url}`,
                          doc.label
                        );
                      }}
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      {doc.label}
                    </Button>
                 
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              {data?.statusId === 1 && (
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t">
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

          <Dialog open={modalOpen} handler={handleModalOpen}>
            <DialogHeader>
              {modalType === "reject" && "Tolak Permintaan"}
              {modalType === "accept" && "Terima Permintaan"}
            </DialogHeader>
            <DialogBody divider>
              <div className="space-y-4">
                {modalType === "accept" && (
                  <>
                    <Typography variant="small" color="gray" className="mb-2">
                      Unit kerja yang dipilih oleh pemohon:{" "}
                      {data?.UnitKerjaPengajuan?.name}
                    </Typography>
                    <Select
                      label="Pilih Unit Kerja"
                      value={selectedUnit}
                      onChange={(value) => setSelectedUnit(value)}
                    >
                      {getUnitKerjaOptions().length > 0 ? (
                        getUnitKerjaOptions().map((unit) => (
                          <Option
                            key={unit.id}
                            value={unit.id}
                            disabled={unit.disabled}
                          >
                            {unit.name}
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No unit kerja available</Option>
                      )}
                    </Select>
                    {selectedUnit && (
                      <Typography variant="small" color="gray" className="mt-2">
                        {data?.type === "siswa"
                          ? "Kuota Siswa: "
                          : "Kuota Mahasiswa: "}
                        {
                          unitKerjaList.find((u) => u.id === selectedUnit)?.[
                            data?.type === "siswa" ? "kuotaSiswa" : "kuotaMhs"
                          ]
                        }{" "}
                        tersisa
                      </Typography>
                    )}
                  </>
                )}
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  label="Catatan (Opsional)"
                />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="red"
                onClick={() => handleModalOpen()}
                className="mr-1"
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color={modalType === "reject" ? "red" : "blue"}
                onClick={async () => {
                  await handleSubmit();
                  navigate("/diproses");
                }}
                disabled={
                  modalType === "accept" &&
                  (!selectedUnit ||
                    getUnitKerjaOptions().find((u) => u.id === selectedUnit)
                      ?.disabled)
                }
              >
                Submit
              </Button>
            </DialogFooter>
          </Dialog>

          <ModalIframe
            isOpen={isDocumentModalOpen}
            handleOpen={handleDocumentModal}
            pdfUrl={selectedDocument.url}
            title={selectedDocument.title}
          />
        
      </div>
    </div>
  );
};

export default DetailPage;