import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Breadcrumbs
} from "@material-tailwind/react";
import {
  DocumentCheckIcon,
  ClipboardDocumentCheckIcon,
  UserPlusIcon,
  UsersIcon,
  HomeIcon,
  ChevronRightIcon
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
} from 'recharts';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const monthlyData = [
    { name: 'Jan', diproses: 40, diverifikasi: 24, diterima: 20 },
    { name: 'Feb', diproses: 30, diverifikasi: 18, diterima: 15 },
    { name: 'Mar', diproses: 50, diverifikasi: 35, diterima: 30 },
    { name: 'Apr', diproses: 45, diverifikasi: 30, diterima: 25 },
  ];

  const pieData = [
    { name: 'Diproses', value: 40, color: '#3b82f6' },
    { name: 'Diverifikasi', value: 30, color: '#22c55e' },
    { name: 'Diterima', value: 20, color: '#6366f1' },
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="overflow-hidden">
      <CardBody className="p-4">
        <div className="flex items-center gap-4">
          <div className={`rounded-xl p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1 font-medium">
              {title}
            </Typography>
            <Typography variant="h4" className="font-bold">
              {value}
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs
              separator={
                <ChevronRightIcon className="h-4 w-4 text-blue-gray-500" />
              }
              className="bg-transparent p-0"
            >
              <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </a>
              <a href="#" className="text-blue-gray-900 font-medium">
                Dashboard
              </a>
            </Breadcrumbs>
          </div>

          <Typography variant="h3" className="mb-8 font-bold text-gray-800">
            Welcome to Nagari Intern Dashboard
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <Typography variant="h6" color="blue-gray" className="mb-6 font-medium">
                Statistik Bulanan
              </Typography>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="diproses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="diverifikasi" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="diterima" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <Typography variant="h6" color="blue-gray" className="mb-6 font-medium">
                Distribusi Status
              </Typography>
              <div className="h-80">
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
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;