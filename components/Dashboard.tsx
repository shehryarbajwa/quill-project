'use client';

import React, { useEffect, useState } from 'react';
import { Chart } from './Chart';
import { DatePickerWithRange } from './DateRange';
import { fetchDashboard } from '@/lib/api';
import { useDateRangeContext } from './context/DateRangeContext';
import { getDateRange } from '@/lib/daterange';
import { useQuery } from 'react-query';
import { DropdownMenuRadioButtons } from './Dropdown';
import { useToasts } from 'react-toast-notifications';

interface DashboardProps {
  name: string;
  containerStyle?: React.CSSProperties;
  onClickDashboardItem?: (dashboardItem: any) => void;
}

interface ChartProps {
  name: string;
  id: string;
  dashboardName: string;
  chartType: 'line' | 'bar';
  sqlQuery: string;
  xAxisField: string;
  yAxisField: string;
  dateField: { table: string; field: string };
}

const chartContainerStyle: React.CSSProperties = {
  borderRadius: '40px',
  padding: '30px',
  backgroundColor: '#fff',
  marginRight: '10px',
};

export const Dashboard = ({
  name,
  containerStyle,
  onClickDashboardItem,
}: DashboardProps) => {
  const { setDateRange } = useDateRangeContext();
  const [preset, setPreset] = useState<string>('');
  const { addToast } = useToasts();

  const { data, isLoading, error } = useQuery(['dashboardData', name], () =>
    fetchDashboard(name)
  );

  useEffect(() => {
    if (data) {
      setDateRange(getDateRange(data.dashboard.dateFilter.initialDateRange));
      setPreset(data.dashboard.dateFilter.initialDateRange);
    }
  }, [data, setDateRange]);

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) {
    addToast('Error loading dashboard', { appearance: 'error' });
    return <div>Error loading dashboard</div>;
  }

  const { charts } = data;

  return (
    <div style={containerStyle}>
      <h2 className="p-5">Dashboards</h2>
      <div className="flex align-center gap-5 mb-10">
        <DatePickerWithRange className="mr-4" />
        <DropdownMenuRadioButtons initialValue={preset} />
      </div>
      <div className="flex gap-4 ">
        {charts.map((chart: ChartProps) => (
          <div
            key={chart.id}
            className="flex-1 min-w-[500px]"
            onClick={() => onClickDashboardItem && onClickDashboardItem(chart)}
          >
            <Chart chartId={chart.id} containerStyle={chartContainerStyle} />
          </div>
        ))}
      </div>
    </div>
  );
};
