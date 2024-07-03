
import { subDays, startOfMonth, formatISO, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    year: 'numeric',
  });
};


export const getDateRange = (dateRange: string): DateRange => {
  const endDate = new Date();
  let startDate: Date;

  switch (dateRange) {
    case 'LAST_90_DAYS':
      startDate = subDays(endDate, 90);
      break;
    case 'LAST_60_DAYS':
      startDate = subDays(endDate, 60);
      break;
    case 'LAST_30_DAYS':
      startDate = subDays(endDate, 30);
      break;
    case 'CURRENT_MONTH':
      startDate = startOfMonth(endDate);
      break;
    default:
      startDate = subDays(endDate, 90);
  }

  return { from: startDate, to: endDate };
};
