import React, { useState, useEffect } from "react";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Card, Input, Button, Typography, Spinner } from "@material-tailwind/react";
import adminImage from "../assets/admin.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import endpoints from "../utils/api";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await endpoints.auth.login(formData);
      
      // Check if the user is an admin or superadmin
      if (response.user.role !== "admin" && response.user.role !== "SuperAdmin") {
        setError("Access denied. This login page is for administrators only.");
        toast.error("Access denied. This login page is for administrators only.");
        return;
      }

      // Save tokens to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("userRole", response.user.role);
      
      // Redirect to admin dashboard
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (err) {
      let errorMessage;
      if (err.response?.status === 403) {
        errorMessage = "Access denied. This login page is for administrators only.";
      } else {
        errorMessage = err.response?.data?.error || "Login gagal. Silakan coba lagi.";
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-gray-50">
      <Card className="w-full max-w-4xl overflow-hidden rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Login Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Nagari Intern
              </h2>
              <p className="text-gray-600 mt-2">Admin Login Panel</p>
              <p className="text-sm text-gray-500 mt-1">
                For administrator access only. Users please login through the
                user portal.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  label="Admin Email"
                  icon={<EnvelopeIcon className="h-5 w-5" />}
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  icon={<LockClosedIcon className="h-5 w-5" />}
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <Typography
                  variant="small"
                  color="red"
                  className="text-sm mt-2"
                >
                  {error}
                </Typography>
              )}

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
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    <span>Admin Log In</span>
                    <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right side - Welcome Section */}
          <div className="w-full md:w-1/2 bg-blue-500 p-8 flex flex-col justify-center items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full -ml-16 -mb-16" />

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Administrator Portal</h2>
              <p className="text-blue-100 mb-4 text-2xl font-bold">
                Restricted Access
              </p>
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

export default AdminLoginPage;
