import React from "react";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon, 
} from "@heroicons/react/24/outline";
import {
  Card,
  CardContent,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import adminImage from "../assets/admin.png";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-4xl overflow-hidden rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Login Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Nagari Intern
              </h2>
              <p className="text-gray-600 mt-2">Silahkan Log In Untuk Melanjutkan</p>
            </div>

            <form className="space-y-6">
              <div className="relative">
                <div>
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    icon={<EnvelopeIcon className="h-5 w-5" />}
                    required
                  />
                  {/*handle error*/}
                </div>
              </div>

              <div className="relative">
              <div>
                  <Input
                    type="password"
                    name="password"
                    label="Password"
                    icon={<LockClosedIcon className="h-5 w-5" />}
                    required
                  />
                  {/*handle error*/}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Log In</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </div>

          {/* Right side - Welcome Section */}
          <div className="w-full md:w-1/2 bg-blue-500 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full -ml-16 -mb-16" />

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Selamat Datang</h2>
              <p className="text-blue-100 mb-4 text-2xl font-bold">Admin</p>
              <div className="w-64 h-64 mx-auto">
                <img
                  src={adminImage}
                  alt="Admin illustration"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
