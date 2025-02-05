import React from "react";
import { Card, CardBody, Typography, Button, Tooltip } from "@material-tailwind/react";
import { MapPinIcon, PencilIcon } from "@heroicons/react/24/outline";

const MappingGridView = ({ searchResults, BRANCH_TYPES, handleOpen }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {searchResults.map((branch) => (
        <Card
          key={branch.id}
          className="transform transition-all duration-300 hover:shadow-xl"
        >
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
                      Tipe Cabang:{" "}
                      {BRANCH_TYPES[branch.tipe_cabang]?.label || branch.tipe_cabang}
                    </Typography>
                    <Typography className="text-sm text-gray-600">
                      Kuota Mahasiswa: {branch.sisaKuotaMhs}/{branch.kuotaMhs}
                    </Typography>
                    <Typography className="text-sm text-gray-600">
                      Kuota Siswa: {branch.sisaKuotaSiswa}/{branch.kuotaSiswa}
                    </Typography>
                    <Typography className="text-gray-700 text-lg font-bold">
                      Sisa Kuota: {branch.sisaKuotaMhs + branch.sisaKuotaSiswa}/{branch.kuotaMhs + branch.kuotaSiswa}
                    </Typography>
                  </div>
                </div>
              </div>
              <Tooltip content="Edit Tipe Cabang" placement="top" className="bg-blue-500" interactive={false}>
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
};

export default MappingGridView;