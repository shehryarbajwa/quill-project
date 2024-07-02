import { format } from 'date-fns';
import React from 'react';

interface TooltipProps {
  active: boolean;
  payload?: Array<{ value: number; payload: { date: string } }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const date = payload[0].payload.date;
    const formattedDate = format(new Date(date), 'do MMMM yyyy'); // Format date as 2nd January 2024
    const totalAmount = payload[0].value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return (
      <div className="bg-white p-4 shadow-md rounded-lg">
        <p className="font-bold">{formattedDate}</p>
        <p className="text-blue-500">Chevron</p>
        <p>Total Amount: {totalAmount}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
