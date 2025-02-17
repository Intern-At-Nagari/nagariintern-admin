import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Dialog,
  Input,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import TableComponent from "../components/TableComponent";
import { branches } from "../Data/Unit";
import {
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import endpoints from "../utils/api";
import CustomLoading from "../components/CustomLoading";


const CreateAccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    unitKerjaId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false); // New state for button loading

  const itemsPerPage = 10;
  const fetchAccounts = async () => {
    setLoading(true);
    try {

      const result = await endpoints.accounts.getAll();
      if (result.status === "success") {
        const accountsData = result.data.map((account) => ({
          id: account.User.id,
          email: account.User.email,
          unitKerja: account.UnitKerja.name,
          isVerified: account.User.isVerified ? "Ya" : "Tidak",
          createdAt: new Date(account.createdAt).toLocaleString(),
        }));
        accountsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAccounts(accountsData);
        setFilteredAccounts(accountsData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil akun");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const filtered = accounts.filter(
      (account) =>
        account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.unitKerja.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAccounts(filtered);
    setCurrentPage(1);
  }, [searchQuery, accounts]);

  const TABLE_HEAD = [
    "Email",
    "Unit Kerja",
    "isVerified",
    "Dibuat Pada",
    "Aksi",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      unitKerjaId: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      email: "",
      unitKerjaId: "",
      password: "",
    });
  };

  const handleOpenEditModal = (accountId) => {
    setSelectedAccountId(accountId);
    setFormData((prev) => ({
      ...prev,
      password: "",
    }));
    setIsEditModalVisible(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEditPassword = async (e) => {
    e.preventDefault();

    const validatePassword = (password) => {
      if (!password) {
        toast.error("Harap isi kata sandi");
        return false;
      }
      if (password.length < 6) {
        toast.error("Kata sandi harus minimal 6 karakter");
        return false;
      }
      return true;
    };

    if (!validatePassword(formData.password)) {
      return;
    }

    setButtonLoading(true);
    try {

      const result = await endpoints.edit.updatePassword(
        selectedAccountId,
        formData.password

      );

      if (result.status === "success") {
        toast.success("Kata sandi berhasil diubah");
        setIsEditModalVisible(false);
        resetForm();
        await fetchAccounts();
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Akun tidak ditemukan");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal mengubah kata sandi");
      }
    } finally {
      setButtonLoading(false);
    }
  };


  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.unitKerjaId) {
      toast.error("Harap isi semua kolom");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Harap masukkan alamat email yang valid");
      return;
    }

    setButtonLoading(true);
    try {

      const result = await endpoints.accounts.create(formData);


      if (result.status === "success") {
        toast.success("Akun berhasil dibuat. Email verifikasi telah dikirim!");
        setIsCreateModalVisible(false);
        resetForm();
        await fetchAccounts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat akun");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    resetForm();
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const columns = [
    {
      label: "No",
      accessor: "no",
    },
    {
      label: "Email",
      accessor: "email",
    },
    {
      label: "Unit Kerja",
      accessor: "unitKerja",
    },
    {
      label: "Status Verifikasi",
      accessor: "isVerified",
    },
    {
      label: "Dibuat Pada",
      accessor: "createdAt",
    },
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
                label="Cari akun..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pr-20"
                containerProps={{
                  className: "min-w-0",
                }}
                icon={
                  <MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-500" />
                }
              />
            </div>
            <Button onClick={() => setIsCreateModalVisible(true)} color="blue">
              Buat Akun Baru
            </Button>
          </div>
        </div>
        {loading ? (
        <CustomLoading/>
      ) : (
        <TableComponent
          data={filteredAccounts}
          columns={columns}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          handleViewClick={handleOpenEditModal}
          actionIcon="pencil"
          actionTooltip="Edit"
          />
      )}

        <Dialog
          open={isCreateModalVisible}
          handler={handleCloseModal}
          className="p-6"
          size="sm"
        >
          <Typography variant="h6" className="mb-4">
            Buat Akun Baru
          </Typography>
          <form onSubmit={handleCreateAccount}>
            <div className="mb-4">
              <Input
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <Select
                label="Unit Kerja"
                value={formData.unitKerjaId}
                onChange={handleSelectChange}
                required
              >
                {branches.map((branch) => (
                  <Option key={branch.id} value={branch.id}>
                    {branch.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button
                variant="text"
                onClick={handleCloseModal}
                disabled={buttonLoading}
                color="red"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={buttonLoading} color="blue">
                {buttonLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Buat Akun"
                )}
              </Button>
            </div>
          </form>
        </Dialog>

        <Dialog
          open={isEditModalVisible}
          handler={handleCloseModal}
          className="p-6"
          size="sm"
        >
          <Typography variant="h6" className="mb-4">
            Edit Kata Sandi
          </Typography>
          <form onSubmit={handleEditPassword}>
            <div className="mb-4 relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Kata Sandi Baru"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-2.5 cursor-pointer"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button
                variant="text"
                color="red"
                onClick={handleCloseModal}
                disabled={buttonLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={buttonLoading} color="blue">
                {buttonLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Ubah Sandi"
                )}
              </Button>
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateAccountPage;