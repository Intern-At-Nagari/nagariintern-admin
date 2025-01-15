import React, { useState } from "react";
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
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import ApprovalModal from "../components/ApprovalModal";

const Diverifikasi = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const itemsPerPage = 10;

  // Sample data array
  const data = [
    {
      id: 1,
      nama: "John Doe",
      email: "johndoe@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Indonesia",
      periode: "2 bulan",
      tanggal: "2024-01-01",
    },
    {
      id: 2,
      nama: "Jane Smith",
      email: "janesmith@gmail.com",
      alamat: "jalan 1",
      institusi: "Institut Teknologi Bandung",
      periode: "2 bulan",
      tanggal: "2024-01-02",
    },
    {
      id: 3,
      nama: "Alice Johnson",
      email: "alicejohnson@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Gadjah Mada",
      periode: "2 bulan",
      tanggal: "2024-01-03",
    },
    {
      id: 4,
      nama: "Bob Wilson",
      email: "bobwilson@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Brawijaya",
      periode: "2 bulan",
      tanggal: "2024-01-04",
    },
    {
      id: 5,
      nama: "Carol Brown",
      email: "carolbrown@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Padjadjaran",
      periode: "2 bulan",
      tanggal: "2024-01-05",
    },
    {
      id: 6,
      nama: "David Lee",
      email: "davidlee@gmail.com",
      alamat: "jalan 1",
      institusi: "Institut Teknologi Sepuluh November",
      periode: "2 bulan",
      tanggal: "2024-01-06",
    },
    {
      id: 7,
      nama: "Eva Garcia",
      email: "evagarcia@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Diponegoro",
      periode: "2 bulan",
      tanggal: "2024-01-07",
    },
    {
      id: 8,
      nama: "Frank Miller",
      email: "frankmiller@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Airlangga",
      periode: "2 bulan",
      tanggal: "2024-01-08",
    },
    {
      id: 9,
      nama: "Grace Taylor",
      email: "gracetaylor@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Hasanuddin",
      periode: "2 bulan",
      tanggal: "2024-01-09",
    },
    {
      id: 10,
      nama: "Henry Davis",
      email: "henrydavis@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Negeri Yogyakarta",
      periode: "2 bulan",
      tanggal: "2024-01-10",
    },
    {
      id: 11,
      nama: "Ivy Chen",
      email: "ivychen@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Sebelas Maret",
      periode: "2 bulan",
      tanggal: "2024-01-11",
    },
    {
      id: 12,
      nama: "Jack Martin",
      email: "jackmartin@gmail.com",
      alamat: "jalan 1",
      institusi: "Universitas Pendidikan Indonesia",
      periode: "2 bulan",
      tanggal: "2024-01-12",
    },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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

  const handleViewClick = () => {
    window.location.href = `/detail`;
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
              />
              <div className="!absolute right-1 top-1 rounded-full">
                <IconButton variant="text" className="rounded-full">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </IconButton>
              </div>
            </div>
          </div>

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
                          Nama
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Email
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Alamat
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
                          Tanggal
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Periode
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4 text-center">
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
                            {item.nama}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.email}
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
                            {new Date(item.tanggal).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.periode}
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
                                onClick={() => handleViewClick()}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip
                              content="Hapus data"
                              className="bg-red-500"
                            >
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

export default Diverifikasi;
