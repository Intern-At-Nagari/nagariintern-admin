import React, { useCallback } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Spinner,
  Textarea,
} from "@material-tailwind/react";

const PrintModal = React.memo(
  ({ open, onClose, printForm, onSubmit, onChange, type, isLoading }) => {
    const handleInputChange = useCallback(
      (e, field) => {
        onChange(field, e.target.value);
      },
      [onChange]
    );

    return (
      <Dialog open={open} handler={onClose} size="md">
        <DialogHeader>Print Surat Balasan</DialogHeader>
        <DialogBody divider className="h-[40vh] overflow-y-auto">
          <div className="space-y-4">
            <Input
              label="Nomor Surat"
              value={printForm.nomorSurat}
              onChange={(e) => handleInputChange(e, "nomorSurat")}
            />
            <Input
              label="Perihal"
              value={printForm.perihal}
              onChange={(e) => handleInputChange(e, "perihal")}
            />
            <Input
              label="Pejabat"
              value={printForm.pejabat}
              onChange={(e) => handleInputChange(e, "pejabat")}
            />
            <Input
              label="Institusi"
              value={printForm.institusi}
              onChange={(e) => handleInputChange(e, "institusi")}
            />
            {type === "Perguruan Tinggi" && (
              <Input
                label="Program Studi"
                value={printForm.prodi}
                onChange={(e) => handleInputChange(e, "prodi")}
              />
            )}
            <Textarea
              label="Detail Perihal"
              value={printForm.perihal_detail}
              onChange={(e) => handleInputChange(e, "perihal_detail")}
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="red" onClick={onClose}>
            Cancel
          </Button>
          <Button color="blue" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                Processing...
              </div>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }
);

export default PrintModal;