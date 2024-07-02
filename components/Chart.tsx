import React, { useEffect, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchChart } from '@/lib/api';
import { useDateRangeContext } from './context/DateRangeContext';
import { endOfDay, isWithinInterval, parseISO, startOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import CustomTooltip from './Tooltip';

interface ChartData {
  name: string;
  id: string;
  dashboardName: string;
  chartType: 'line' | 'bar';
  sqlQuery: string;
  xAxisField: string;
  yAxisField: string;
  dateField: { table: string; field: string };
}

interface DataPoint {
  date: string;
  total: number;
}

interface ChartProps {
  chartId: string;
  containerStyle?: React.CSSProperties;
}

export const Chart = ({ chartId, containerStyle }: ChartProps) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [allData, setAllData] = useState<DataPoint[]>([]);
  const [displayData, setDisplayData] = useState<DataPoint[]>([]);
  const { dateRange, userDateRange } = useDateRangeContext();
  const [initialDateRange, setInitialDateRange] = useState<DateRange | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [outsideInterval, setOutsideInterval] = useState<boolean>(false);

  const loadChart = useCallback(
    async (fetchDateRange: DateRange) => {
      setIsLoading(true);
      try {
        const response = await fetchChart(chartId, fetchDateRange);
        if (!response) throw Error('UN_AVAILABLE');

        setChartData(response.chart);
        if (!initialDateRange) {
          setInitialDateRange(fetchDateRange);
        }

        const transformedData = response.data.map((item: any) => ({
          date: item.date,
          total: parseFloat(item.value),
        }));
        setAllData(transformedData);
        setDisplayData(transformedData);
      } catch (error) {
        console.error('Error loading chart:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [chartId, initialDateRange]
  );

  useEffect(() => {
    if (dateRange) {
      loadChart(dateRange);
    }
  }, [dateRange, loadChart]);

  useEffect(() => {
    if (
      !userDateRange?.from ||
      !userDateRange?.to ||
      !initialDateRange?.from ||
      !initialDateRange?.to ||
      isLoading
    ) {
      return;
    }

    const initialInterval = {
      start: startOfDay(initialDateRange.from),
      end: endOfDay(initialDateRange.to),
    };

    const userInterval = {
      start: startOfDay(userDateRange.from),
      end: endOfDay(userDateRange.to),
    };

    const isWithinInitialInterval =
      isWithinInterval(userDateRange.from, initialInterval) &&
      isWithinInterval(userDateRange.to, initialInterval);

    if (isWithinInitialInterval) {
      const filteredData = allData.filter((point) => {
        const pointDate = parseISO(point.date);
        return isWithinInterval(pointDate, userInterval);
      });
      setDisplayData(filteredData);
      setOutsideInterval(false);
    } else {
      setOutsideInterval(true);
    }
  }, [userDateRange, initialDateRange, allData, isLoading]);

  useEffect(() => {
    if (outsideInterval && userDateRange) {
      loadChart(userDateRange);
    }
  }, [outsideInterval, userDateRange, loadChart]);

  if (isLoading) return <div>Loading chart...</div>;
  if (!chartData || displayData.length === 0)
    return <div>No data available</div>;

  const { chartType, name } = chartData;

  return (
    <div style={containerStyle}>
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <ResponsiveContainer width={500} height={500}>
        {chartType === 'line' ? (
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) =>
                new Date(dateStr).toLocaleDateString('en-GB', {
                  month: 'short',
                  year: 'numeric',
                })
              }
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip content={<CustomTooltip active={true} />} />

            <Line
              type="monotoneX"
              dataKey="total"
              stroke="#6571bf"
              strokeWidth={5}
            />
          </LineChart>
        ) : (
          <BarChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) =>
                new Date(dateStr).toLocaleDateString('en-GB', {
                  month: 'short',
                  year: 'numeric',
                })
              }
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip content={<CustomTooltip active={true} />} />

            <Bar dataKey="total" fill="#8884d8" barSize={50} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};