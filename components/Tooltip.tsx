import { formatInTimeZone } from 'date-fns-tz';
import React from 'react';

interface TooltipProps {
  active: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: string;
      spendAtSubway: number;
      spendAtChevron: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const { date, spendAtSubway, spendAtChevron } = payload[0].payload;
    const formattedDate = formatInTimeZone(date, 'UTC', 'dd MMM yyyy');

    const subwayAmount = spendAtSubway.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    const chevronAmount = spendAtChevron.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return (
      <div className="bg-white p-4 shadow-md rounded-lg">
        <p className="font-bold">{formattedDate}</p>
        <p>Subway: {subwayAmount}</p>
        <p>Chevron: {chevronAmount}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
