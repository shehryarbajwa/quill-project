'use client';
import { Dashboard } from '@/components/Dashboard';
import { DateRangeProvider } from '@/components/context/DateRangeContext';
import { ToastProvider } from 'react-toast-notifications';

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

const onClickDashboardItem = (dashboardItem: ChartProps) => {
  console.log('Dashboard item clicked:', dashboardItem);
};

const dashboardContainerStyle: React.CSSProperties = {
  backgroundColor: '#f9f9f9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default function Home() {
  return (
    <ToastProvider>
      <DateRangeProvider>
        <Dashboard
          name="sales-dashboard"
          containerStyle={dashboardContainerStyle}
          onClickDashboardItem={onClickDashboardItem}
        />
      </DateRangeProvider>
    </ToastProvider>
  );
}
