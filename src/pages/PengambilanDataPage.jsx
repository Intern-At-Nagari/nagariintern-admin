import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Typography, Spinner } from '@material-tailwind/react';
import dayjs from 'dayjs';
import Sidebar from '../components/Sidebar';
import BreadcrumbsComponent from '../components/BreadcrumbsComponent';
import endpoints from '../utils/api';
import { toast } from 'react-toastify';
import CustomLoading from '../components/CustomLoading';

const PengambilanDataPage = () => {
    const [formData, setFormData] = useState({
        nomor_surat: '',
        perihal: '',
        detail_perihal: '',
        pejabat: '',
        nama_perguruan_tinggi: '',
        tanggal_diajukan: '',
        nama_peneliti: '',
        nim_peneliti: '',
        program_studi: '',
        judul_penelitian: '',
        nama_perusahaan: '',
        cabang: '',
        nama_penerima: '',
        jabatan_penerima: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Format date using dayjs
            const formattedData = {
                ...formData,
                tanggal_diajukan: dayjs(formData.tanggal_diajukan).format('YYYY-MM-DD')
            };

            // Make POST request using the API utility
            const response = await endpoints.generateDocument.suratPengambilanData(formattedData);

            // Create blob URL and trigger download
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'surat_pengambilan_data.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            // Reset form after successful download
            setFormData({
                nomor_surat: '',
                perihal: '',
                detail_perihal: '',
                pejabat: '',
                nama_perguruan_tinggi: '',
                tanggal_diajukan: '',
                nama_peneliti: '',
                nim_peneliti: '',
                program_studi: '',
                judul_penelitian: '',
                nama_perusahaan: '',
                cabang: '',
                nama_penerima: '',
                jabatan_penerima: ''
            });

            // Show success message
            toast.success('Surat berhasil digenerate');

        } catch (error) {
            if (error.response) {
                alert(`Gagal generate surat: ${error.response.data?.message || 'Terjadi kesalahan'}`);
            } else if (error.request) {
                alert('Tidak dapat terhubung ke server. Periksa koneksi anda.');
            } else {
                alert('Gagal mengirim data: ' + error.message);
            }
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    if (loading) return <CustomLoading />;

    return (
        <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
            <Sidebar />
            <div className="flex-1 p-6 ">
                <BreadcrumbsComponent />
                <Card className="mt-6 w-full shadow-lg">
                    <CardHeader
                        variant="gradient"
                        color="blue"
                        className="mb-8 p-6"
                    >
                        <Typography variant="h5" color="white">
                            Generate Surat Pengambilan Data
                        </Typography>
                    </CardHeader>
                    <CardBody className="px-6 pb-8">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Input
                                    type="text"
                                    name="nomor_surat"
                                    value={formData.nomor_surat}
                                    onChange={handleInputChange}
                                    required
                                    label="Nomor Surat"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="perihal"
                                    value={formData.perihal}
                                    onChange={handleInputChange}
                                    required
                                    label="Perihal"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    type="text"
                                    name="detail_perihal"
                                    value={formData.detail_perihal}
                                    onChange={handleInputChange}
                                    required
                                    label="Detail Perihal"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="pejabat"
                                    value={formData.pejabat}
                                    onChange={handleInputChange}
                                    required
                                    label="Pejabat"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="nama_perguruan_tinggi"
                                    value={formData.nama_perguruan_tinggi}
                                    onChange={handleInputChange}
                                    required
                                    label="Nama Perguruan Tinggi"
                                />
                            </div>

                            <div>
                                <Input
                                    type="date"
                                    name="tanggal_diajukan"
                                    value={formData.tanggal_diajukan}
                                    onChange={handleInputChange}
                                    required
                                    label="Tanggal Diajukan"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="nama_peneliti"
                                    value={formData.nama_peneliti}
                                    onChange={handleInputChange}
                                    required
                                    label="Nama Peneliti"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="nim_peneliti"
                                    value={formData.nim_peneliti}
                                    onChange={handleInputChange}
                                    required
                                    label="NIM Peneliti"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="program_studi"
                                    value={formData.program_studi}
                                    onChange={handleInputChange}
                                    required
                                    label="Program Studi"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    type="text"
                                    name="judul_penelitian"
                                    value={formData.judul_penelitian}
                                    onChange={handleInputChange}
                                    required
                                    label="Judul Penelitian"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="nama_perusahaan"
                                    value={formData.nama_perusahaan}
                                    onChange={handleInputChange}
                                    required
                                    label="Nama Perusahaan"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="cabang"
                                    value={formData.cabang}
                                    onChange={handleInputChange}
                                    required
                                    label="Cabang"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="nama_penerima"
                                    value={formData.nama_penerima}
                                    onChange={handleInputChange}
                                    required
                                    label="Nama Penerima"
                                />
                            </div>

                            <div>
                                <Input
                                    type="text"
                                    name="jabatan_penerima"
                                    value={formData.jabatan_penerima}
                                    onChange={handleInputChange}
                                    required
                                    label="Jabatan Penerima"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-6">
                                <Button
                                    type="submit"
                                    className="flex items-center gap-3"
                                    size="lg"
                                    color='blue'
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner className="h-4 w-4" />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        'Generate'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default PengambilanDataPage;