import React from "react";
import { Typography, Chip, IconButton } from "@material-tailwind/react";
import { PencilIcon, ClockIcon } from "@heroicons/react/24/outline";

const ScheduleTable = ({
  schedules,
  remainingTimes,
  getRegistrationStatus,
  getStatusColor,
  formatTimeRemaining,
  handleEditOpen,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] table-auto text-left">
        <thead className="rounded-t-lg">
          <tr>
            <th className="border-b border-blue-gray-100 bg-gray-100 p-4 rounded-tl-lg">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none"
              >
                Nama
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none"
              >
                Tanggal Mulai
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none"
              >
                Tanggal Selesai
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none"
              >
                Status
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none"
              >
                Sisa Waktu
              </Typography>
            </th>
            <th className="border-b border-blue-gray-100 bg-gray-100 p-4 rounded-tr-lg">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none"
              >
                Aksi
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => {
            const status = getRegistrationStatus(
              schedule.tanggalMulai,
              schedule.tanggalTutup
            );
            const timeRemaining = remainingTimes[schedule.id];

            return (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="p-4 whitespace-nowrap">{schedule.nama}</td>
                <td className="p-4 whitespace-nowrap">
                  {new Date(schedule.tanggalMulai).toLocaleDateString()}
                </td>
                <td className="p-4 whitespace-nowrap">
                  {new Date(schedule.tanggalTutup).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Chip
                    size="sm"
                    variant="gradient"
                    color={getStatusColor(status)}
                    value={status}
                    className="text-xs"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-blue-500" />
                    <Typography variant="small" className="font-medium whitespace-nowrap">
                      {formatTimeRemaining(timeRemaining)}
                    </Typography>
                  </div>
                </td>
                <td className="p-4">
                  <IconButton
                    variant="text"
                    color="blue"
                    onClick={() => handleEditOpen(schedule)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>  
  );
      
};

export default ScheduleTable;
