'useclient';

import React, { useEffect, useState, HTMLAttributes } from 'react';
import { format, isAfter } from 'date-fns'; // Import isAfter from date-fns
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useToasts } from 'react-toast-notifications'; // Import useToasts from react-toast-notifications

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDateRangeContext } from './context/DateRangeContext';
import { getDateRange } from '@/lib/daterange';

export function DatePickerWithRange({
  className,
}: HTMLAttributes<HTMLDivElement>) {
  const { dateRange, userDateRange, setUserDateRange } = useDateRangeContext();
  const { addToast } = useToasts(); // Use the addToast function from react-toast-notifications

  const [date, setDate] = useState<DateRange | undefined>({
    from: dateRange?.from,
    to: dateRange?.to,
  });

  // Here we check for userDateRange. Upon loading the dashboard, it will be null so we set it to the dashboard's date range.
  // Once the user sets it to a custom date, we set the component's Date to the user selected one
  useEffect(() => {
    const range = userDateRange || dateRange;
    setDate({ from: range?.from, to: range?.to });
  }, [dateRange, userDateRange]);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    // Check if the selected date is not in the future
    const today = new Date();

    if (!dateRange || !dateRange.from || !dateRange.to) {
      return;
    }
    if (
      dateRange &&
      (isAfter(dateRange.from, today) || isAfter(dateRange.to, today))
    ) {
      addToast('Selected date range cannot be in the future.', {
        appearance: 'error',
      });
      return;
    }

    setDate(dateRange);
    if (dateRange?.from && dateRange?.to) {
      setUserDateRange({
        from: dateRange.from,
        to: dateRange.to,
      });
    }
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
