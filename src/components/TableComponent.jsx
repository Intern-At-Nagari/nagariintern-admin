import React from "react";
import {
  Typography,
  IconButton,
  Tooltip,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Pagination from "./Pagination";

const TableComponent = ({
  data,
  columns,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  handleViewClick,
  actionIcon = "eye", // Default to eye icon
  actionTooltip = "Lihat detail",
}) => {
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getNestedValue = (obj, path) => {
    return (
      path.split(".").reduce((acc, part) => acc && acc[part], obj) ?? "N/A"
    );
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const renderCellContent = (item, column, index) => {
    if (column.label === "No") {
      return (currentPage - 1) * itemsPerPage + index + 1;
    }

    if (column.render) {
      return column.render(item, index);
    }

    const value = getNestedValue(item, column.accessor);

    if (column.label === "Periode") {
      const startDate = formatDate(item.tanggalMulai);
      const endDate = formatDate(item.tanggalSelesai);
      return `${startDate} - ${endDate}`;
    }

    return value;
  };

  return (
    <Card className="overflow-hidden">
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.label}
                    className="border-b border-blue-gray-100 bg-gray-100 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-semibold leading-none"
                    >
                      {col.label}
                    </Typography>
                  </th>
                ))}
                <th className="border-b border-blue-gray-100 bg-gray-100 p-4 text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold leading-none"
                  >
                    Aksi
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageData().map((item, index) => (
                <tr key={index} className="even:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.label} className="p-4">
                      <Typography variant="small" color="blue-gray">
                        {renderCellContent(item, col, index)}
                      </Typography>
                    </td>
                  ))}
                  <td className="p-4 text-center">
                    <Tooltip content={actionTooltip} className = "bg-blue-500"> 
                      <IconButton
                        variant="text"
                        color="blue"
                        onClick={() => handleViewClick(item.id)}
                      >
                        {actionIcon === "pencil" ? (
                          <PencilIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="p-4 text-center">
                    <Typography variant="small" color="blue-gray">
                      No data found
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
      {totalPages > 1 && (
        <Pagination
          active={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </Card>
  );
};

export default TableComponent;
