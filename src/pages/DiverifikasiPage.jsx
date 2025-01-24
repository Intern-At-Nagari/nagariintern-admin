import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Input,
  Tooltip,
} from "@material-tailwind/react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const DiverifikasiPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        "http://localhost:3000/admin/diverifikasi",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const responseData = response.data;

      // Grouping logic for mahasiswa
      const mahasiswaGrouped = responseData.mahasiswa.dataMhs.reduce(
        (acc, item) => {
          const key = `${item.PerguruanTinggi.name}-${item.Prodi.name}-${item.UnitKerjaPenempatan.name}`;
          if (!acc[key]) {
            acc[key] = {
              id: item.id,
              idInstitusi: item.PerguruanTinggi.id,
              idProdi: item.Prodi.id,
              institusi: item.PerguruanTinggi.name,
              prodi: item.Prodi.name,
              unitKerja: item.UnitKerjaPenempatan.name,
              idUnitKerja: item.UnitKerjaPenempatan.id,
              jml: 0,
            };
          }
          acc[key].jml += 1;
          return acc;
        },
        {}
      );

      // Grouping logic for siswa
      const siswaGrouped = responseData.siswa.dataSiswa.reduce((acc, item) => {
        const key = `${item.Smk.name}-${item.UnitKerjaPenempatan.name}`;
        if (!acc[key]) {
          acc[key] = {
            id: item.id,
            institusi: item.Smk.name,
            idInstitusi: item.Smk.id,
            idUnitKerja: item.UnitKerjaPenempatan.id,
            prodi: "-",
            unitKerja: item.UnitKerjaPenempatan.name,
            jml: 0,
          };
        }
        acc[key].jml += 1;
        return acc;
      }, {});

      const combinedData = [
        ...Object.values(mahasiswaGrouped),
        ...Object.values(siswaGrouped),
      ];
      console.log(combinedData);
      setData(combinedData);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch data"
      );
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const navigate = useNavigate();

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Handle delete logic here
    setDeleteOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteOpen = () => setDeleteOpen(!deleteOpen);

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />
          <div className="mb-4">
            <div className="relative flex w-full max-w-[24rem]">
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Card className="overflow-hidden">
              <CardBody className="p-0">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold leading-none"
                          >
                            No
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold leading-none"
                          >
                            Institusi
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold leading-none"
                          >
                            Prodi
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold leading-none"
                          >
                            Unit Kerja
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold leading-none"
                          >
                            Jumlah Peserta
                          </Typography>
                        </th>
                        <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold leading-none"
                          >
                            Aksi
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentPageData().map((item, index) => (
                        <tr key={item.id} className="even:bg-gray-100/50">
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {item.institusi}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {item.prodi}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {item.unitKerja}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <Typography variant="small" color="blue-gray">
                              {item.jml}
                            </Typography>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Tooltip
                                content="Lihat detail"
                                className="bg-blue-500"
                              >
                                <IconButton
                                  variant="text"
                                  color="blue"
                                  className="rounded-full"
                                  onClick={() =>
                                    navigate(`/diverifikasi/detail`, {
                                      state: {
                                        type: item.prodi === "-" ? "Sekolah" : "Perguruan Tinggi",
                                        name: item.institusi,
                                        prodi: item.prodi,
                                        idInstitusi: item.idInstitusi,
                                        idProdi: item.idProdi,
                                        idUnitKerja: item.idUnitKerja,
                                      },
                                    })
                                  }
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredData.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-4 text-center">
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
            </Card>
          )}

          <Pagination
            active={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <Modal
        open={deleteOpen}
        handleOpen={handleDeleteOpen}
        onSubmit={handleDeleteConfirm}
        type="delete"
      />
    </div>
  );
};

export default DiverifikasiPage;