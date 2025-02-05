import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Chip,
} from "@material-tailwind/react";
import {
  PencilIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const SchedulePage = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [remainingTimes, setRemainingTimes] = useState({});
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

  const calculateTimeRemaining = (endDate) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const timeDiff = end - now;

    if (timeDiff <= 0) return null;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
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
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('${API_BASE_URL}/jadwal-pendaftaran', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        // Sort the data by createdAt or id in descending order
        const sortedSchedules = result.data.sort((a, b) => b.id - a.id);
        setSchedules(sortedSchedules);

        // Initialize remaining times for all schedules
        const initialTimes = {};
        sortedSchedules.forEach((schedule) => {
            if (getRegistrationStatus(schedule.tanggalMulai, schedule.tanggalTutup) === "SEDANG BERLANGSUNG") {
                initialTimes[schedule.id] = calculateTimeRemaining(schedule.tanggalTutup);
            }
        });
        setRemainingTimes(initialTimes);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        toast.error('Failed to fetch schedules');
    }
};

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Separate useEffect for timer updates
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerTrigger(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Effect to update remaining times when timer triggers
  useEffect(() => {
    const newRemainingTimes = {};
    schedules.forEach((schedule) => {
      if (getRegistrationStatus(schedule.tanggalMulai, schedule.tanggalTutup) === "SEDANG BERLANGSUNG") {
        newRemainingTimes[schedule.id] = calculateTimeRemaining(schedule.tanggalTutup);
      }
    });
    setRemainingTimes(newRemainingTimes);
  }, [timerTrigger, schedules]);

  const handleOpen = () => setOpen(!open);

  const handleEditOpen = (schedule) => {
    setEditData({
      id: schedule.id,
      nama: schedule.nama,
      tanggalMulai: new Date(schedule.tanggalMulai).toISOString().split('T')[0],
      tanggalTutup: new Date(schedule.tanggalTutup).toISOString().split('T')[0],
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
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/jadwal-pendaftaran/${editData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nama: editData.nama,
          tanggalMulai: editData.tanggalMulai,
          tanggalTutup: editData.tanggalTutup,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update schedule');
      }

      handleEditClose();
      await fetchSchedules();
      toast.success('Schedule updated successfully');
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error('Failed to update schedule');
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('${API_BASE_URL}/admin/jadwal-pendaftaran', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create schedule');
        }

        await fetchSchedules();
        toast.success('Schedule created successfully');
    } catch (error) {
        console.error('Failed to create schedule:', error);
        toast.error(error.message || 'Failed to create schedule');
    } finally {
        setFormData({ nama: "", tanggalMulai: "", tanggalTutup: "" });
        handleOpen(); // Close modal regardless of success or failure
    }
};

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />
          
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h4" color="blue-gray">
              Jadwal Pendaftaran
            </Typography>
            <Button color="blue" onClick={handleOpen}> Buat Jadwal</Button>
          </div>

          <Card>
  <CardBody className="p-0">
    <table className="w-full min-w-max table-auto text-left">
      <thead className="rounded-t-lg">
        <tr>
          <th className="border-b border-blue-gray-100 bg-gray-100 p-4 rounded-tl-lg">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none"
            >
              Nama
            </Typography>
          </th>
          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none"
            >
              Tanggal Mulai
            </Typography>
          </th>
          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none"
            >
              Tanggal Selesai
            </Typography>
          </th>
          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none"
            >
              Status
            </Typography>
          </th>
          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none"
            >
              Sisa Waktu
            </Typography>
          </th>
          <th className="border-b border-blue-gray-100 bg-gray-100 p-4 rounded-tr-lg">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none"
            >
              Aksi
            </Typography>
          </th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule) => {
          const status = getRegistrationStatus(schedule.tanggalMulai, schedule.tanggalTutup);
          const timeRemaining = remainingTimes[schedule.id];
          
          return (
            <tr key={schedule.id}>
              <td className="p-4">{schedule.nama}</td>
              <td className="p-4">
                {new Date(schedule.tanggalMulai).toLocaleDateString()}
              </td>
              <td className="p-4">
                {new Date(schedule.tanggalTutup).toLocaleDateString()}
              </td>
              <td className="p-4">
                <Chip
                  size="sm"
                  variant="gradient"
                  color={getStatusColor(status)}
                  value={status}
                  className="text-xs"
                />
              </td>
              <td className="p-4">
                {status === "SEDANG BERLANGSUNG" && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-blue-500" />
                    <Typography variant="small" className="font-medium">
                      {formatTimeRemaining(timeRemaining)}
                    </Typography>
                  </div>
                )}
              </td>
              <td className="p-4">
                {status !== "SELESAI" && (
                  <IconButton 
                    variant="text" 
                    color="blue"
                    onClick={() => handleEditOpen(schedule)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </CardBody>
</Card>

          <Dialog open={open} handler={handleOpen}>
            <DialogHeader>Tambah Jadwal Baru</DialogHeader>
            <DialogBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
                <Input
                  type="date"
                  label="Tanggal Mulai"
                  value={formData.tanggalMulai}
                  onChange={(e) => setFormData({...formData, tanggalMulai: e.target.value})}
                />
                <Input
                  type="date"
                  label="Tanggal Selesai"
                  value={formData.tanggalTutup}
                  onChange={(e) => setFormData({...formData, tanggalTutup: e.target.value})}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outlined" onClick={handleOpen}>
                    Batal
                  </Button>
                  <Button type="submit" color="blue">
                    Simpan
                  </Button>
                </div>
              </form>
            </DialogBody>
          </Dialog>

          <Dialog open={editOpen} handler={handleEditClose}>
            <DialogHeader>Edit Jadwal</DialogHeader>
            <DialogBody>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <Input
                  label="Nama"
                  value={editData.nama}
                  onChange={(e) => setEditData({...editData, nama: e.target.value})}
                />
                <Input
                  type="date"
                  label="Tanggal Mulai"
                  value={editData.tanggalMulai}
                  onChange={(e) => setEditData({...editData, tanggalMulai: e.target.value})}
                />
                <Input
                  type="date"
                  label="Tanggal Selesai"
                  value={editData.tanggalTutup}
                  onChange={(e) => setEditData({...editData, tanggalTutup: e.target.value})}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outlined" onClick={handleEditClose}>
                    Batal
                  </Button>
                  <Button type="submit" color="blue">
                    Simpan
                  </Button>
                </div>
              </form>
            </DialogBody>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;