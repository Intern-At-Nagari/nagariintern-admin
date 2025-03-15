import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Typography,
    IconButton,
    Input,
    Tooltip,
    Select,
    Option,
    Button,
} from "@material-tailwind/react";
import {
    EyeIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import CustomLoading from "../components/CustomLoading";
import * as XLSX from 'xlsx';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import endpoints from "../utils/api";

const HistoryPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedType, setSelectedType] = useState("all");
    const [yearOptions, setYearOptions] = useState([]);

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
    
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No authentication token found");
    
                const response = await axios.get(`${API_BASE_URL}/superadmin/interns/done`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                const responseData = response.data || [];
                const dataArray = Array.isArray(responseData) ? responseData : [];
                
                // Extract unique years from tanggalMulai
                const uniqueYears = [...new Set(dataArray
                    .filter(item => item?.tanggalMulai)
                    .map(item => new Date(item.tanggalMulai).getFullYear().toString())
                )].sort((a, b) => b - a); // Sort years in descending order
                
                // Set year options - if none found, default to current year
                const years = uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear().toString()];
                setYearOptions(years);
                
                // Set default year to the most recent one
                if (years.length > 0) {
                    setSelectedYear(years[0]);
                }
                
                setData(dataArray);

            } catch (err) {
            setError(
                err.response?.data?.message || err.message || "Failed to fetch data"
            );
            console.error("Error details:", err);
            } finally {
            setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleYearChange = (value) => {
        setSelectedYear(value);
        setCurrentPage(1);
    };

    const handleTypeChange = (value) => {
        setSelectedType(value);
        setCurrentPage(1);
    };

    const getName = (item) => {
        if (item.User?.Siswas?.[0]?.name) {
            return item.User.Siswas[0].name;
        }
        if (item.User?.Mahasiswas?.[0]?.name) {
            return item.User.Mahasiswas[0].name;
        }
        return "-";
    };

    const getInstitution = (item) => {
        return item.Smk?.name || item.PerguruanTinggi?.name || "-";
    };

    const getYear = (date) => {
        if (!date) return null;
        return new Date(date).getFullYear().toString();
    };

    const filteredData = data.filter((item) => {
        if (!item) return false;
    
        // Filter by year
        const year = getYear(item.tanggalMulai);
        if (year !== selectedYear) return false;
    
        // Filter by type (siswa or mahasiswa)
        if (selectedType === "siswa" && item.type !== "siswa") return false;
        if (selectedType === "mahasiswa" && item.type !== "mahasiswa") return false;
    
        // Filter by search query
        const name = getName(item);
        const institution = getInstitution(item);
        
        const searchTerms = [
            name,
            institution,
            item.type || "",
            item.Prodi?.name || "",
            item.Jurusan?.name || "",
            item.UnitKerjaPenempatan?.name || "",
        ].filter(Boolean); // Remove empty strings
        
        return searchQuery === "" || 
               searchTerms.some(term => 
                   term.toLowerCase().includes(searchQuery.toLowerCase())
               );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleViewClick = (id) => {
        window.location.href = `/riwayat-pendaftar-magang/detail/${id}`;
    };

    const downloadExcel = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");
    
            // Filter data based on selected year and type
            const dataToExport = data.filter(item => {
                const year = getYear(item.tanggalMulai);
                const type = item.type;
                return (
                    year === selectedYear && 
                    (selectedType === "all" || selectedType === type)
                );
            });
    
            // Separate data into mahasiswa and siswa
            const mahasiswaData = dataToExport.filter(item => item.type === "mahasiswa").map(item => {
                const user = item.User?.Mahasiswas?.[0];
                return {
                    "Nama": getName(item),
                    "NIK": "-", 
                    "NIM": user?.nim || "-",
                    "Universitas": item.PerguruanTinggi?.name || "-",
                    "Program Studi": item.Prodi?.name || "-",
                    "Penempatan": item.UnitKerjaPenempatan?.name || "-",
                    "Tanggal Mulai": item.tanggalMulai ? 
                        formatDateIndo(item.tanggalMulai) : "-",
                    "Tanggal Selesai": item.tanggalSelesai ? 
                        formatDateIndo(item.tanggalSelesai) : "-",
                    "No HP": user?.no_hp || "-",
                };
            });
    
            const siswaData = dataToExport.filter(item => item.type === "siswa").map(item => {
                const user = item.User?.Siswas?.[0];
                return {
                    "Nama": getName(item),
                    "NIK": "-", 
                    "NISN": user?.nisn || "-",
                    "Sekolah": item.Smk?.name || "-",
                    "Jurusan": item.Jurusan?.name || "-",
                    "Penempatan": item.UnitKerjaPenempatan?.name || "-",
                    "Tanggal Mulai": item.tanggalMulai ? 
                        formatDateIndo(item.tanggalMulai) : "-",
                    "Tanggal Selesai": item.tanggalSelesai ? 
                        formatDateIndo(item.tanggalSelesai) : "-",
                    "No HP": user?.no_hp || "-",
                };
            });
    
            // Create workbook
            const workbook = XLSX.utils.book_new();
            
            // Helper function to format date in Indonesian format with capital letters
            function formatDateIndo(dateString) {
                const date = new Date(dateString);
                const day = date.getDate();
                const month = date.getMonth();
                
                // Array of month names in Indonesian
                const monthNames = [
                    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
                    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
                ];
                
                const year = date.getFullYear();
                return `${day} ${monthNames[month]} ${year}`;
            }
            
            // Function to create a styled worksheet with title and proper formatting
            function createStyledWorksheet(data, title) {
                // First, create an array representation for the sheet
                const wsData = [];
                
                // Add title row (merged cells later)
                wsData.push([title]);
                wsData.push([]); // Empty row after title
                
                // Add header row with merged cells for Period column
                const headers = [
                    "Nama", "NIK", 
                    data === mahasiswaData ? "NIM" : "NISN", 
                    data === mahasiswaData ? "Universitas" : "Sekolah", 
                    data === mahasiswaData ? "Program Studi" : "Jurusan", 
                    "Penempatan", 
                    "Periode Magang", "", // Will be merged
                    "No HP"
                ];
                wsData.push(headers);
                
                // Add subheader row for tanggal mulai and tanggal selesai
                const subHeaders = [
                    "", "", "", "", "", "", "Tanggal Mulai", "Tanggal Selesai", ""
                ];
                wsData.push(subHeaders);
                
                // Add data rows
                data.forEach(item => {
                    wsData.push([
                        item["Nama"],
                        item["NIK"],
                        data === mahasiswaData ? item["NIM"] : item["NISN"],
                        data === mahasiswaData ? item["Universitas"] : item["Sekolah"],
                        data === mahasiswaData ? item["Program Studi"] : item["Jurusan"],
                        item["Penempatan"],
                        item["Tanggal Mulai"],
                        item["Tanggal Selesai"],
                        item["No HP"]
                    ]);
                });
                
                // Create worksheet from data
                const ws = XLSX.utils.aoa_to_sheet(wsData);
                
                // Set column widths
                const colWidths = [
                    { width: 30 }, // Nama
                    { width: 20 }, // NIK
                    { width: 20 }, // NIM/NISN
                    { width: 30 }, // Universitas/Sekolah
                    { width: 25 }, // Program Studi/Jurusan
                    { width: 30 }, // Penempatan
                    { width: 20 }, // Tanggal Mulai
                    { width: 20 }, // Tanggal Selesai
                    { width: 15 }  // No HP
                ];
                
                ws['!cols'] = colWidths;
                
                // Merge title cells
                ws['!merges'] = [
                    // Merge title across all columns
                    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
                    // Merge "Periode Magang" across two columns
                    { s: { r: 2, c: 6 }, e: { r: 2, c: 7 } }
                ];
                
                // Style the cells (as much as XLSX allows)
                // Add some cell styles for the title - this is limited in xlsx-js
                // but we can set the title to be bold
                if (!ws.A1) ws.A1 = { v: title, t: 's' };
                ws.A1.s = { font: { bold: true, sz: 14 } };
                
                // Set the headers to bold
                for (let i = 0; i < headers.length; i++) {
                    const cellRef = XLSX.utils.encode_cell({ r: 2, c: i });
                    if (!ws[cellRef]) ws[cellRef] = { v: headers[i], t: 's' };
                    ws[cellRef].s = { font: { bold: true } };
                }
                
                // Set subheaders to bold
                for (let i = 0; i < subHeaders.length; i++) {
                    const cellRef = XLSX.utils.encode_cell({ r: 3, c: i });
                    if (!ws[cellRef]) ws[cellRef] = { v: subHeaders[i], t: 's' };
                    ws[cellRef].s = { font: { bold: true } };
                }
                
                return ws;
            }
            
            // Create worksheet for mahasiswa if there's data
            if (mahasiswaData.length > 0) {
                const title = `DAFTAR PENEMPATAN MAHASISWA MAGANG PADA BANK NAGARI TAHUN ${selectedYear}`;
                const mahasiswaWorksheet = createStyledWorksheet(mahasiswaData, title);
                XLSX.utils.book_append_sheet(workbook, mahasiswaWorksheet, "Mahasiswa");
            }
            
            // Create worksheet for siswa if there's data
            if (siswaData.length > 0) {
                const title = `DAFTAR PENEMPATAN SISWA MAGANG PADA BANK NAGARI TAHUN ${selectedYear}`;
                const siswaWorksheet = createStyledWorksheet(siswaData, title);
                XLSX.utils.book_append_sheet(workbook, siswaWorksheet, "Siswa");
            }
            
            // If no data in specific sheets based on filter, create at least one sheet
            if (mahasiswaData.length === 0 && siswaData.length === 0) {
                const title = `DAFTAR PENEMPATAN MAGANG PADA BANK NAGARI TAHUN ${selectedYear}`;
                const emptyWsData = [
                    [title],
                    [],
                    ["Nama", "NIK", "ID", "Institusi", "Program", "Penempatan", "Periode Magang", "", "No HP"],
                    ["", "", "", "", "", "", "Tanggal Mulai", "Tanggal Selesai", ""]
                ];
                const emptyWorksheet = XLSX.utils.aoa_to_sheet(emptyWsData);
                
                // Apply similar merges and styles
                emptyWorksheet['!merges'] = [
                    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
                    { s: { r: 2, c: 6 }, e: { r: 2, c: 7 } }
                ];
                
                XLSX.utils.book_append_sheet(workbook, emptyWorksheet, "Rekap Magang");
            }
    
            // Generate filename
            const typeText = selectedType === "siswa" ? "Siswa" : 
                            selectedType === "mahasiswa" ? "Mahasiswa" : "Semua";
            const fileName = `Rekap_${typeText}_${selectedYear}.xlsx`;
    
            // Export to Excel
            XLSX.writeFile(workbook, fileName);
            
        } catch (error) {
            console.error("Error downloading Excel:", error);
            alert("Failed to download Excel file");
        }
    };

    return (
        <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
            <Sidebar />
            <div className="flex-1 p-6">
                <BreadcrumbsComponent />

                {loading ? (
                    <CustomLoading />
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <Typography color="red" className="text-center">
                            {error}
                        </Typography>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative flex w-full">
                                <Input
                                    type="search"
                                    label="Cari data..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="pr-20"
                                    containerProps={{
                                        className: "min-w-0",
                                    }}
                                    icon={
                                        <MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-500" />
                                    }
                                />
                            </div>
                            <div>
                                <Select
                                    label="Tahun"
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                >
                                    {yearOptions.map((year) => (
                                        <Option key={year} value={year}>
                                            {year}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <Select
                                    label="Tipe"
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                >
                                    <Option value="all">Semua</Option>
                                    <Option value="mahasiswa">Mahasiswa</Option>
                                    <Option value="siswa">Siswa</Option>
                                </Select>
                            </div>
                            <div>
                                <Button 
                                    className="flex items-center gap-2"
                                    onClick={downloadExcel}
                                >
                                    <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" /> 
                                    Download Rekap Excel
                                </Button>
                            </div>
                        </div>

                        <Card className="overflow-hidden">
                            <CardBody className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-max table-auto text-left">
                                        <thead>
                                            <tr>
                                                <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        No
                                                    </Typography>
                                                </th>
                                                <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        Nama
                                                    </Typography>
                                                </th>
                                                <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        Tipe
                                                    </Typography>
                                                </th>
                                                <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        Institusi
                                                    </Typography>
                                                </th>
                                                <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {selectedType === "siswa" ? "Jurusan" : 
                                                         selectedType === "mahasiswa" ? "Program Studi" : 
                                                         "Prodi/Jurusan"}
                                                    </Typography>
                                                </th>
                                                <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        Unit Kerja
                                                    </Typography>
                                                </th>
                                                <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        Periode
                                                    </Typography>
                                                </th>
                                                <th className="border-b border-blue-gray-100 bg-gray-100 p-4 text-center">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        Aksi
                                                    </Typography>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getCurrentPageData().map((item, index) => {
                                                if (!item) return null;

                                                const startDate = item.tanggalMulai
                                                    ? new Date(item.tanggalMulai).toLocaleDateString("id-ID")
                                                    : "-";
                                                const endDate = item.tanggalSelesai
                                                    ? new Date(item.tanggalSelesai).toLocaleDateString("id-ID")
                                                    : "-";

                                                return (
                                                    <tr key={item.id} className="even:bg-gray-100/50">
                                                        <td className="p-4">
                                                            <Typography variant="small" color="blue-gray">
                                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                                            </Typography>
                                                        </td>
                                                        <td className="p-4">
                                                            <Typography variant="small" color="blue-gray">
                                                                {getName(item)}
                                                            </Typography>
                                                        </td>
                                                        <td className="p-4">
                                                            <Typography variant="small" color="blue-gray">
                                                                {item.type === "mahasiswa" ? "Mahasiswa" : "Siswa"}
                                                            </Typography>
                                                        </td>
                                                        <td className="p-4">
                                                            <Typography variant="small" color="blue-gray">
                                                                {getInstitution(item)}
                                                            </Typography>
                                                        </td>
                                                        <td className="p-4">
                                                            <Typography variant="small" color="blue-gray">
                                                                {item.type === "siswa" 
                                                                    ? (item.Jurusan?.name || "-")
                                                                    : (item.Prodi?.name || "-")}
                                                            </Typography>
                                                        </td>
                                                        <td className="p-4">
                                                            <Typography variant="small" color="blue-gray">
                                                                {item.UnitKerjaPenempatan?.name || "-"}
                                                            </Typography>
                                                        </td>
                                                        <td className="p-4">
                                                            <Typography variant="small" color="blue-gray">
                                                                {startDate} - {endDate}
                                                            </Typography>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex gap-2 justify-center">
                                                                <Tooltip content="Lihat detail" className="bg-blue-500">
                                                                    <IconButton
                                                                        variant="text"
                                                                        color="blue"
                                                                        className="rounded-full"
                                                                        onClick={() => handleViewClick(item.id)}
                                                                    >
                                                                        <EyeIcon className="h-4 w-4" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredData.length === 0 && (
                                                <tr>
                                                    <td colSpan="8" className="p-4 text-center">
                                                        <Typography variant="small" color="blue-gray">
                                                            No data found
                                                        </Typography>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardBody>
                            <Pagination
                                active={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;