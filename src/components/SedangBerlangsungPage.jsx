import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Input,
  Tooltip,
} from "@material-tailwind/react";
import { EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";
import Pagination from "./Pagination";
import BreadcrumbsComponent from "./BreadcrumbsComponent";

const SedangBerlangsungPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Sample data array
  const data = [
    {
      no: 1,
      nama: "John Doe",
      no_hp: "081234567890",
      tempat_magang: "Cabang Bukittinggi",
      tanggal_mulai: "2024-01-01",
      tanggal_selesai: "2024-03-01",
    },
    {
      no: 2,
      nama: "Jane Smith",
      no_hp: "081234567891",
      tempat_magang: "Cabang Bandung",
      tanggal_mulai: "2024-01-02",
      tanggal_selesai: "2024-03-02",
    },
    {
      no: 3,
      nama: "Alice Johnson",
      no_hp: "081234567892",
      tempat_magang: "Cabang Padang Panjang",
      tanggal_mulai: "2024-01-03",
      tanggal_selesai: "2024-03-03",
    },
    {
      no: 4,
      nama: "Bob Wilson",
      no_hp: "081234567893",
      tempat_magang: "Cabang Jakarta",
      tanggal_mulai: "2024-01-04",
      tanggal_selesai: "2024-03-04",
    },
    {
      no: 5,
      nama: "Carol Brown",
      no_hp: "081234567894",
      tempat_magang: "Cabang Pariaman",
      tanggal_mulai: "2024-01-05",
      tanggal_selesai: "2024-03-05",
    },
    {
      no: 6,
      nama: "David Lee",
      no_hp: "081234567895",
      tempat_magang: "Cabang Pekanbaru",
      tanggal_mulai: "2024-01-06",
      tanggal_selesai: "2024-03-06",
    },
    {
      no: 7,
      nama: "Eva Garcia",
      no_hp: "081234567896",
      tempat_magang: "Cabang Solok",
      tanggal_mulai: "2024-01-07",
      tanggal_selesai: "2024-03-07",
    },
    {
      no: 8,
      nama: "Frank Miller",
      no_hp: "081234567897",
      tempat_magang: "Cabang Utama Padang",
      tanggal_mulai: "2024-01-08",
      tanggal_selesai: "2024-03-08",
    },
    {
      no: 9,
      nama: "Grace Taylor",
      no_hp: "081234567898",
      tempat_magang: "Cabang Payakumbuh",
      tanggal_mulai: "2024-01-09",
      tanggal_selesai: "2024-03-09",
    },
    {
      no: 10,
      nama: "Henry Davis",
      no_hp: "081234567899",
      tempat_magang: "Cabang Lubuk Alung",
      tanggal_mulai: "2024-01-10",
      tanggal_selesai: "2024-03-10",
    },
    {
      no: 11,
      nama: "Ivy Chen",
      no_hp: "081234567800",
      tempat_magang: "Cabang Alahan Panjang",
      tanggal_mulai: "2024-01-11",
      tanggal_selesai: "2024-03-11",
    },
    {
      no: 12,
      nama: "Jack Martin",
      no_hp: "081234567801",
      tempat_magang: "Cabang Alahan Panjang",
      tanggal_mulai: "2024-01-12",
      tanggal_selesai: "2024-03-12",
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
                          Nomor HP
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Tempat Magang
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Tanggal Mulai
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold leading-none"
                        >
                          Tanggal Selesai
                        </Typography>
                      </th>

                      <th className="border-b border-blue-gray-100 bg-gray-100 p-4 text-start">
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
                            {item.no_hp}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.tempat_magang}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.tanggal_mulai}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray">
                            {item.tanggal_selesai}
                          </Typography>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <Tooltip
                              content="Lihat Detail"
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
    </div>
  );
};

export default SedangBerlangsungPage;
