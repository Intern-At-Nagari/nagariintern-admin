import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Input,
  Spinner,
  Tooltip,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { useNavigate } from "react-router-dom";

const Diverifikasi = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({ universities: [], schools: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get token from localStorage
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3000/diterima", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setData(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Access denied. Please login again.");
        // Optionally redirect to login
        // window.location.href = '/login';
      } else {
        setError("Failed to fetch data. Please try again later.");
      }
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const navigate = useNavigate();
  const filteredData = [
    ...data.universities.flatMap((uni) =>
      uni.prodi.map((prodi) => ({
        type: "Perguruan Tinggi",
        name: uni.nama_institusi,
        prodi: prodi.nama_prodi,
        total: prodi.total_diterima,
      }))
    ),
    ...data.schools.map((school) => ({
      type: "Sekolah",
      name: school.nama_institusi,
      prodi: "-",
      total: school.total_diterima,
    })),
  ].filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prodi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 flex items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h6" color="red" className="mb-2">
            {error}
          </Typography>
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ...existing imports and state...

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
                          Tipe Institusi
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          Nama Institusi
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          Program Studi
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          Total Diterima
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
                    {filteredData.map((item, index) => (
                      <tr key={index} className="even:bg-gray-100/50">
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {index + 1}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.type}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.name}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.prodi}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.total}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            <Tooltip
                              content="Lihat detail"
                              className="bg-blue-500"
                            >
                              <IconButton
                                variant="text"
                                color="blue"
                                className="rounded-full"
                                onClick={() =>
                                  navigate(`/intern/diterima/detail`, {
                                    state: {
                                      type: item.type,
                                      name: item.name,
                                      prodi: item.prodi,
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
                        <td colSpan="5" className="p-4 text-center">
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
        </div>
      </div>
    </div>
  );
};

export default Diverifikasi;
