
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CreditCard, CalendarDays, BarChart as BarChartIcon } from "lucide-react";
import { useSharedData, useLanguage } from "@/hooks/useSharedData";
import OperationsUsedChart from "@/components/dashboard/OperationsUsedChart";
import MonthlyOperationsChart from "@/components/dashboard/MonthlyOperationsChart";
import GeoMap from "@/components/dashboard/GeoMap";
import { format, parse } from "date-fns";

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
    if (!operations || operations.length === 0) return [];

    // Create an object to store operation counts by month
    const monthCounts = {};
    
    operations.forEach(op => {
      if (op.Time) {
        try {
          // Extract date from the time string
          const dateStr = op.Time.split(' ')[0];
          if (!dateStr) return;
          
          // Convert to a standardized date format
          const dateParts = dateStr.split('-');
          if (dateParts.length < 2) return;
          
          // Get month and year
          const month = parseInt(dateParts[1], 10);
          const year = parseInt(dateParts[0], 10);
          
          if (isNaN(month) || month < 1 || month > 12) return;
          
          // Use a consistent key format for the month
          const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
          
          // Increment the count for this month
          monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      }
    });
    
    // Convert the counts object to an array sorted by date
    return Object.entries(monthCounts)
      .map(([key, count]) => {
        const [year, monthStr] = key.split('-');
        const month = parseInt(monthStr, 10);
        
        // Get month name in the current language
        const date = new Date(parseInt(year, 10), month - 1);
        const monthName = format(date, 'MMMM yyyy');
        
        return {
          name: monthName,
          operations: count as number,
          sortKey: key // Keep the original key for sorting
        };
      })
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ name, operations }) => ({ name, operations }));
  };

  const getOperationTypesData = () => {
    if (!operations || operations.length === 0) return [];

    const typeCounts: Record<string, number> = {};
    operations.forEach(op => {
      const type = op.OprationTypes || t('unknown');
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    return Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by count in descending order
  };
  
  const getUsersCountryData = () => {
    if (!users || users.length === 0) return [];
    
    const countryCounts: Record<string, number> = {};
    users.forEach(user => {
      if (user.Country) {
        const country = user.Country;
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });
    
    return Object.entries(countryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by count in descending order
  };

  const monthlyOperationsData = getMonthlyOperationsData();
  const operationTypesData = getOperationTypesData();
  const usersCountryData = getUsersCountryData();

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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <OperationsUsedChart data={operationTypesData} isLoading={isLoading} />
            <MonthlyOperationsChart data={monthlyOperationsData} isLoading={isLoading} />
          </div>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <GeoMap data={usersCountryData} isLoading={isLoading} />
          </div>
          </>
        )}
      </div>
    </section>
  );
}
