import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Spinner
} from "@material-tailwind/react";
import {
  DocumentCheckIcon,
  ClipboardDocumentCheckIcon,
  UserPlusIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getMonthlyData = () => {
    if (!dashboardData?.monthlyRegistrationTrends) return [];
    
    const monthNames = {
      1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
      7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
    };

    return Object.entries(dashboardData.monthlyRegistrationTrends).map(([month, count]) => ({
      name: monthNames[month],
      pendaftar: parseInt(count)
    }));
  };

  const getStatusData = () => {
    if (!dashboardData?.statusCounts) return [];

    const statusNames = {
      1: "Diproses",
      2: "Diterima",
      3: "Surat Pernyataan",
      4: "Mulai Magang"
    };

    const colors = {
      1: "#f59e0b",
      2: "#10b981",
      3: "#8b5cf6",
      4: "#ec4899"
    };

    return Object.entries(dashboardData.statusCounts).map(([status, count]) => ({
      name: statusNames[status],
      value: parseInt(count),
      color: colors[status]
    }));
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className={`rounded-xl p-4 ${color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Typography variant="h4" color="blue-gray" className="font-bold">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded" />
            ) : value}
          </Typography>
          <Typography variant="small" className="text-gray-600 mt-1">
            {title}
          </Typography>
        </div>
      </CardBody>
    </Card>
  );

  const TopUnitKerja = ({ data }) => (
    <Card className="shadow-lg mt-8">
      <CardBody className="p-6">
        <Typography variant="h6" color="blue-gray" className="mb-6 font-medium">
          Unit Kerja Terpopuler
        </Typography>
        <div className="space-y-6">
          {data.map((unit, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <Typography className="text-sm font-medium text-gray-700">
                  {unit.name}
                </Typography>
                <Typography className="font-medium text-blue-gray-900">
                  {unit.count}
                </Typography>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(unit.count / Math.max(...data.map(u => u.count))) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50/50">
      <Sidebar />

      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />
          
          <div className="flex items-center justify-between mb-8">
            <Typography variant="h3" className="font-bold text-gray-800 text-2xl md:text-3xl">
              Selamat Datang di Nagari Intern Dashboard
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              title="Total Pendaftar"
              value={dashboardData.totalRegistrants}
              icon={UsersIcon}
              color="bg-purple-500"
              trend={12}
            />
            <StatCard
              title="Magang Aktif"
              value={dashboardData.activeInternships}
              icon={UserPlusIcon}
              color="bg-indigo-500"
              trend={5}
            />
            <StatCard
              title="Mahasiswa"
              value={dashboardData.typeCounts.mahasiswa}
              icon={DocumentCheckIcon}
              color="bg-blue-500"
              trend={-2}
            />
            <StatCard
              title="Siswa"
              value={dashboardData.typeCounts.siswa}
              icon={ClipboardDocumentCheckIcon}
              color="bg-green-500"
              trend={8}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <Card className="shadow-lg">
              <CardBody className="p-4 md:p-6">
                <Typography variant="h6" color="blue-gray" className="mb-6 font-medium">
                  Trend Pendaftaran Bulanan
                </Typography>
                <div className="h-72 md:h-96 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getMonthlyData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.98)",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          padding: "12px"
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="pendaftar"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-lg">
              <CardBody className="p-6">
                <Typography variant="h6" color="blue-gray" className="mb-6 font-medium">
                  Status Pendaftar
                </Typography>
                <div className="h-96 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.98)",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          padding: "12px"
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>

            <TopUnitKerja data={dashboardData.topUnitKerja} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;