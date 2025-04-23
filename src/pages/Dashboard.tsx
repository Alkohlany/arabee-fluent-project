import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, PieChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, CreditCard, CalendarDays, BarChart as BarChartIcon } from "lucide-react";
import { useSharedData, useLanguage } from "@/hooks/useSharedData";

export default function Dashboard() {
  const { users, operations, isLoading } = useSharedData();
  const { t, isRTL } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    monthlyUsers: 0,
    creditUsers: 0,
    totalOperations: 0
  });

  useEffect(() => {
    if (!users || !operations) return;
    const monthlyLicenseUsers = users.filter(user => user.User_Type === 'Monthly License').length;
    const creditsLicenseUsers = users.filter(user => user.User_Type === 'Credits License').length;

    setStats({
      totalUsers: users.length,
      monthlyUsers: monthlyLicenseUsers,
      creditUsers: creditsLicenseUsers,
      totalOperations: operations.length
    });
  }, [users, operations]);

  const getMonthlyOperationsData = () => {
    const monthCounts = new Array(12).fill(0);
    operations.forEach(op => {
      if (op.Time) {
        const dateParts = op.Time.split(' ')[0].split('-');
        if (dateParts.length >= 2) {
          const month = parseInt(dateParts[1]) - 1;
          if (month >= 0 && month < 12) {
            monthCounts[month]++;
          }
        }
      }
    });
    const monthNames = [
      t("jan"), t("feb"), t("mar"), t("apr"), t("may"), t("jun"),
      t("jul"), t("aug"), t("sep"), t("oct"), t("nov"), t("dec")
    ];
    return monthNames.map((name, index) => ({
      name,
      operations: monthCounts[index]
    }));
  };

  const getOperationTypesData = () => {
    const typeCounts: Record<string, number> = {};
    operations.forEach(op => {
      const type = op.OprationTypes || t('unknown');
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];
  const monthlyData = getMonthlyOperationsData();
  const operationTypesData = getOperationTypesData();
  const licenseComparisonData = [
    { name: t('monthlyLicense'), value: stats.monthlyUsers },
    { name: t('creditsLicense'), value: stats.creditUsers }
  ];

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="min-h-screen py-12 px-4 sm:px-8 bg-gradient-to-tr from-gray-100 to-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 animate-fade-in">
              {t("dashboardTitle")}
            </h1>
            <p className="text-gray-600 md:text-lg animate-fade-in">{t("dashboardDescription")}</p>
          </div>
        </header>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80">
            <div className="loader mb-4"></div>
            <span className="text-lg text-gray-600">{t("loadingData")}</span>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="shadow-lg border-2 border-blue-100 bg-white transition hover:scale-[1.03] hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">{t("totalUsers")}</CardTitle>
                  <CardDescription className="text-xs">{t("users")}</CardDescription>
                </div>
                <Users className="h-7 w-7 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-gray-800">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-2 border-green-100 bg-white transition hover:scale-[1.03] hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">{t("monthlyLicense")}</CardTitle>
                  <CardDescription className="text-xs">{t("monthlyLicense")}</CardDescription>
                </div>
                <CalendarDays className="h-7 w-7 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-gray-800">{stats.monthlyUsers}</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-2 border-yellow-100 bg-white transition hover:scale-[1.03] hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">{t("creditsLicense")}</CardTitle>
                  <CardDescription className="text-xs">{t("creditsLicense")}</CardDescription>
                </div>
                <CreditCard className="h-7 w-7 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-gray-800">{stats.creditUsers}</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-2 border-pink-100 bg-white transition hover:scale-[1.03] hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">{t("totalOperations")}</CardTitle>
                  <CardDescription className="text-xs">{t("operationID")}</CardDescription>
                </div>
                <BarChartIcon className="h-7 w-7 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-gray-800">{stats.totalOperations}</div>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="monthlyOps" className="w-full mt-8">
            <TabsList className="w-full rounded-lg shadow mb-4 bg-white flex">
              <TabsTrigger value="monthlyOps">{t("monthlyOperations") ?? "Monthly Operations"}</TabsTrigger>
              <TabsTrigger value="opTypes">{t("operationTypes") ?? "Operation Types"}</TabsTrigger>
              <TabsTrigger value="licenseTypes">{t("licenseTypes") ?? "License Types"}</TabsTrigger>
            </TabsList>
            <TabsContent value="monthlyOps">
              <Card className="shadow border bg-white mb-6">
                <CardHeader>
                  <CardTitle>{t("monthlyOperations") ?? "Monthly Operations"}</CardTitle>
                  <CardDescription>{t("monthlyOperationsDesc") ?? "Monthly registered operations statistics"}</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ChartContainer config={{ operations: { label: t("operations") } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="2 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent labelKey="name" nameKey="operations" />} />
                        <Legend />
                        <Bar dataKey="operations" fill="#2563EB" name={t("operations")} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="opTypes">
              <Card className="shadow border bg-white mb-6">
                <CardHeader>
                  <CardTitle>{t("operationTypes") ?? "Operation Types"}</CardTitle>
                  <CardDescription>{t("operationTypesDesc") ?? "Types breakdown"}</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ChartContainer config={{ value: { label: t("count") } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={operationTypesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.name}: ${entry.value}`}
                          outerRadius={140}
                          fill="#2563EB"
                          dataKey="value"
                        >
                          {operationTypesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent labelKey="name" nameKey="value" />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="licenseTypes">
              <Card className="shadow border bg-white mb-6">
                <CardHeader>
                  <CardTitle>{t("licenseTypes") ?? "License Types"}</CardTitle>
                  <CardDescription>{t("licenseTypesDesc") ?? "License type user count comparison"}</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ChartContainer config={{ value: { label: t("count") } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={licenseComparisonData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.name}: ${entry.value}`}
                          outerRadius={140}
                          fill="#22D3EE"
                          dataKey="value"
                        >
                          <Cell fill="#2563EB" />
                          <Cell fill="#A3E635" />
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent labelKey="name" nameKey="value" />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
        )}
      </div>
    </section>
  );
}
