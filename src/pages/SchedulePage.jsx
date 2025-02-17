import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Spinner,
} from "@material-tailwind/react";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import ScheduleTable from "../components/ScheduleTable";
import ScheduleForm from "../components/ScheduleForm";
import endpoints from "../utils/api";
import CustomLoading from "../components/CustomLoading";

const SchedulePage = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false); // New state for button loading
  const [formData, setFormData] = useState({
    nama: "",
    tanggalMulai: "",
    tanggalTutup: "",
  });
  const [editData, setEditData] = useState({
    id: null,
    nama: "",
    tanggalMulai: "",
    tanggalTutup: "",
  });
  const [timerTrigger, setTimerTrigger] = useState(0);

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerTrigger((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const newRemainingTimes = {};
    schedules.forEach((schedule) => {
      if (
        getRegistrationStatus(schedule.tanggalMulai, schedule.tanggalTutup) ===
        "SEDANG BERLANGSUNG"
      ) {
        newRemainingTimes[schedule.id] = calculateTimeRemaining(
          schedule.tanggalTutup
        );
      }
    });
    setRemainingTimes(newRemainingTimes);
  }, [timerTrigger, schedules]);

  const calculateTimeRemaining = (endDate) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const timeDiff = end - now;

    if (timeDiff <= 0) return null;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const getRegistrationStatus = (startDate, endDate) => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) return "AKAN DATANG";
    if (now > end) return "SELESAI";
    return "SEDANG BERLANGSUNG";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SEDANG BERLANGSUNG":
        return "green";
      case "AKAN DATANG":
        return "blue";
      case "SELESAI":
        return "red";
      default:
        return "blue-gray";
    }
  };

  const formatTimeRemaining = (timeObj) => {
    if (!timeObj) return "Waktu habis";
    const { days, hours, minutes, seconds } = timeObj;

    let timeString = "";
    if (days > 0) timeString += `${days} hari `;
    if (hours > 0) timeString += `${hours} jam `;
    if (minutes > 0) timeString += `${minutes} menit `;
    timeString += `${seconds} detik`;

    return timeString;
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const result = await endpoints.page.getSchedules(); // Changed to use schedule.getAll
      const sortedSchedules = result.data.sort((a, b) => b.id - a.id);
      setSchedules(sortedSchedules);

      const initialTimes = {};
      sortedSchedules.forEach((schedule) => {
        if (
          getRegistrationStatus(
            schedule.tanggalMulai,
            schedule.tanggalTutup
          ) === "SEDANG BERLANGSUNG"
        ) {
          initialTimes[schedule.id] = calculateTimeRemaining(
            schedule.tanggalTutup
          );
        }
      });
      setRemainingTimes(initialTimes);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Gagal mengambil data jadwal");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(!open);

  const handleEditOpen = (schedule) => {
    setEditData({
      id: schedule.id,
      nama: schedule.nama,
      tanggalMulai: new Date(schedule.tanggalMulai).toISOString().split("T")[0],
      tanggalTutup: new Date(schedule.tanggalTutup).toISOString().split("T")[0],
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditData({
      id: null,
      nama: "",
      tanggalMulai: "",
      tanggalTutup: "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    try {
      await endpoints.schedule.update(editData.id, {
        nama: editData.nama,
        tanggalMulai: editData.tanggalMulai,
        tanggalTutup: editData.tanggalTutup,
      });

      handleEditClose();
      await fetchSchedules();
      toast.success("Jadwal berhasil diperbarui");
    } catch (error) {
      console.error("Failed to update schedule:", error);
      toast.error(error.response?.data?.message || "Gagal memperbarui jadwal");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonLoading(true);
    try {
      await endpoints.schedule.create(formData);
      await fetchSchedules();
      setFormData({ nama: "", tanggalMulai: "", tanggalTutup: "" });
      handleOpen();
      toast.success("Jadwal berhasil dibuat");
    } catch (error) {
      console.error("Failed to create schedule:", error);
      toast.error(error.response?.data?.message || "Gagal membuat jadwal");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <BreadcrumbsComponent />

        <div className="flex justify-between items-center mb-6">
          <Button color="blue" onClick={handleOpen}>
            Buat Jadwal
          </Button>
        </div>

        <Card>
          <CardBody className="p-0">
            {loading ? (
              <CustomLoading />
            ) : (
              <ScheduleTable
                schedules={schedules}
                remainingTimes={remainingTimes}
                getRegistrationStatus={getRegistrationStatus}
                getStatusColor={getStatusColor}
                formatTimeRemaining={formatTimeRemaining}
                handleEditOpen={handleEditOpen}
              />
            )}
          </CardBody>
        </Card>

        <ScheduleForm
          open={open}
          handleOpen={handleOpen}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />

        <Dialog open={editOpen} handler={handleEditClose}>
          <DialogHeader>Edit Jadwal</DialogHeader>
          <DialogBody>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input
                label="Nama"
                value={editData.nama}
                onChange={(e) =>
                  setEditData({ ...editData, nama: e.target.value })
                }
              />
              <Input
                type="date"
                label="Tanggal Mulai"
                value={editData.tanggalMulai}
                onChange={(e) =>
                  setEditData({ ...editData, tanggalMulai: e.target.value })
                }
              />
              <Input
                type="date"
                label="Tanggal Selesai"
                value={editData.tanggalTutup}
                onChange={(e) =>
                  setEditData({ ...editData, tanggalTutup: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <Button variant="text" onClick={handleEditClose} color="red">
                  Cancel
                </Button>
                <Button type="submit" color="blue" disabled={buttonLoading}>
                  {buttonLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </form>
          </DialogBody>
        </Dialog>
      </div>
    </div>
  );
};

export default SchedulePage;
