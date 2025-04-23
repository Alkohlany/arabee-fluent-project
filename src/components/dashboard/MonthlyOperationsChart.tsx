
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartBar } from 'lucide-react';

interface ChartData {
  name: string;
  operations: number;
}

interface MonthlyOperationsChartProps {
  data: ChartData[];
  isLoading: boolean;
}

const MonthlyOperationsChart = ({ data, isLoading }: MonthlyOperationsChartProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <ChartBar className="h-5 w-5 text-green-500" />
          {t("operationCountsInMonth") || "Operation Counts In Month"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[320px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="h-[320px] w-full">
            <ChartContainer config={{ operations: { label: t("operations") } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent labelKey="name" nameKey="operations" />} />
                  <Bar dataKey="operations" fill="#3b82f6" name={t("operations")} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyOperationsChart;
