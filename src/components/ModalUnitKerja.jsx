import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Input,
  Switch,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";

const ModalUnitKerja = ({
  open,
  handleOpen,
  selectedBranch,
  formData,
  setFormData,
  BRANCH_TYPES,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Edit Tipe Cabang - {selectedBranch?.name}</DialogHeader>
      <DialogBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Typography variant="small" className="mb-2">
              Custom Kuota
            </Typography>
            <Switch
              checked={formData.isCustomQuota}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isCustomQuota: e.target.checked,
                }))
              }
            />
          </div>

          {!formData.isCustomQuota ? (
            <>
              <Typography variant="small" className="mb-2">
                Tipe Cabang
              </Typography>
              <Select
                value={formData.tipe_cabang}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    tipe_cabang: value || "",
                  }))
                }
                label="Pilih Tipe Cabang"
              >
                {Object.entries(BRANCH_TYPES).map(([value, { label }]) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </Select>
              {formData.tipe_cabang && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <Typography
                    variant="small"
                    className="text-blue-900 font-medium"
                  >
                    Kuota Default untuk {BRANCH_TYPES[formData.tipe_cabang].label}:
                  </Typography>
                  <Typography variant="small" className="text-blue-800">
                    Mahasiswa: {BRANCH_TYPES[formData.tipe_cabang].kuotaMhs}
                  </Typography>
                  <Typography variant="small" className="text-blue-800">
                    Siswa: {BRANCH_TYPES[formData.tipe_cabang].kuotaSiswa}
                  </Typography>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <Input
                type="number"
                label="Kuota Mahasiswa"
                value={formData.kuotaMhs}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    kuotaMhs: e.target.value,
                  }))
                }
                min="0"
              />
              <Input
                type="number"
                label="Kuota Siswa"
                value={formData.kuotaSiswa}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    kuotaSiswa: e.target.value,
                  }))
                }
                min="0"
              />
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => handleOpen(null)}
          className="mr-1"
        >
          Batal
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            (formData.isCustomQuota
              ? formData.kuotaMhs < 0 || formData.kuotaSiswa < 0
              : !formData.tipe_cabang)
          }
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Spinner className="h-4 w-4" /> Loading...
            </>
          ) : (
            "Simpan"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalUnitKerja;