import React, { useEffect, useState, useCallback, CSSProperties } from 'react';
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
import { isWithinInterval, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';
import CustomTooltip from './Tooltip';
import { formatDate } from '@/lib/daterange';

interface ChartData {
  name: string;
  id: string;
  dashboardName: string;
  chartType: 'line' | 'bar';
  sqlQuery: string;
  xaxisfield: string;
  yaxisfield: string;
  dateField: { table: string; field: string };
}

interface DataPoint {
  date: string;
  spendAtSubway: number;
  spendAtChevron: number;
}

interface ChartProps {
  chartId: string;
  containerStyle?: CSSProperties;
}

interface ResponseProps {
  date: string;
  merchant: string;
  total: number;
}

export const Chart = ({ chartId, containerStyle }: ChartProps) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [allData, setAllData] = useState<DataPoint[]>([]);
  const [displayData, setDisplayData] = useState<DataPoint[]>([]);
  const { dateRange, userDateRange } = useDateRangeContext();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [outsideInterval, setOutsideInterval] = useState<boolean>(false);

  const loadChart = useCallback(
    async (fetchDateRange: DateRange) => {
      setIsLoading(true);
      try {
        const response = await fetchChart(chartId, fetchDateRange);
        if (!response) throw Error('UN_AVAILABLE');

        setChartData(response.chart);

        const transformedData: DataPoint[] = [];
        response.data.forEach(({ date, merchant, total }: ResponseProps) => {
          let entry = transformedData.find((item) => item.date === date);

          if (!entry) {
            entry = { date, spendAtSubway: 0, spendAtChevron: 0 };
            transformedData.push(entry);
          }

          if (merchant === 'Subway') {
            entry.spendAtSubway += total;
          } else if (merchant === 'Chevron') {
            entry.spendAtChevron += total;
          }
        });

        setAllData(transformedData);
        setDisplayData(transformedData);
      } catch (error) {
        console.error('Error loading chart:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [chartId]
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
      !dateRange?.from ||
      !dateRange?.to ||
      isLoading
    ) {
      return;
    }

    const initialInterval = {
      start: dateRange.from,
      end: dateRange.to,
    };

    const userInterval = {
      start: userDateRange.from,
      end: userDateRange.to,
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
  }, [userDateRange, dateRange, allData, isLoading]);

  useEffect(() => {
    if (outsideInterval && userDateRange) {
      loadChart(userDateRange);
    }
  }, [outsideInterval, userDateRange, loadChart]);

  if (isLoading) return <div>Loading chart...</div>;
  if (!chartData || displayData.length === 0)
    return <div>No data available</div>;

  const { chartType, name, xaxisfield } = chartData;

  return (
    <div style={containerStyle}>
      <h2 className="text-xl font-bold mb-4">{name}</h2>
      <ResponsiveContainer width={600} height={500}>
        {chartType === 'line' ? (
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey={xaxisfield} tickFormatter={formatDate} />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip content={<CustomTooltip active={true} />} />
            <Line
              type="monotoneX"
              dataKey="spendAtSubway"
              stroke="#8884d8"
              strokeWidth={2}
            />
            <Line
              type="monotoneX"
              dataKey="spendAtChevron"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        ) : (
          <BarChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xaxisfield} tickFormatter={formatDate} />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip content={<CustomTooltip active={true} />} />
            <Bar dataKey="spendAtSubway" fill="#8884d8" barSize={50} />
            <Bar dataKey="spendAtChevron" fill="#82ca9d" barSize={50} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
