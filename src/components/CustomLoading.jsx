import { Spinner } from "@material-tailwind/react";

const CustomLoading = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-blue-gray-50/50 z-50">
            <Spinner className="h-12 w-12" color="blue" />
        </div>
    );
};

export default CustomLoading;
