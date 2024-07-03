'use client';

import React, { CSSProperties, useEffect, useState } from 'react';
import { Chart } from './Chart';
import { DatePickerWithRange } from './DateRange';
import { fetchDashboard } from '@/lib/api';
import { useDateRangeContext } from './context/DateRangeContext';
import { getDateRange } from '@/lib/daterange';
import { DropdownMenuRadioButtons } from './Dropdown';
import { useToasts } from 'react-toast-notifications';

interface DashboardProps {
  name: string;
  containerStyle?: CSSProperties;
  onClickDashboardItem?: (dashboardItem: ChartProps) => void;
}

interface ChartProps {
  name: string;
  id: string;
  dashboardName: string;
  chartType: 'line' | 'bar';
  sqlQuery: string;
  xaxisfield: string;
  yaxisfield: string;
  dateField: { table: string; field: string };
}

const chartContainerStyle: CSSProperties = {
  borderRadius: '40px',
  padding: '20px',
  backgroundColor: '#fff',
  marginRight: '10px',
};

interface DashboardProps {
  name: string;
  id: string;
  dateFilter: {
    name: string;
    initialDateRange: string;
  };
}

export const Dashboard = ({
  name,
  containerStyle,
  onClickDashboardItem,
}: DashboardProps) => {
  const { setDateRange } = useDateRangeContext();
  const [preset, setPreset] = useState<string>('');
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardProps | undefined>();
  const [chartData, setChartData] = useState<ChartProps[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboard(name);

        setDashboard(data.dashboard);
        setChartData(data.charts);
        setDateRange(getDateRange(data.dashboard.dateFilter.initialDateRange));
        setPreset(data.dashboard.dateFilter.initialDateRange);
      } catch (err) {
        addToast('Error loading dashboard', { appearance: 'error' });
        setDashboard(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [name, setDateRange, addToast]);

  if (isLoading) return <div>Loading...</div>;
  if (!dashboard) return <div>Error loading dashboard</div>;
  if (!chartData) return <div>Error Loading charts...</div>;

  return (
    <div style={containerStyle}>
      <h2 className="p-5">Dashboards</h2>
      <div className="flex flex-row gap-3 mb-10">
        <DatePickerWithRange />
        <DropdownMenuRadioButtons initialValue={preset} />
      </div>
      <div className="flex flex-row gap-3 ">
        {chartData.map((chart: ChartProps) => (
          <div
            key={chart.id}
            onClick={() => onClickDashboardItem && onClickDashboardItem(chart)}
          >
            <Chart chartId={chart.id} containerStyle={chartContainerStyle} />
          </div>
        ))}
      </div>
    </div>
  );
};
