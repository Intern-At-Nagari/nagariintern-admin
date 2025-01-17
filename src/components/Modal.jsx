import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Textarea,
  Typography
} from "@material-tailwind/react";

export const Modal = ({
  open,
  handleOpen,
  onSubmit,
  type = 'accept' // 'accept', 'reject', 'delete', or 'print'
}) => {
  const [notes, setNotes] = React.useState("");
  
  const handleSubmit = () => {
    onSubmit(notes);
    setNotes("");
    handleOpen();
  };

  const isReject = type === 'reject';
  const isDelete = type === 'delete';
  const isPrint = type === 'print';

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>
        {isPrint ? 'Konfirmasi Cetak Surat' :
         isDelete ? 'Konfirmasi Hapus' :
         isReject ? 'Tolak Permohonan' :
         'Terima Permohonan'}
      </DialogHeader>
      <DialogBody>
        {isPrint && (
          <Typography variant="body1" color="red" className="mb-4">
            Pastikan semua data sudah benar sebelum mencetak surat
          </Typography>
        )}
        {isReject ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-gray-900 mb-2">
              Alasan Penolakan
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              className="w-full"
            />
          </div>
        ) : (
          <Typography variant="body1" className="text-blue-gray-900">
            {isPrint ? 'Apakah Anda yakin ingin mencetak surat ini?' :
             isDelete ? 'Apakah Anda yakin ingin menghapus item ini?' :
             'Apakah Anda yakin ingin menerima permohonan ini?'}
          </Typography>
        )}
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button
          variant="outlined"
          color="gray"
          onClick={handleOpen}
        >
          Batal
        </Button>
        <Button
          variant="filled"
          color={isDelete || isReject ? "red" : isPrint ? "blue" : "green"}
          onClick={handleSubmit}
        >
          {isPrint ? 'Cetak' :
           isDelete ? 'Hapus' :
           isReject ? 'Tolak' :
           'Terima'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default Modal;