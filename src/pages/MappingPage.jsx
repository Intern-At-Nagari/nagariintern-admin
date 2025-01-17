import React, { useState, useEffect } from 'react';
import {  toast } from 'react-toastify';
import {
  Card, CardBody, Typography, Button, Dialog,
  DialogHeader, DialogBody, DialogFooter, Input, Alert, Tooltip
} from "@material-tailwind/react";
import {
  MapPinIcon, UsersIcon, ArrowTrendingUpIcon,
  PencilIcon, XMarkIcon, ListBulletIcon, TableCellsIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import Sidebar from '../components/Sidebar';
import BreadcrumbsComponent from '../components/BreadcrumbsComponent';
import axios from 'axios';

const MappingPage = () => {
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    kuotaMhs: '',
    kuotaSiswa: ''
  });

  const fetchBranchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/unit-kerja', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBranchData(response.data);
    } catch (err) {
      setError('Failed to fetch branch data');
      console.error(err);
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
      kuotaMhs: branch ? branch.kuotaMhs.toString() : '',
      kuotaSiswa: branch ? branch.kuotaSiswa.toString() : ''
    });
    setOpen(!open);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const payload = {
        kuotaMhs: parseInt(formData.kuotaMhs) || 0,
        kuotaSiswa: parseInt(formData.kuotaSiswa) || 0
      };
  
      await axios.put(
        `http://localhost:3000/admin/unit-kerja/${selectedBranch.id}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      await fetchBranchData();
      setOpen(false);
      setFormData({ kuotaMhs: '', kuotaSiswa: '' });
      toast.success('Kuota magang berhasil diperbarui!');
  
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update quota';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranchData = branchData.filter(branch => 
    branch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  const totalInterns = branchData.reduce((sum, branch) => sum + branch.kuotaMhs + branch.kuotaSiswa, 0);
  const totalMhs = branchData.reduce((sum, branch) => sum + branch.kuotaMhs, 0);
  const totalSiswa = branchData.reduce((sum, branch) => sum + branch.kuotaSiswa, 0);

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {filteredBranchData.map((branch) => (
        <Card key={branch.id} className="transform transition-all duration-300 hover:shadow-xl">
          <CardBody className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl p-3 bg-blue-500 shadow-blue-500/20 shadow-md">
                  <MapPinIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray" className="font-medium">
                    {branch.name}
                  </Typography>
                  <div className="space-y-1">
                    <Typography className="text-sm text-gray-600">
                      Kuota Mahasiswa: {branch.kuotaMhs}
                    </Typography>
                    <Typography className="text-sm text-gray-600">
                      Kuota Siswa: {branch.kuotaSiswa}
                    </Typography>
                    <Typography className="text-gray-700 text-lg font-bold">
                      Total Kuota: {branch.kuotaMhs + branch.kuotaSiswa}
                    </Typography>
                  </div>
                </div>
              </div>
              <Tooltip className="bg-blue-500" content="Edit Kuota" placement="top"  interactive={false} > 
                <Button size="sm" className="p-2" color="blue" onClick={() => handleOpen(branch)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <Card className="w-full overflow-x-auto border border-blue-gray-100">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr className="bg-white">
            <th className="border-b border-blue-gray-100 p-4">
              <Typography variant="small" color="blue-gray" className="font-semibold leading-none">
                Nama Unit
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 p-4">
              <Typography variant="small" color="blue-gray" className="font-semibold leading-none">
                Kuota Mahasiswa
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 p-4">
              <Typography variant="small" color="blue-gray" className="font-semibold leading-none">
                Kuota Siswa
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 p-4">
              <Typography variant="small" color="blue-gray" className="font-semibold leading-none">
                Total Kuota
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 p-4">
              <Typography variant="small" color="blue-gray" className="font-semibold leading-none">
                Aksi
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredBranchData.map((branch) => (
            <tr key={branch.id} className="hover:bg-blue-gray-50 bg-white">
              <td className="p-4 border-b border-blue-gray-100">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {branch.name}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-100">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {branch.kuotaMhs}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-100">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {branch.kuotaSiswa}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-100">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {branch.kuotaMhs + branch.kuotaSiswa}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-100">
                <Button size="sm" color="blue" onClick={() => handleOpen(branch)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />
        
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <Typography variant="h3" className="font-bold text-gray-800 text-2xl md:text-3xl">
              Pemetaan Peserta Magang
            </Typography>
            <div className="flex gap-4 items-center">
              <div className="relative flex-grow md:w-64">
                <Input
                  type="text"
                  label="Cari Unit Kerja"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  icon={<MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-500" />}
                />
              </div>
              <Button
                color="blue"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsGridView(!isGridView)}
              >
                {isGridView ? (
                  <><ListBulletIcon className="h-4 w-4" /> List View</>
                ) : (
                  <><TableCellsIcon className="h-4 w-4" /> Grid View</>
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
                  <Typography variant="h6" color="blue-gray" className="mb-1">Total Kuota</Typography>
                  <Typography variant="h4" className="font-bold">{totalInterns} Peserta</Typography>
                  <Typography variant="h6" className="font-normal">{totalMhs} Mahasiswa</Typography>
                  <Typography variant="h6" className="font-normal">{totalSiswa} Siswa</Typography>

                </div>
              </CardBody>
            </Card>

            <Card className="shadow-lg">
              <CardBody className="flex items-center gap-4 p-4 md:p-6">
                <div className="rounded-xl p-3 bg-purple-500 shadow-purple-500/20 shadow-lg">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-1">Total Cabang</Typography>
                  <Typography variant="h4" className="font-bold">{branchData.length} Cabang</Typography>
                </div>
              </CardBody>
            </Card>
          </div>

          {isGridView ? renderGridView() : renderListView()}

          <Dialog open={open} handler={handleOpen}>
            <DialogHeader>
              Edit Kuota - {selectedBranch?.name}
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <div>
                  <Typography variant="small" className="mb-2">Kuota Mahasiswa</Typography>
                  <Input
                    type="number"
                    value={formData.kuotaMhs}
                    onChange={(e) => setFormData({...formData, kuotaMhs: e.target.value})}
                    label="Jumlah Kuota Mahasiswa"
                  />
                </div>
                <div>
                  <Typography variant="small" className="mb-2">Kuota Siswa</Typography>
                  <Input
                    type="number"
                    value={formData.kuotaSiswa}
                    onChange={(e) => setFormData({...formData, kuotaSiswa: e.target.value})}
                    label="Jumlah Kuota Siswa"
                  />
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="text" color="red" onClick={() => handleOpen(null)} className="mr-1">
                Batal
              </Button>
              <Button variant="gradient" color="green" onClick={handleSubmit}>
                Simpan
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default MappingPage;