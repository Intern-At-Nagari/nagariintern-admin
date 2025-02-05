import React from "react";
import { Typography } from "@material-tailwind/react";

const TableView = ({ participants, type, formatDate }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          {[
            "No",
            "Nama",
            type === "Perguruan Tinggi" ? "NIM" : "NISN",
            "Email",
            "No. HP",
            "Unit Kerja",
            "Periode",
          ].map((head) => (
            <th
              key={head}
              className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
        {participants.map((participant, index) => (
          <tr key={index} className="even:bg-blue-gray-50/50">
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {index + 1}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {participant.nama_peserta}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {type === "Perguruan Tinggi" ? participant.nim : participant.nisn}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {participant.email}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {participant.no_hp}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {participant.unit_kerja}
              </Typography>
            </td>
            <td className="p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {formatDate(participant.tanggal_mulai)} - {formatDate(participant.tanggal_selesai)}
              </Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableView;