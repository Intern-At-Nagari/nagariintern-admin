import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography
} from "@material-tailwind/react";

const Modal = ({
  open,
  handleOpen,
  onSubmit
}) => {
  const handleSubmit = () => {
    onSubmit();
    handleOpen();
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Hapus Data</DialogHeader>
      <DialogBody divider>
        <Typography className="mb-4">
          Apakah Anda yakin ingin menghapus data ini?
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button 
          variant="text" 
          color="gray" 
          onClick={handleOpen}
          className="mr-1"
        >
          Batal
        </Button>
        <Button
          variant="filled"
          color="red"
          onClick={handleSubmit}
        >
          Hapus
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default Modal;