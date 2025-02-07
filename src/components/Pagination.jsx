// Pagination.jsx
import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Pagination = ({ active, totalPages, onPageChange }) => {
  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => onPageChange(index),
  });

  const next = () => {
    if (active === totalPages) return;
    onPageChange(active + 1);
  };

  const prev = () => {
    if (active === 1) return;
    onPageChange(active - 1);
  };

  const renderPageButtons = () => {
    const buttons = [];
    let start = Math.max(1, active - 2);
    let end = Math.min(totalPages, start + 4);
    
    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(1, end - 4);
    }
  
    for (let i = start; i <= end; i++) {
      buttons.push(
        <IconButton key={i} {...getItemProps(i)} color="blue">
          {i}
        </IconButton>
      );
    }
    return buttons;
  };
  

  return (
    <div className="flex items-center justify-center gap-4 border-t border-blue-gray-50 p-4 ">
      <Button
        variant="text"
        className="flex items-center gap-2"
        
        onClick={prev}
        disabled={active === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-2">
        {renderPageButtons()}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        disabled={active === totalPages}
        
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;