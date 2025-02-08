import React from "react";
import { Dialog, DialogHeader, DialogBody, Input, Button } from "@material-tailwind/react";

const ScheduleForm = ({ open, handleOpen, formData, setFormData, handleSubmit }) => {
  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Tambah Jadwal Baru</DialogHeader>
      <DialogBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
          <Input
            type="date"
            label="Tanggal Mulai"
            value={formData.tanggalMulai}
            onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
          />
          <Input
            type="date"
            label="Tanggal Selesai"
            value={formData.tanggalTutup}
            onChange={(e) => setFormData({ ...formData, tanggalTutup: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button variant="text" onClick={handleOpen} color="red">
              Cancel
            </Button>
            <Button type="submit" color="blue">
              Simpan
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default ScheduleForm;