import React, { useState, useEffect } from "react";
import {
  Input,
} from "@material-tailwind/react";
import {  MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { useNavigate } from "react-router-dom";
import TableComponent from "../components/TableComponent";
import CustomLoading from "../components/CustomLoading";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const DiverifikasiPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10; // Items per page

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
        `${API_BASE_URL}/superadmin/diverifikasi`,
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
    setCurrentPage(1); // Reset to the first page when searching
  };

  const navigate = useNavigate();

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const columns = [
    { 
      label: "No",
      accessor: "no"
    },
    { 
      label: "Institusi",
      accessor: "institusi" 
    },
    { 
      label: "Prodi",
      accessor: "prodi"
    },
    { 
      label: "Unit Kerja",
      accessor: "unitKerja"
    },
    { 
      label: "Jumlah Peserta",
      accessor: "jml"
    }
  ];
 
  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
    <Sidebar />
    <div className="flex-1 p-6">
      <BreadcrumbsComponent />
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex w-full md:w-72">
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
      </div>
  
          {loading ? (
            <CustomLoading />
          ) : (
            <TableComponent
              data={filteredData}
              columns={columns}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              handleViewClick={(id) => 
                navigate(`/diverifikasi/detail`, {
                  state: {
                    type: filteredData.find(item => item.id === id)?.prodi === "-" ? "Sekolah" : "Perguruan Tinggi",
                    name: filteredData.find(item => item.id === id)?.institusi,
                    prodi: filteredData.find(item => item.id === id)?.prodi,
                    idInstitusi: filteredData.find(item => item.id === id)?.idInstitusi,
                    idProdi: filteredData.find(item => item.id === id)?.idProdi,
                    idUnitKerja: filteredData.find(item => item.id === id)?.idUnitKerja,
                  },
                })
              }
            />
          )}
        </div>
      </div>
  );
};

export default DiverifikasiPage;