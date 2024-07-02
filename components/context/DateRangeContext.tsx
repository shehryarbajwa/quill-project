'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { DateRange } from 'react-day-picker';

interface DateRangeProps {
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
  userDateRange: DateRange | null;
  setUserDateRange: (range: DateRange | null) => void;
}

const DateRangeContext = createContext<DateRangeProps | null>(null);

export const DateRangeProvider = ({ children }: { children: ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [userDateRange, setUserDateRange] = useState<DateRange | null>(null);

  return (
    <DateRangeContext.Provider
      value={{ dateRange, setDateRange, userDateRange, setUserDateRange }}
    >
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRangeContext = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error(
      'useDateRange has to be used within <DateRangeContext.Provider>'
    );
  }
  return context;
};
