import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Spinner,
} from "@material-tailwind/react";
import {
  ArrowUpTrayIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const UploadModal = React.memo(
  ({ open, onClose, onSubmit, isLoading }) => {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile.type === "application/pdf") {
        if (selectedFile.size <= 5242880) {
          setFile(selectedFile);
        } else {
          toast.error("File size should be less than 5MB");
        }
      } else {
        toast.error("Please upload PDF file only");
      }
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile.type === "application/pdf") {
          if (droppedFile.size <= 5242880) {
            setFile(droppedFile);
          } else {
            toast.error("File size should be less than 5MB");
          }
        } else {
          toast.error("Please upload PDF file only");
        }
      }
    };

    const clearFile = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    return (
      <Dialog open={open} handler={onClose} size="md">
        <DialogHeader>Upload Surat Balasan</DialogHeader>
        <DialogBody divider>
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="text-center pointer-events-none">
              <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm text-gray-600 justify-center">
                <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload a file</span>
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF up to 5MB</p>
            </div>
            {file && (
              <div className="mt-4 flex items-center justify-between p-2 bg-gray-50 rounded-md z-20 relative">
                <div className="flex items-center">
                  <DocumentIcon className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-500">{file.name}</span>
                </div>
                <button
                  onClick={clearFile}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors z-30"
                  type="button"
                  aria-label="Clear file"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="red" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={() => onSubmit(file)}
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                Uploading...
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }
);

export default UploadModal;