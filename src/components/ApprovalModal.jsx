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

export const ApprovalModal = ({ 
  open, 
  handleOpen, 
  onSubmit, 
  type = 'accept' // 'accept', 'reject', or 'delete'
}) => {
  const [notes, setNotes] = React.useState("");

  const handleSubmit = () => {
    onSubmit(notes);
    setNotes("");
    handleOpen();
  };

  const isReject = type === 'reject';
  const isDelete = type === 'delete';

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>
        {isDelete ? 'Konfirmasi Hapus' : 
         isReject ? 'Tolak Permohonan' : 
         'Terima Permohonan'}
      </DialogHeader>
      <DialogBody>
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
            {isDelete ? 
              'Apakah Anda yakin ingin menghapus item ini?' : 
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
          color={isDelete ? "red" : isReject ? "red" : "green"} 
          onClick={handleSubmit}
        >
          {isDelete ? 'Hapus' : isReject ? 'Tolak' : 'Terima'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ApprovalModal;