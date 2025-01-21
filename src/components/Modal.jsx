import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Typography,
  Input,
  Select,
  Option
} from "@material-tailwind/react";
import { branches } from "../Data/Unit";

export const Modal = ({
  open,
  handleOpen,
  onSubmit,
  type = 'accept'
  
}) => {
  const [notes, setNotes] = React.useState("");
  const [selectedUnit, setSelectedUnit] = React.useState("");
  const [ , setPrintForm] = React.useState({
    nomorSurat: "",
    perihal: "",
    pejabat: "",
    institusi: "",
    departemen: "",
    perihal_detail: "",
  });

  const handleSubmit = () => {
    if (isPrint) {
      onSubmit(printForm);
      setPrintForm({
        nomorSurat: "",
        perihal: "",
        pejabat: "",
        institusi: "",
        departemen: "",
        perihal_detail: "",
      });
    } else {
      const submitData = type === 'accept' 
        ? { penempatan: selectedUnit }  // Just send the ID directly, not as an object
        : { notes: '' };
      onSubmit(submitData);
      setSelectedUnit("");
    }
    handleOpen();
  };

  const handlePrintFormChange = (e) => {
    setPrintForm({
      ...printForm,
      [e.target.name]: e.target.value
    });
  };

  const isReject = type === 'reject';
  const isDelete = type === 'delete';
  const isPrint = type === 'print';

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>
        {isDelete && "Hapus Data"}
        {isReject && "Tolak Permintaan"}
        {!isDelete && !isReject && !isPrint && "Terima Permintaan"}
        {isPrint && "Cetak Surat Balasan"}
      </DialogHeader>
      <DialogBody divider>
        {isPrint ? (
          <div className="space-y-4">
            <Input
              type="text"
              label="Nomor Surat"
              name="nomorSurat"
              value={printForm.nomorSurat}
              onChange={handlePrintFormChange}
            />
            <Input
              type="text"
              label="Perihal"
              name="perihal"
              value={printForm.perihal}
              onChange={handlePrintFormChange}
            />
            <Input
              type="text"
              label="Pejabat"
              name="pejabat"
              value={printForm.pejabat}
              onChange={handlePrintFormChange}
            />
            <Input
              type="text"
              label="Institusi"
              name="institusi"
              value={printForm.institusi}
              onChange={handlePrintFormChange}
            />
            <Input
              type="text"
              label="Departemen"
              name="departemen"
              value={printForm.departemen}
              onChange={handlePrintFormChange}
            />
            <Input
              type="text"
              label="Detail Perihal"
              name="perihal_detail"
              value={printForm.perihal_detail}
              onChange={handlePrintFormChange}
            />
          </div>
        ) : (
          <>
            {!isDelete && (
              <div className="space-y-4">
                {type === 'accept' && (
                  <Select
                  label="Pilih Unit Kerja"
                  value={selectedUnit}
                  onChange={(value) => setSelectedUnit(value)}
                >
                  {branches.map((branch) => (
                    <Option key={branch.id} value={branch.id}>
                      {branch.name}
                    </Option>
                  ))}
                </Select>
                )}
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  label="Catatan (Opsional)"
                />
              </div>
            )}
            {isDelete && (
              <Typography className="mb-4">
                Apakah Anda yakin ingin menghapus data ini?
              </Typography>
            )}
          </>
        )}
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
          color={isDelete ? "red" : "blue"}
          onClick={handleSubmit}
        >
          {isDelete ? "Hapus" : isPrint ? "Cetak" : "Submit"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default Modal;