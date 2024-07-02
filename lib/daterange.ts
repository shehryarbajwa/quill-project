
import { subDays, startOfMonth, formatISO } from 'date-fns';
import { DateRange } from 'react-day-picker';




export const getDateRange = (dateRange: string): DateRange => {
  const endDate = new Date();
  let startDate: Date;



  switch (dateRange) {
    case 'LAST_90_DAYS':
      startDate = subDays(endDate, 89);
      break;
    case 'LAST_60_DAYS':
      startDate = subDays(endDate, 59);
      break;
    case 'LAST_30_DAYS':
      startDate = subDays(endDate, 29);
      break;
    case 'CURRENT_MONTH':
      startDate = startOfMonth(endDate);
      break;
    default:
      startDate = subDays(endDate, 89);
  }
  const from = formatISO(startDate, { representation: 'date' });
  const to = formatISO(endDate, { representation: 'date' });

  return { from: startDate, to: endDate };
};
