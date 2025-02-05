import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Dialog,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import { branches } from "../data/Unit";
import axios from "axios";
import { PencilIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateAccountPage = () => {
  const [accounts, setAccounts] = useState([]);
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

  // Fetch existing accounts
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/account-pegawai-cabang`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.status === "success") {
        setAccounts(
          response.data.data.map((account) => ({
            id: account.User.id,
            email: account.User.email,
            unitKerja: account.UnitKerja.name,
            isVerified: account.User.isVerified ? "Ya" : "Tidak",
            createdAt: new Date(account.createdAt).toLocaleString(),
          }))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil akun");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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
      password: "", // Reset password field
    }));
    setIsEditModalVisible(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEditPassword = async (e) => {
    e.preventDefault();

    // Move validation checks to a separate function
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

    setLoading(true);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/edit-password-pegawai-cabang/${selectedAccountId}`,
        { password: formData.password },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Remove sensitive data logging
      if (response.data.status === "success") {
        toast.success("Kata sandi berhasil diubah");
        setIsEditModalVisible(false);
        resetForm();
        await fetchAccounts();
      }
    } catch (error) {
      // More specific error handling
      if (error.response?.status === 404) {
        toast.error("Akun tidak ditemukan");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal mengubah kata sandi");
      }
    } finally {
      setLoading(false);
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

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/create-account-pegawai-cabang`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Akun berhasil dibuat. Email verifikasi telah dikirim!");
        setIsCreateModalVisible(false);
        resetForm();
        fetchAccounts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat akun");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalVisible(false);
    setIsEditModalVisible(false);
    resetForm();
  };

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <BreadcrumbsComponent />
        <div className="mb-4 flex justify-between items-center">
          <Typography variant="h5" color="blue-gray">
            Manajemen Akun
          </Typography>
          <Button onClick={() => setIsCreateModalVisible(true)} color="blue">
            Buat Akun Baru
          </Button>
        </div>

        <Card className="h-full w-full overflow-scroll">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-gray-100 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    <Typography variant="small" color="blue-gray">
                      Belum ada akun yang dibuat
                    </Typography>
                  </td>
                </tr>
              ) : (
                accounts.map((account, index) => (
                  <tr key={index} className="even:bg-blue-gray-50/50">
                    <td className="p-4">{account.email}</td>
                    <td className="p-4">{account.unitKerja}</td>
                    <td className="p-4">{account.isVerified}</td>
                    <td className="p-4">{account.createdAt}</td>
                    <td className="p-4">
                      <Button
                        onClick={() => handleOpenEditModal(account.id)}
                        color="blue"
                        variant="text"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

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
                variant="outlined"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading} color="blue">
                {loading ? "Membuat..." : "Buat Akun"}
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
                variant="outlined"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading} color="blue">
                {loading ? "Mengubah..." : "Ubah Kata Sandi"}
              </Button>
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default CreateAccountPage;
