'use client';
import { Dashboard } from '@/components/Dashboard';
import { DateRangeProvider } from '@/components/context/DateRangeContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastProvider } from 'react-toast-notifications';

const queryClient = new QueryClient();
const onClickDashboardItem = (dashboardItem: any) => {
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
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <DateRangeProvider>
          <Dashboard
            name="sales-dashboard"
            containerStyle={dashboardContainerStyle}
            onClickDashboardItem={onClickDashboardItem}
          />
        </DateRangeProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
