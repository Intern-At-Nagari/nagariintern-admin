import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Spinner,
} from "@material-tailwind/react";
import {
  UsersIcon,
  ArrowTrendingUpIcon,
  ListBulletIcon,
  TableCellsIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import MappingGridView from "../components/MappingGridView";
import MappingListView from "../components/MappingListView";
import CustomLoading from "../components/CustomLoading";
import endpoints from "../utils/api";
import ModalUnitKerja from "../components/ModalUnitKerja"; // Import the new component

const MappingPage = () => {
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isGridView, setIsGridView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    tipe_cabang: "",
    isCustomQuota: false,
    kuotaMhs: 0,
    kuotaSiswa: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this state

  const BRANCH_TYPES = {
    pusat: { label: "Pusat", kuotaMhs: 0, kuotaSiswa: 16 },
    utama: { label: "Utama", kuotaMhs: 0, kuotaSiswa: 25 },
    a: { label: "Cabang A", kuotaMhs: 8, kuotaSiswa: 10 },
    b: { label: "Cabang B", kuotaMhs: 3, kuotaSiswa: 8 },
    c: { label: "Cabang C", kuotaMhs: 2, kuotaSiswa: 5 },
  };

  const fetchBranchData = async () => {
    try {
      const response = await endpoints.cabang.unitKerja();
      const data = response.unitKerja || [];
      setBranchData(Array.isArray(data) ? data : []);
      setSearchResults(Array.isArray(data) ? data : []);
      console.log(response);
    } catch (err) {
      setError("Failed to fetch branch data");
      console.error(err);
      setBranchData([]);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchData();
  }, []);

  const handleOpen = (branch = null) => {
    setSelectedBranch(branch);
    setFormData({
      tipe_cabang: branch ? branch.tipe_cabang : "",
      isCustomQuota: branch ? branch.isCustomQuota : false,
      kuotaMhs: branch ? branch.kuotaMhs : 0,
      kuotaSiswa: branch ? branch.kuotaSiswa : 0,
    });
    setOpen(!open);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true); // Start loading
      setError(null);

      const payload = {
        tipe_cabang: formData.tipe_cabang,
        isCustomQuota: formData.isCustomQuota,
        ...(formData.isCustomQuota && {
          kuotaMhs: parseInt(formData.kuotaMhs),
          kuotaSiswa: parseInt(formData.kuotaSiswa),
        }),
      };

      await endpoints.edit.updateUnitKerja(selectedBranch.id, payload);
      await fetchBranchData();
      setOpen(false);
      setFormData({
        tipe_cabang: "",
        isCustomQuota: false,
        kuotaMhs: 0,
        kuotaSiswa: 0,
      });
      toast.success("Kuota berhasil diperbarui!");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to update branch type";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSearchResults(branchData);
      return;
    }

    const results = branchData.filter((branch) =>
      branch.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results);
  };

  const calculateTotal = (data, key1, key2) => {
    if (!Array.isArray(data)) return 0;
    return data.reduce(
      (sum, branch) =>
        sum + (Number(branch[key1]) || 0) + (Number(branch[key2]) || 0),
      0
    );
  };

  const totalInterns = calculateTotal(branchData, "kuotaMhs", "kuotaSiswa");
  const availableInterns = calculateTotal(
    branchData,
    "sisaKuotaMhs",
    "sisaKuotaSiswa"
  );
  const totalMhs = Array.isArray(branchData)
    ? branchData.reduce(
        (sum, branch) => sum + (Number(branch.kuotaMhs) || 0),
        0
      )
    : 0;
  const totalSiswa = Array.isArray(branchData)
    ? branchData.reduce(
        (sum, branch) => sum + (Number(branch.kuotaSiswa) || 0),
        0
      )
    : 0;
  const availableMhs = Array.isArray(branchData)
    ? branchData.reduce(
        (sum, branch) => sum + (Number(branch.sisaKuotaMhs) || 0),
        0
      )
    : 0;
  const availableSiswa = Array.isArray(branchData)
    ? branchData.reduce(
        (sum, branch) => sum + (Number(branch.sisaKuotaSiswa) || 0),
        0
      )
    : 0;

  if (loading) {
    return <CustomLoading />;
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <BreadcrumbsComponent />

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div className="flex gap-4 items-center">
            <div className="relative flex w-full md:w-72">
              <Input
                type="text"
                label="Cari Unit Kerja"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pr-20"
                containerProps={{
                  className: "min-w-0",
                }}
                icon={
                  <MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-300" />
                }
              />
            </div>
            <Button
              color="blue"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setIsGridView(!isGridView)}
            >
              {isGridView ? (
                <>
                  <ListBulletIcon className="h-4 w-4" /> List View
                </>
              ) : (
                <>
                  <TableCellsIcon className="h-4 w-4" /> Grid View
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="shadow-lg">
            <CardBody className="flex items-center gap-4 p-4 md:p-6">
              <div className="rounded-xl p-3 bg-blue-500 shadow-blue-500/20 shadow-lg">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Sisa Kuota
                </Typography>
                <Typography variant="h4" className="font-bold">
                  {availableInterns}/{totalInterns} Peserta
                </Typography>
                <Typography variant="h6" className="font-normal">
                  {availableMhs}/{totalMhs} Mahasiswa
                </Typography>
                <Typography variant="h6" className="font-normal">
                  {availableSiswa}/{totalSiswa} Siswa
                </Typography>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="flex items-center gap-4 p-4 md:p-6">
              <div className="rounded-xl p-3 bg-purple-500 shadow-purple-500/20 shadow-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Total Cabang
                </Typography>
                <Typography variant="h4" className="font-bold">
                  {branchData.length} Cabang
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>

        {isGridView ? (
          <MappingGridView
            searchResults={searchResults}
            BRANCH_TYPES={BRANCH_TYPES}
            handleOpen={handleOpen}
          />
        ) : (
          <MappingListView
            searchResults={searchResults}
            BRANCH_TYPES={BRANCH_TYPES}
            handleOpen={handleOpen}
          />
        )}

        <ModalUnitKerja
          open={open}
          handleOpen={handleOpen}
          selectedBranch={selectedBranch}
          formData={formData}
          setFormData={setFormData}
          BRANCH_TYPES={BRANCH_TYPES}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default MappingPage;