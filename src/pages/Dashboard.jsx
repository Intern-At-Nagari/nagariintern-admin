import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import {
  ClipboardDocumentCheckIcon,
  UserPlusIcon,
  UsersIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar from "../components/Sidebar";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";
import CustomLoading from "../components/CustomLoading";
import endpoints from "../utils/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {

        const data = await endpoints.page.getDashboard();

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
      1: "Januari",
      2: "Februari",
      3: "Maret",
      4: "April",
      5: "Mei",
      6: "Juni",
      7: "Juli",
      8: "Agustus",
      9: "September",
      10: "Oktober",
      11: "November",
      12: "Desember",
    };

    return Object.entries(dashboardData.monthlyRegistrationTrends).map(
      ([month, count]) => ({
        name: monthNames[month],
        total: parseInt(count),
      })
    );
  };

  const useTypingEffect = (text, speed = 50, delayBeforeRestart = 2000) => {
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      let timer;

      if (!isDeleting && displayText === text) {
        // When finished typing, wait before starting to delete
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBeforeRestart);
      } else if (isDeleting && displayText === "") {
        // When finished deleting, start typing again
        setIsDeleting(false);
      } else {
        // Handle typing and deleting
        timer = setTimeout(
          () => {
            if (!isDeleting) {
              // Typing
              setDisplayText(text.slice(0, displayText.length + 1));
            } else {
              // Deleting
              setDisplayText(text.slice(0, displayText.length - 1));
            }
          },
          isDeleting ? speed / 2 : speed
        );
      }

      return () => clearTimeout(timer);
    }, [text, displayText, isDeleting, speed, delayBeforeRestart]);

    return displayText;
  };

  // Use the hook with your welcome text
  const welcomeText = "Selamat Datang di Nagari Intern Dashboard";
  const animatedText = useTypingEffect(welcomeText, 70, 2000);

  const getStatusData = () => {
    if (!dashboardData?.statusCounts) return [];

    return [
      {
      name: "Diproses",
      value: dashboardData.statusCounts.diproses,
      color: "#fbbf24", // Warmer amber
      },
      {
      name: "Diterima",
      value: dashboardData.statusCounts.diterima,
      color: "#34d399", // Brighter emerald
      },
      {
      name: "Diverifikasi",
      value: dashboardData.statusCounts.diverifikasi,
      color: "#06b6d4", // Cyan
      },
      {
      name: "Magang Aktif",
      value: dashboardData.statusCounts.pesertaMagangAktif,
      color: "#60a5fa", // Lighter blue
      },
      {
      name: "Selesai",
      value: dashboardData.statusCounts.pesertaSelesai,
      color: "#a78bfa", // Lighter purple
      },
    ];
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <Card className="transition-transform duration-300 hover:shadow-lg">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className={`rounded-xl p-4 ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <Typography variant="h4" className="font-bold text-gray-900">
            {value}
          </Typography>
        </div>
        <Typography className="mt-4 font-medium text-gray-600">
          {title}
        </Typography>
      </CardBody>
    </Card>
  );

  const TopUnitKerja = ({ data }) => (
    <Card className="col-span-full shadow-lg">
      <CardBody className="p-6">
        <Typography variant="h6" color="blue-gray" className="mb-6 font-medium">
          Unit Kerja Terpopuler
        </Typography>
        <div className="grid gap-6">
          {data.map((unit, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <Typography className="font-medium text-gray-700">
                  {unit.name}
                </Typography>
                <Typography className="font-bold text-blue-gray-900">
                  {unit.count}
                </Typography>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (parseInt(unit.count) /
                        Math.max(...data.map((u) => parseInt(u.count)))) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );

  if (loading) return <CustomLoading />;
  
  if (error) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <BreadcrumbsComponent />
          <div className="text-center mt-8">
            <Typography variant="h4" color="red" className="font-medium">
              Cannot get data from server
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <BreadcrumbsComponent />

        <Typography variant="h3" className="font-bold text-gray-800 mb-8">
          {animatedText}
          <span className="animate-blink">|</span>
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Pendaftar"
            value={dashboardData?.totalRegistrants || 0}
            icon={UsersIcon}
            color="text-blue-500"
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Peserta Aktif"
            value={dashboardData?.statusCounts?.pesertaMagangAktif || 0}
            icon={UserPlusIcon}
            color="text-green-500"
            bgColor="bg-green-50"
          />
          <StatCard
            title="Mahasiswa"
            value={dashboardData?.typeCounts?.mahasiswa || 0}
            icon={ClipboardDocumentCheckIcon}
            color="text-purple-500"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Siswa"
            value={dashboardData?.typeCounts?.siswa || 0}
            icon={CheckCircleIcon}
            color="text-indigo-500"
            bgColor="bg-indigo-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="shadow-lg">
            <CardBody className="p-6">
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-6 font-medium"
              >
                Trend Pendaftaran Bulanan
              </Typography>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getMonthlyData()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        border: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg">
            <CardBody className="p-6">
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-6 font-medium"
              >
                Status Pendaftar
              </Typography>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getStatusData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        value,
                        index,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius =
                          innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                          >
                            {value}
                          </text>
                        );
                      }}
                    >
                      {getStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        border: "none",
                      }}
                    />
                    <Legend
                      formatter={(value, entry) => {
                        const { payload } = entry;
                        return `${value} (${payload.value})`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        <TopUnitKerja data={dashboardData?.topUnitKerja} />
      </div>
    </div>
  );
};

export default Dashboard;
