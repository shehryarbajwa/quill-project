import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDateRangeContext } from '@/components/context/DateRangeContext';
import { getDateRange } from '@/lib/daterange';
import { useState, useEffect } from 'react';

interface DropdownMenuRadioButtonProps {
  initialValue: string;
}

const getDisplayText = (value: string) => {
  switch (value) {
    case 'CURRENT_MONTH':
      return 'Current Month';
    case 'LAST_30_DAYS':
      return 'Last 30 Days';
    case 'LAST_60_DAYS':
      return 'Last 60 Days';
    case 'LAST_90_DAYS':
      return 'Last 90 Days';
    default:
      return 'Select a date range';
  }
};

export function DropdownMenuRadioButtons({
  initialValue,
}: DropdownMenuRadioButtonProps) {
  const { setUserDateRange } = useDateRangeContext();

  const [selectedPreset, setSelectedPreset] = useState<string>('');

  useEffect(() => {
    setSelectedPreset(initialValue);
  }, [initialValue]);

  const handlePresetChange = (newPreset: string) => {
    setSelectedPreset(newPreset);
    const newPresetDateFormat = getDateRange(newPreset);
    setUserDateRange(newPresetDateFormat);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{getDisplayText(selectedPreset)}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedPreset}
          onValueChange={(value) => handlePresetChange(value)}
        >
          <DropdownMenuRadioItem value="CURRENT_MONTH">
            {getDisplayText('CURRENT_MONTH')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="LAST_30_DAYS">
            {getDisplayText('LAST_30_DAYS')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="LAST_60_DAYS">
            {getDisplayText('LAST_60_DAYS')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="LAST_90_DAYS">
            {getDisplayText('LAST_90_DAYS')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
