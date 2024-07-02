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
    const newPresetDateFormat = getDateRange(newPreset);

    setSelectedPreset(newPreset);
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
          onValueChange={(newPreset) => handlePresetChange(newPreset)}
        >
          <DropdownMenuRadioItem value="CURRENT_MONTH">
            Current Month
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="LAST_30_DAYS">
            Last 30 Days
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="LAST_60_DAYS">
            Last 60 Days
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="LAST_90_DAYS">
            Last 90 Days
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
