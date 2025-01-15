import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { FlagIcon } from "@heroicons/react/24/solid";



export function NotFound() {
  return (
      <div className="h-screen mx-auto grid place-items-center text-center px-8">
        <div>
          <FlagIcon className="w-20 h-20 mx-auto " color="#2196F3" />
          <Typography
            variant="h1"
            color="blue"
            className="mt-10 text-8xl mb-8"
          >
             Eror 404
          </Typography>
          <Typography
            variant="h1"
            color="blue"
            className="mt-10 !text-3xl !leading-snug md:!text-4xl mb-8"
          >
             It looks like something went wrong.
          </Typography>
          
          <Button color="blue" className="w-full px-4 md:w-[8rem]" onClick={() => window.history.back()}>
            back home
          </Button>
        </div>
      </div>
  );
}

export default NotFound;
