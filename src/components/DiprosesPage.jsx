// src/pages/DiprosesPage.jsx
import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, IconButton, Input, Tooltip } from "@material-tailwind/react";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import ApprovalModal from "../components/ApprovalModal";

const DiprosesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get("http://localhost:3000/intern", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setData(response.data);
          console.log("Data received:", response.data);
        } else {
          throw new Error("No data received from server");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch data";
        setError(errorMessage);
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

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  const handleViewClick = (id) => {
    window.location.href = `/detail/${id}`;
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3000/intern/${selectedItem.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(data.filter(item => item.id !== selectedItem.id));
      setDeleteOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item");
    }
  };

  const handleDeleteOpen = () => setDeleteOpen(!deleteOpen);

  if (error) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
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
                  />
                  <div className="!absolute right-1 top-1 rounded-full">
                    <IconButton variant="text" className="rounded-full">
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </IconButton>
                  </div>
                </div>
              </div>

              {data.length === 0 ? (
                <div className="text-center py-8">
                  <Typography variant="h6" color="blue-gray">
                    No data available
                  </Typography>
                </div>
              ) : (
                <>
                  <Card className="overflow-hidden">
                    <CardBody className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-max table-auto text-left">
                          <thead>
                            <tr>
                              <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                  No
                                </Typography>
                              </th>
                              <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                  Nama
                                </Typography>
                              </th>
                              <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                  Alamat
                                </Typography>
                              </th>
                              <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                  Institusi
                                </Typography>
                              </th>
                              <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                  Tanggal
                                </Typography>
                              </th>
                              <th className="border-b border-blue-gray-100 bg-gray-100 p-4 text-center">
                                <Typography variant="small" color="blue-gray" className="font-semibold">
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
                                    {item.user.nama}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography variant="small" color="blue-gray">
                                    {item.alamat}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography variant="small" color="blue-gray">
                                    {item.institusi}
                                  </Typography>
                                </td>
                                <td className="p-4">
                                  <Typography variant="small" color="blue-gray">
                                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
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
                                    <Tooltip content="Hapus data" className="bg-red-500">
                                      <IconButton
                                        variant="text"
                                        color="red"
                                        className="rounded-full"
                                        onClick={() => handleDeleteClick(item)}
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardBody>
                  </Card>

                  <Pagination
                    active={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      <ApprovalModal
        open={deleteOpen}
        handleOpen={handleDeleteOpen}
        onSubmit={handleDeleteConfirm}
        type="delete"
      />
    </div>
  );
};

export default DiprosesPage;