import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    Spinner,
    IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ModalIframe = ({ isOpen, handleOpen, pdfUrl, title }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleIframeLoad = () => {
        setLoading(false);
    };

    const handleIframeError = () => {
        setLoading(false);
        setError(true);
    };

    return (
        <Dialog
            open={isOpen}
            handler={handleOpen}
            size="xl"
            className="bg-white shadow-2xl"
            animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0.9, y: -100 },
            }}
        >
            <DialogHeader className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xl text-blue-gray-800">
                        {title}
                    </span>
                    <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={handleOpen}
                        className="rounded-full hover:bg-gray-100"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </IconButton>
                </div>
            </DialogHeader>
            <DialogBody className="relative h-[75vh] p-0">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                        <Spinner className="h-8 w-8" />
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <div className="text-center">
                            <p className="text-red-500 font-medium mb-2">
                                Failed to load PDF
                            </p>
                            <Button
                                variant="outlined"
                                color="red"
                                size="sm"
                                onClick={() => {
                                    setError(false);
                                    setLoading(true);
                                }}
                            >
                                Retry
                            </Button>
                        </div>
                    </div>
                )}
                <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    title="PDF Viewer"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    style={{
                        backgroundColor: '#f8fafc'
                    }}
                    allowFullScreen
                />
            </DialogBody>
        </Dialog>
    );
};

export default ModalIframe;