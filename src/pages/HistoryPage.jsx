import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import {
    Card,
    CardBody,
    Typography,
    IconButton,
    Input,
    Tooltip,
} from "@material-tailwind/react";
import {
    EyeIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import CustomLoading from "../components/CustomLoading";
import endpoints from "../utils/api";

const HistoryPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
            const responseData = await endpoints.page.getDone();
            const dataArray = Array.isArray(responseData) ? responseData : [];
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

    const filteredData = data.filter((item) => {
        if (!item) return false;

        const name = getName(item);
        const institution = getInstitution(item);
        
        return [
            name,
            institution,
            item.type || "",
            item.Prodi?.name || "",
            item.UnitKerjaPenempatan?.name || "",
        ]
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    };

    const handleViewClick = (id) => {
        window.location.href = `/riwayat-pendaftar-magang/detail/${id}`;
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
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                            Institusi
                                                        </Typography>
                                                    </th>
                                                    <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-semibold"
                                                        >
                                                            Prodi/Jurusan
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
                                                                    {getInstitution(item)}
                                                                </Typography>
                                                            </td>
                                                            <td className="p-4">
                                                                <Typography variant="small" color="blue-gray">
                                                                    {item.Prodi?.name || "-"}
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
                                                        <td colSpan="7" className="p-4 text-center">
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
