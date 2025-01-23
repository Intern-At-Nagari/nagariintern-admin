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
  DocumentArrowDownIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { branches } from "../Data/Unit";
import { toast } from "react-toastify";

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

  const fetchUnitKerja = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/admin/unit-kerja",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Access the unitKerja property from the response
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
          axios.get(`http://localhost:3000/intern/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetchUnitKerja(), // Fetch unit kerja data alongside intern data
        ]);
        setData(internResponse.data);
        // Set the default selected unit to the one in the request
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
      console.log("Data:", data);
      console.log("Unit Kerja List:", unitKerjaList);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "disetujui":
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
        `http://localhost:3000/intern/${id}/${action}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await axios.get(`http://localhost:3000/intern/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }); 
      setData(response.data);
      handleModalOpen();
      toast.success(`Request successfully ${action === "approve" ? "approved" : "rejected"}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      toast.error("Error updating status");
      console.error("Error updating status:", err);
    }
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/download/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to download file");
      console.error("Error downloading file:", err);
    }
  };

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

          {/* Main Information Card */}
          <Card>
            <CardBody className="p-4 md:p-6">
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
                        {data.type?.charAt(0).toUpperCase() +
                          data.type?.slice(1)}
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
                    <UserIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
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
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Unit Kerja
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.UnitKerjaPengajuan.name}
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
                        Status
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.Status?.name}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <Typography variant="h6" color="blue-gray" className="mb-4">
                Dokumen Pendukung
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.Dokumens && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/uploads/${data.Dokumens[0].url}`,
                        "_blank"
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Curriculum Vitae
                  </Button>
                )}
                {data.Dokumens && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/uploads/${data.Dokumens[2].url}`,
                        "_blank"
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Kartu Tanda Penduduk
                  </Button>
                )}
                {data.Dokumens && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/uploads/${data.Dokumens[3].url}`,
                        "_blank"
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Surat Pengantar
                  </Button>
                )}
                {data.Dokumens && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/uploads/${data.Dokumens[1].url}`,
                        "_blank"
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Transkrip Nilai
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              {/* Action Buttons */}
              {data?.statusId === 1 && (
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
                color="gray"
                onClick={() => handleModalOpen()}
                className="mr-1"
              >
                Batal
              </Button>
              <Button
                variant="filled"
                color={modalType === "reject" ? "red" : "blue"}
                onClick={handleSubmit}
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
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
