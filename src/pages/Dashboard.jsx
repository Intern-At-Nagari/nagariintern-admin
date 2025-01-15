import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  DocumentCheckIcon,
  ClipboardDocumentCheckIcon,
  UserPlusIcon,
  UsersIcon,
  HomeIcon,
  ChevronRightIcon,
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
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";

const Dashboard = () => {
  const monthlyData = [
    { name: "Jan", diproses: 40, diverifikasi: 24, diterima: 20 },
    { name: "Feb", diproses: 30, diverifikasi: 18, diterima: 15 },
    { name: "Mar", diproses: 50, diverifikasi: 35, diterima: 30 },
    { name: "Apr", diproses: 45, diverifikasi: 30, diterima: 25 },
  ];

  const pieData = [
    { name: "Diproses", value: 40, color: "#3b82f6" },
    { name: "Diverifikasi", value: 30, color: "#22c55e" },
    { name: "Diterima", value: 20, color: "#6366f1" },
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="transition-transform duration-300 hover:scale-105">
      <CardBody className="p-6">
        <div className="flex items-center gap-4">
          <div className={`rounded-xl p-4 ${color} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 font-medium"
            >
              {title}
            </Typography>
            <Typography variant="h4" color="blue-gray" className="font-bold">
              {value}
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />

      {/* Sticky Header */}
     

      {/* Welcome Message */}
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
        <BreadcrumbsComponent />
          <Typography variant="h3" className="mb-8 font-bold text-gray-800 text-2xl md:text-3xl">
            Selamat Datang di Nagari Intern Dashboard
          </Typography>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              title="Diproses"
              value="40"
              icon={DocumentCheckIcon}
              color="bg-blue-500"
            />
            <StatCard
              title="Diverifikasi"
              value="30"
              icon={ClipboardDocumentCheckIcon}
              color="bg-green-500"
            />
            <StatCard
              title="Diterima"
              value="20"
              icon={UserPlusIcon}
              color="bg-indigo-500"
            />
            <StatCard
              title="Total Pendaftar"
              value="90"
              icon={UsersIcon}
              color="bg-purple-500"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Bar Chart */}
            <Card className="shadow-lg">
              <CardBody className="p-4 md:p-6">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-6 font-medium"
                >
                  Statistik Bulanan
                </Typography>
                <div className="h-72 md:h-96 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="diproses"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="diverifikasi"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="diterima"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>

            {/* Pie Chart */}
            <Card className="shadow-lg">
              <CardBody className="p-6">
                <Typography
                  variant="h6"
                  color="blue-gray"
                  className="mb-6 font-medium"
                >
                  Distribusi Status
                </Typography>
                <div className="h-96 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
