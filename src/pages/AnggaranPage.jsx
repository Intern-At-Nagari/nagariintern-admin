import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Alert } from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  UsersIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import Pagination from "../components/Pagination";
import CustomLoading from "../components/CustomLoading";
import TableComponent from "../components/TableComponent";
import ModalIframe from "../components/ModalIframe";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AnggaranPage = () => {
  const [anggaranData, setAnggaranData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentPeriod, setCurrentPeriod] = useState("all"); // New state for period filter
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/absensi/rekap`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        console.log(
          "First record structure:",
          JSON.stringify(result.data[0], null, 2)
        );
        console.log("Sample record:", result.data[0]);
        setAnggaranData(result.data);
        setFilteredData(result.data);
        console.log("Data fetched:", result.data);
        setError(null);
      } else {
        setError(result.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // First filter by search term
    let filtered = anggaranData.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        // Only search through specific fields
        const searchableFields = [
          "unit_kerja",
          "bulan",
          "tahun",
          "periode",
          "uploaded_by",
        ];
        return (
          searchableFields.includes(key) &&
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );

    // Then filter by current month
    filtered = filtered.filter((item) => {
      const monthNumber = getMonthNumber(item.bulan);
      return monthNumber === currentMonth;
    });

    // Finally filter by period if a specific period is selected
    if (currentPeriod !== "all") {
      filtered = filtered.filter((item) => item.periode === currentPeriod);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, anggaranData, currentMonth, currentPeriod]);

  // Get unique periods from data
  const getUniquePeriods = () => {
    const periods = new Set(anggaranData.map((item) => item.periode));
    return ["all", ...Array.from(periods)];
  };

  const getMonthNumber = (monthName) => {
    const months = {
      januari: 1,
      februari: 2,
      maret: 3,
      april: 4,
      mei: 5,
      juni: 6,
      juli: 7,
      agustus: 8,
      september: 9,
      oktober: 10,
      november: 11,
      desember: 12,
    };
    return months[monthName.toLowerCase()];
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return months[monthNumber - 1];
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const totalEstimasiBiaya = filteredData.reduce(
    (total, item) => total + parseInt(item.total_biaya.replace(/\./g, "")),
    0
  );

  const getTotalStats = () => {
    return filteredData.reduce(
      (acc, curr) => {
        return {
          totalBiaya: acc.totalBiaya + parseInt(curr.total_biaya.replace(/\./g, "")),
          totalPeserta: acc.totalPeserta + curr.total_peserta,
          totalKehadiran: acc.totalKehadiran + curr.total_kehadiran,
        };
      },
      { totalBiaya: 0, totalPeserta: 0, totalKehadiran: 0 }
    );
  };

  const columns = [
    {
      label: "No",
      accessor: "id",
    },
    {
      label: "Unit Kerja",
      accessor: "unit_kerja",
    },
    {
      label: "Bulan",
      accessor: "bulan",
    },
    {
      label: "Tahun",
      accessor: "tahun",
    },
    {
      label: "Total Peserta",
      accessor: "total_peserta",
    },
    {
      label: "Total Kehadiran",
      accessor: "total_kehadiran",
    },
    {
      label: "Total Biaya",
      render: (item) => `Rp ${item.total_biaya.toLocaleString("id-ID")}`,
    },
    {
      label: "Periode",
      render: (item) => item.periode || "-",
    },
    {
      label: "Diupload Oleh",
      accessor: "uploaded_by",
    },
    {
      label: "Tanggal Upload",
      render: (item) => new Date(item.uploaded_at).toLocaleDateString("id-ID"),
    },
  ];

  const handleViewClick = (item) => {
    // Add detailed logging
    console.log("Full item:", item);
    console.log("API_BASE_URL:", API_BASE_URL);

    if (!item || !item.url_rekap) {
      console.error("Missing item or url_rekap:", item);
      setError("PDF URL is missing");
      return;
    }

    const pdfUrl = `${API_BASE_URL}/uploads/${item.url_rekap}`;
    console.log("Generated PDF URL:", pdfUrl);
    setSelectedPdf(pdfUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPdf(null);
  };

  const SearchInput = () => (
    <div className="relative">
      <input
        type="text"
        placeholder="Cari data anggaran..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 pr-12 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
      />
      <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
  );

  const MonthSelector = () => (
    <div className="relative">
      <select
        value={currentMonth}
        onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
        className="w-full px-4 py-2 text-sm border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer pr-10"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option key={month} value={month} className="py-2">
            {getMonthName(month)}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );

  const PeriodSelector = () => (
    <div className="relative">
      <select
        value={currentPeriod}
        onChange={(e) => setCurrentPeriod(e.target.value)}
        className="w-full px-4 py-2 text-sm border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer pr-10"
      >
        {getUniquePeriods().map((period) => (
          <option key={period} value={period} className="py-2">
            {period === "all" ? "Semua Periode" : period}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );

  if (loading) return <CustomLoading />;

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <BreadcrumbsComponent />

        {error && (
          <Alert color="red" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-white shadow-lg">
              <CardBody className="p-6">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-blue-gray-50 pb-4">
                    <Typography variant="h6" color="blue-gray" className="font-medium">
                      Ringkasan {getMonthName(currentMonth)} {new Date().getFullYear()}
                    </Typography>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 gap-6">
                    {/* Total Biaya */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Typography variant="small" color="blue-gray" className="font-medium opacity-75">
                          Total Biaya
                        </Typography>
                        <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <Typography variant="h3" color="green" className="font-bold">
                        Rp {getTotalStats().totalBiaya.toLocaleString("id-ID")}
                      </Typography>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-gray-50">
                      {/* Total Peserta */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-4 w-4 text-blue-600" />
                          <Typography variant="small" className="font-medium text-blue-gray-600">
                            Total Peserta
                          </Typography>
                        </div>
                        <Typography variant="h6" className="font-bold text-blue-gray-800">
                          {getTotalStats().totalPeserta.toLocaleString("id-ID")}
                        </Typography>
                      </div>

                      {/* Total Kehadiran */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-blue-600" />
                          <Typography variant="small" className="font-medium text-blue-gray-600">
                            Total Kehadiran
                          </Typography>
                        </div>
                        <Typography variant="h6" className="font-bold text-blue-gray-800">
                          {getTotalStats().totalKehadiran.toLocaleString("id-ID")}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Filter Card */}
          <Card className="bg-white shadow-lg">
            <CardBody className="p-6">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Pencarian
                  </Typography>
                  <SearchInput />
                </div>
                <div className="space-y-2">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Pilih Bulan
                  </Typography>
                  <MonthSelector />
                </div>
                <div className="space-y-2">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Pilih Periode
                  </Typography>
                  <PeriodSelector />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <TableComponent
            data={getCurrentPageData()}
            columns={columns}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            handleViewClick={(row) => {
              const item = getCurrentPageData().find((item) => item.id === row);
              console.log("Full row data:", item);
              handleViewClick(item);
            }}
            actionIcon="eye"
            actionTooltip="Lihat detail anggaran"
          />
          {totalPages > 1 && (
            <Card className="shadow-lg">
              <Pagination
                active={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Card>
          )}
        </div>

        <ModalIframe
          isOpen={isModalOpen}
          handleOpen={handleCloseModal} // Changed from handleViewClick to handleCloseModal
          pdfUrl={selectedPdf}
          title="Detail Rekap Anggaran"
        />
      </div>
    </div>
  );
};

export default AnggaranPage;