import React from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/outline";

const MappingListView = ({ searchResults, BRANCH_TYPES, handleOpen }) => {
  return (
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
                Tipe Cabang
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
                Total Sisa Kuota
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
          {searchResults.map((branch) => (
            <tr key={branch.id} className="hover:bg-blue-gray-50 bg-white">
              <td className="p-4 border-b border-blue-gray-100">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {branch.name}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-100">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {BRANCH_TYPES[branch.tipe_cabang]?.label || branch.tipe_cabang}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-100">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {branch.sisaKuotaMhs}/{branch.kuotaMhs}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-100">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {branch.sisaKuotaSiswa}/{branch.kuotaSiswa}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-100">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {branch.sisaKuotaMhs + branch.sisaKuotaSiswa}/{branch.kuotaMhs + branch.kuotaSiswa}
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
};

export default MappingListView;